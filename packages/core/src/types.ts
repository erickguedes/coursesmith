export interface Artifact {
  id: string
  type: string
  version: string
  title: string
  createdBy: string
  createdAt: string
  schemaVersion: string
  data: Record<string, unknown>
  metadata?: Record<string, unknown>
  dependsOn?: string[]
}

export interface CapabilityDefinition {
  id: string
  version: string
  description: string
  input: { type: string; version: string }[]
  output: { type: string; version: string }[]
  config?: Record<string, unknown>
}

export interface PluginManifest {
  name: string
  version: string
  type: string
  description: string
  capabilities: CapabilityDefinition[]
}

export interface Plugin {
  manifest: PluginManifest
  execute: (capability: string, input: Artifact[], config: Record<string, unknown>) => Promise<Artifact[]>
}

export interface PipelineDefinition {
  name: string
  version: string
  description: string
  steps: PipelineStep[]
}

export interface PipelineStep {
  id: string
  capability: string
  input: string | string[]
  output: string
  config?: Record<string, unknown>
  parallel?: boolean
  retry?: {
    maxAttempts: number
    delay: number
  }
}

export interface ProjectConfig {
  project: {
    name: string
    version: string
  }
  pipeline: string
  runtime?: {
    provider?: string
    model?: string
    apiKey?: string
    temperature?: number
  }
  input?: {
    sources: string[]
  }
  output?: {
    directory: string
    format?: string
  }
  plugins?: string[]
  plugins_config?: Record<string, Record<string, unknown>>
}
