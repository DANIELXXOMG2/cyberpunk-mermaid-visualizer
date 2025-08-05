import { toast } from 'sonner';

export interface AiFixResult {
  success: boolean;
  fixedCode?: string;
  explanation?: string;
  error?: string;
}

export class AiService {
  private static readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
  static async fixMermaidCode(code: string, apiKey: string, errorMessage?: string): Promise<AiFixResult> {
    if (!apiKey.trim()) {
      return {
        success: false,
        error: 'API key is required. Please configure it in settings.'
      };
    }

    if (!code.trim()) {
      return {
        success: false,
        error: 'No code to fix.'
      };
    }

    try {
      const prompt = this.buildPrompt(code, errorMessage);
      
      const response = await fetch(`${this.GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from AI model');
      }

      const content = data.candidates[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error('Empty response from AI model');
      }

      return this.parseAiResponse(content);
      
    } catch (error) {
      console.error('AI Service Error:', error);
      
      let errorMessage = 'Failed to fix code with AI';
      
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID')) {
          errorMessage = 'Invalid API key. Please check your Gemini API key in settings.';
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
          errorMessage = 'API quota exceeded. Please try again later.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  private static buildPrompt(code: string, errorMessage?: string): string {
    const basePrompt = `You are an expert in Mermaid.js diagram syntax. Your task is to fix the provided Mermaid code and make it syntactically correct.

Rules:
1. Return ONLY the fixed Mermaid code, nothing else
2. Preserve the original intent and structure as much as possible
3. Fix syntax errors, invalid node IDs, and formatting issues
4. Ensure all connections are valid
5. Use proper Mermaid.js syntax for the diagram type
6. Do not add explanations or comments

Original Mermaid code:
\`\`\`mermaid
${code}
\`\`\``;

    if (errorMessage) {
      return `${basePrompt}

Error message: ${errorMessage}

Fixed code:`;
    }

    return `${basePrompt}

Fixed code:`;
  }

  private static parseAiResponse(response: string): AiFixResult {
    try {
      // Extract code from markdown blocks
      const codeBlockRegex = /```(?:mermaid)?\s*([\s\S]*?)```/g;
      const matches = [...response.matchAll(codeBlockRegex)];
      
      if (matches.length > 0) {
        const fixedCode = matches[0][1].trim();
        
        if (fixedCode) {
          return {
            success: true,
            fixedCode,
            explanation: 'Code fixed by AI'
          };
        }
      }
      
      // If no code blocks found, try to extract code directly
      const lines = response.split('\n');
      const codeLines = lines.filter(line => 
        line.trim() && 
        !line.toLowerCase().includes('here') &&
        !line.toLowerCase().includes('fixed') &&
        !line.toLowerCase().includes('code')
      );
      
      if (codeLines.length > 0) {
        const fixedCode = codeLines.join('\n').trim();
        
        if (fixedCode) {
          return {
            success: true,
            fixedCode,
            explanation: 'Code extracted and fixed by AI'
          };
        }
      }
      
      return {
        success: false,
        error: 'Could not extract valid Mermaid code from AI response'
      };
      
    } catch (_) {
      return {
        success: false,
        error: 'Failed to parse AI response'
      };
    }
  }

  static async validateApiKey(apiKey: string): Promise<boolean> {
    if (!apiKey.trim()) return false;
    
    try {
      const response = await fetch(`${this.GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Hello' }]
          }]
        })
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }

  static showAiFixToast(result: AiFixResult) {
    if (result.success) {
      toast.success('AI Fix Applied', {
        description: result.explanation || 'Code has been fixed by AI',
        duration: 3000,
      });
    } else {
      toast.error('AI Fix Failed', {
        description: result.error || 'Failed to fix code with AI',
        duration: 5000,
      });
    }
  }
}