# 🌊 Mermaid Flow AI

<div align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</div>

<div align="center">
  <h3>🚀 AI-Powered Mermaid Diagram Editor</h3>
  <p>A modern, cyberpunk-themed live editor for creating beautiful Mermaid.js diagrams with AI assistance</p>
</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Tech Stack](#-tech-stack)
- [⚡ Quick Start](#-quick-start)
- [🔧 Installation](#-installation)
- [🌍 Environment Setup](#-environment-setup)
- [🎯 Usage Guide](#-usage-guide)
- [📚 API Documentation](#-api-documentation)
- [🏗️ Project Structure](#️-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Cyberpunk Aesthetic**: Neon colors, futuristic interface with glitch effects
- **Dark/Light Theme**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Split-pane Layout**: Resizable editor and preview panels

### ⚡ **Real-time Editing**
- **Live Preview**: Instant diagram rendering as you type
- **Syntax Highlighting**: Monaco Editor with Mermaid syntax support
- **Auto-completion**: Intelligent code suggestions and snippets
- **Error Detection**: Real-time syntax validation and error highlighting

### 🤖 **AI Integration**
- **Smart Error Correction**: Fix Mermaid.js syntax errors with Google Gemini AI
- **Code Optimization**: AI-powered suggestions for better diagram structure
- **Natural Language Processing**: Convert text descriptions to Mermaid diagrams
- **Context-aware Assistance**: Intelligent help based on current diagram type

### 📤 **Export & Sharing**
- **Multiple Formats**: Export to PNG, JPG, SVG, and PDF
- **High-quality Output**: Vector and raster formats with customizable resolution
- **Cloud Storage**: Save and sync diagrams with Supabase backend
- **Version History**: Track changes and restore previous versions

### 🔒 **Security & Privacy**
- **Secure API Management**: Encrypted storage of API keys
- **Row-level Security**: User data isolation with Supabase RLS
- **Local Storage**: Option to work offline without cloud sync
- **No Data Collection**: Privacy-first approach with minimal tracking

## 🚀 Tech Stack

### **Frontend**
- **React 18** - Modern React with Hooks and Concurrent Features
- **TypeScript 5** - Type-safe development with latest TS features
- **Vite 5** - Lightning-fast build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible component library

### **Editor & Visualization**
- **Monaco Editor** - VS Code's editor with full IntelliSense
- **Mermaid.js** - Diagram and flowchart generation
- **React Flow** - Interactive node-based diagrams
- **Lucide React** - Beautiful, customizable icons

### **Backend & Services**
- **Supabase** - Open-source Firebase alternative
- **PostgreSQL** - Robust relational database
- **Google Gemini API** - Advanced AI language model
- **Vercel** - Deployment and hosting platform

### **Development Tools**
- **Bun** - Fast JavaScript runtime and package manager
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting and style consistency
- **Husky** - Git hooks for pre-commit validation

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/danielxxomg2/mermaid-flow-ai.git
cd mermaid-flow-ai

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
bun run dev
```

🎉 Open [http://localhost:5173](http://localhost:5173) to see the app!

## 🔧 Installation

### **Prerequisites**

- **Node.js** 18+ or **Bun** 1.0+
- **Git** for version control
- **Supabase Account** (free tier available)
- **Google AI Studio Account** (for Gemini API)

### **Step-by-step Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/danielxxomg2/mermaid-flow-ai.git
   cd mermaid-flow-ai
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install
   
   # Or using npm
   npm install
   
   # Or using yarn
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure your environment** (see [Environment Setup](#-environment-setup))

5. **Run database migrations** (if using Supabase)
   ```bash
   bunx supabase db push
   ```

6. **Start the development server**
   ```bash
   bun run dev
   ```

## 🌍 Environment Setup

### **Required Environment Variables**

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Google Gemini API (for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### **Supabase Setup**

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project URL and anon key** from Settings → API
3. **Run the database migration**:
   ```sql
   -- Copy and paste the contents of supabase/migrations/001_initial_schema.sql
   -- into your Supabase SQL editor
   ```

### **Google Gemini API Setup**

1. **Visit** [Google AI Studio](https://aistudio.google.com/app/welcome)
2. **Create an API key** for Gemini
3. **Add the key** to your `.env` file

## 🐳 Docker Deployment

### **Coming Soon**

We're working on Docker support to make deployment even easier! This will include:

- **Multi-stage Docker builds** for optimized production images
- **Docker Compose** setup with Supabase integration
- **Environment variable management** for containerized deployments
- **Health checks** and monitoring capabilities
- **Kubernetes manifests** for scalable deployments

**Expected features:**
```bash
# Quick start with Docker (Coming Soon)
docker-compose up -d

# Or with Docker
docker run -p 3000:3000 danielxxomg2/mermaid-flow-ai
```

📅 **ETA:** Q2 2024 - Stay tuned for updates!

## 🎯 Usage Guide

### **Basic Workflow**

1. **📝 Write Mermaid Code**
   - Use the left panel Monaco editor
   - Enjoy syntax highlighting and auto-completion
   - Try different diagram types (flowchart, sequence, class, etc.)

2. **👀 Real-time Preview**
   - See your diagram render instantly in the right panel
   - Zoom, pan, and interact with the diagram
   - Responsive layout adapts to your screen size

3. **🤖 AI Assistance**
   - Click the AI button when you encounter errors
   - Get intelligent suggestions for improvements
   - Convert natural language to Mermaid syntax

4. **💾 Save & Export**
   - Save diagrams to your Supabase account
   - Export in multiple formats (PNG, SVG, PDF)
   - Share diagrams with public links

### **Supported Diagram Types**

- **Flowcharts** - Process flows and decision trees
- **Sequence Diagrams** - System interactions over time
- **Class Diagrams** - Object-oriented design
- **State Diagrams** - State machines and transitions
- **Entity Relationship** - Database schemas
- **User Journey** - User experience flows
- **Gantt Charts** - Project timelines
- **Pie Charts** - Data visualization
- **Git Graphs** - Version control workflows

### **Keyboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save diagram |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` | Redo |
| `Ctrl/Cmd + /` | Toggle comments |
| `F11` | Toggle fullscreen |
| `Ctrl/Cmd + E` | Export diagram |
| `Ctrl/Cmd + K` | Open command palette |

## 📚 API Documentation

### **Supabase Schema**

#### **Tables**

- **`diagrams`** - Store user diagrams
- **`diagram_versions`** - Version history
- **`api_keys`** - Encrypted API key storage

#### **Row Level Security**

All tables implement RLS policies to ensure users can only access their own data.

### **AI Service Integration**

```typescript
// Example: Using the AI service
import { aiService } from './services/aiService';

const correctedCode = await aiService.correctMermaidSyntax(
  'graph TD\n  A -> B',
  'The arrow syntax is incorrect'
);
```

## 🏗️ Project Structure

```
mermaid-flow-ai/
├── 📁 public/                 # Static assets
├── 📁 src/
│   ├── 📁 components/         # React components
│   │   ├── CodeEditor.tsx     # Monaco editor wrapper
│   │   ├── DiagramViewer.tsx  # Mermaid diagram renderer
│   │   ├── Toolbar.tsx        # Main toolbar
│   │   ├── SettingsModal.tsx  # Configuration modal
│   │   └── ExportModal.tsx    # Export options modal
│   ├── 📁 hooks/              # Custom React hooks
│   │   ├── useHistory.ts      # Undo/redo functionality
│   │   └── useTheme.ts        # Theme management
│   ├── 📁 lib/                # Utility libraries
│   │   ├── supabase.ts        # Supabase client
│   │   └── utils.ts           # Helper functions
│   ├── 📁 services/           # External service integrations
│   │   └── aiService.ts       # Google Gemini API
│   ├── 📁 store/              # State management
│   │   └── useStore.ts        # Zustand store
│   ├── 📁 pages/              # Page components
│   │   └── Home.tsx           # Main application page
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
├── 📁 supabase/               # Database schema
│   └── migrations/            # SQL migration files
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
└── vercel.json                # Vercel deployment config
```

### **Key Components**

- **`App.tsx`** - Main application component with state management
- **`CodeEditor.tsx`** - Monaco editor with Mermaid syntax highlighting
- **`DiagramViewer.tsx`** - Mermaid diagram renderer with zoom/pan
- **`aiService.ts`** - Google Gemini API integration for error correction
- **`useStore.ts`** - Centralized state management with Zustand

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### **Development Workflow**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   bun run lint
   bun run type-check
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### **Commit Convention**

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Maintenance tasks

### **Code Style**

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Write **meaningful commit messages**
- Add **JSDoc comments** for complex functions
- Ensure **responsive design** for new UI components

### **Testing**

- Write unit tests for new utilities and hooks
- Test components with React Testing Library
- Ensure cross-browser compatibility
- Test responsive design on multiple screen sizes

## 🐛 Bug Reports

Found a bug? Please create an issue with:

- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Browser and OS information**
- **Screenshots** if applicable

## 💡 Feature Requests

Have an idea? We'd love to hear it! Please include:

- **Clear description** of the feature
- **Use case** and benefits
- **Mockups or examples** if applicable

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary**

- ✅ **Commercial use** - Use in commercial projects
- ✅ **Modification** - Modify the source code
- ✅ **Distribution** - Distribute the software
- ✅ **Private use** - Use for private projects
- ❌ **Liability** - No warranty or liability
- ❌ **Warranty** - No warranty provided

---

<div align="center">
  <p>Made with ❤️ by the Mermaid Flow AI team</p>
  <p>
    <a href="https://github.com/danielxxomg2/mermaid-flow-ai/issues">Report Bug</a> ·
    <a href="https://github.com/danielxxomg2/mermaid-flow-ai/issues">Request Feature</a> ·
    <a href="https://github.com/danielxxomg2/mermaid-flow-ai/discussions">Discussions</a>
  </p>
</div>

## 🙏 Acknowledgments

- **[Mermaid.js](https://mermaid.js.org/)** - Amazing diagram generation library
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - Powerful code editor
- **[Supabase](https://supabase.com/)** - Open-source backend platform
- **[Google Gemini](https://ai.google.dev/)** - Advanced AI language model
- **[Shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

## 📊 Project Stats

<div align="center">
  <img src="https://img.shields.io/github/stars/danielxxomg2/mermaid-flow-ai?style=social" alt="GitHub stars" />
  <img src="https://img.shields.io/github/forks/danielxxomg2/mermaid-flow-ai?style=social" alt="GitHub forks" />
  <img src="https://img.shields.io/github/issues/danielxxomg2/mermaid-flow-ai" alt="GitHub issues" />
  <img src="https://img.shields.io/github/license/danielxxomg2/mermaid-flow-ai" alt="License" />
</div>
