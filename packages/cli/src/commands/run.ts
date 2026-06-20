import * as path from 'path'
import * as fs from 'fs/promises'
import { loadConfig, loadPipelineDefinition, getOutputDir, PluginRegistry, CapabilityResolver, PipelineEngine, ArtifactBus, Artifact } from '@coursesmith/core'
import { discoverAndRegisterPlugins } from './plugin-loader.js'

export async function runCommand(options: { pipeline?: string; output?: string; dryRun?: boolean }): Promise<void> {
  const projectDir = process.cwd()

  console.log(`\n  📚 CourseSmith Pipeline Runner\n`)

  const config = loadConfig(projectDir)
  console.log(`  Project: ${config.project.name} v${config.project.version}`)

  const pipelineName = options.pipeline || config.pipeline
  const pipelineDef = loadPipelineDefinition(projectDir, pipelineName)
  console.log(`  Pipeline: ${pipelineDef.name} (${pipelineDef.description})\n`)

  if (options.dryRun) {
    console.log('  🔍 Dry-run mode: configuration is valid')
    console.log(`  Steps: ${pipelineDef.steps.map(s => s.capability).join(' → ')}`)
    return
  }

  const registry = new PluginRegistry()
  await discoverAndRegisterPlugins(registry, projectDir)

  const capabilities = registry.listCapabilities()
  console.log(`  Plugins loaded: ${registry.listPlugins().length}`)
  console.log(`  Capabilities: ${capabilities.join(', ')}\n`)

  const resolver = new CapabilityResolver(registry)
  const bus = new ArtifactBus()
  const engine = new PipelineEngine(registry, resolver, bus)

  const inputArtifacts: Artifact[] = []
  if (config.input?.sources) {
    for (const source of config.input.sources) {
      const sourcePath = path.resolve(projectDir, source)
      try {
        const content = await fs.readFile(sourcePath, 'utf-8')
        inputArtifacts.push({
          id: `source-${path.basename(source, path.extname(source))}`,
          type: 'raw-source',
          version: '1.0.0',
          title: path.basename(source),
          createdBy: 'config-loader',
          createdAt: new Date().toISOString(),
          schemaVersion: '1.0',
          data: { content, filename: source },
        })
        console.log(`  📄 Loaded source: ${source}`)
      } catch {
        console.log(`  ⚠ Source not found: ${source} (will use topic-based generation)`)
        inputArtifacts.push({
          id: 'topic-only',
          type: 'raw-source',
          version: '1.0.0',
          title: config.project.name,
          createdBy: 'config-loader',
          createdAt: new Date().toISOString(),
          schemaVersion: '1.0',
          data: { content: `Topic: ${config.project.name}`, filename: 'topic.md' },
        })
      }
    }
  } else {
    inputArtifacts.push({
      id: 'topic-only',
      type: 'raw-source',
      version: '1.0.0',
      title: config.project.name,
      createdBy: 'config-loader',
      createdAt: new Date().toISOString(),
      schemaVersion: '1.0',
      data: { content: `Topic: ${config.project.name}`, filename: 'topic.md' },
    })
  }

  try {
    console.log('  🚀 Executing pipeline...\n')
    const finalArtifacts = await engine.execute(pipelineDef, inputArtifacts)

    const outputDir = options.output || getOutputDir(config, projectDir)
    console.log(`\n  ✅ Pipeline completed! ${finalArtifacts.length} artifacts produced`)
    console.log(`  📁 Output: ${outputDir}`)

    for (const artifact of finalArtifacts) {
      console.log(`    - ${artifact.type}: ${artifact.title}`)
    }
  } catch (err) {
    console.error(`\n  ❌ Pipeline failed: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }
}
