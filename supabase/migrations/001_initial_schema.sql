-- Crear tabla de diagramas
CREATE TABLE diagrams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled Diagram',
    description TEXT,
    diagram_type VARCHAR(50) DEFAULT 'flowchart',
    mermaid_code TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de versiones de diagramas
CREATE TABLE diagram_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagram_id UUID REFERENCES diagrams(id) ON DELETE CASCADE,
    mermaid_code TEXT NOT NULL,
    change_description VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de API keys (encriptadas)
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    encrypted_key TEXT NOT NULL,
    service_name VARCHAR(50) NOT NULL DEFAULT 'gemini',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimización
CREATE INDEX idx_diagrams_user_id ON diagrams(user_id);
CREATE INDEX idx_diagrams_created_at ON diagrams(created_at DESC);
CREATE INDEX idx_diagrams_public ON diagrams(is_public) WHERE is_public = true;
CREATE INDEX idx_diagram_versions_diagram_id ON diagram_versions(diagram_id);
CREATE INDEX idx_diagram_versions_created_at ON diagram_versions(created_at DESC);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);

-- Configurar Row Level Security (RLS)
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view their own diagrams" ON diagrams
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own diagrams" ON diagrams
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagrams" ON diagrams
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagrams" ON diagrams
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para versiones de diagramas
CREATE POLICY "Users can view versions of their diagrams" ON diagram_versions
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM diagrams 
        WHERE diagrams.id = diagram_versions.diagram_id 
        AND (diagrams.user_id = auth.uid() OR diagrams.is_public = true)
    ));

CREATE POLICY "Users can insert versions for their diagrams" ON diagram_versions
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM diagrams 
        WHERE diagrams.id = diagram_versions.diagram_id 
        AND diagrams.user_id = auth.uid()
    ));

-- Políticas para API keys
CREATE POLICY "Users can manage their own API keys" ON api_keys
    FOR ALL USING (auth.uid() = user_id);

-- Permisos básicos
GRANT SELECT ON diagrams TO anon;
GRANT ALL PRIVILEGES ON diagrams TO authenticated;
GRANT ALL PRIVILEGES ON diagram_versions TO authenticated;
GRANT ALL PRIVILEGES ON api_keys TO authenticated;

-- Datos iniciales de ejemplo
INSERT INTO diagrams (user_id, title, description, diagram_type, mermaid_code, is_public)
VALUES 
    (NULL, 'Ejemplo: Flujo de Proceso', 'Diagrama de ejemplo para demostración', 'flowchart', 
     'graph TD\n    A[Inicio] --> B[Proceso]\n    B --> C[Decisión]\n    C -->|Sí| D[Acción 1]\n    C -->|No| E[Acción 2]\n    D --> F[Fin]\n    E --> F', 
     true),
    (NULL, 'Ejemplo: Diagrama de Secuencia', 'Ejemplo de interacción entre sistemas', 'sequence',
     'sequenceDiagram\n    participant A as Usuario\n    participant B as Sistema\n    A->>B: Solicitud\n    B-->>A: Respuesta',
     true);