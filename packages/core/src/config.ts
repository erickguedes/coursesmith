import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { ProjectConfig, PipelineDefinition } from './types.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { parse } = require('yaml')

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function loadConfig(dir: string): ProjectConfig {
  const candidates = ['coursesmith.yaml', 'coursesmith.yml']
  for (const file of candidates) {
    const filepath = path.join(dir, file)
    if (fs.existsSync(filepath)) {
      const content = fs.readFileSync(filepath, 'utf-8')
      return parse(content) as ProjectConfig
    }
  }
  throw new Error(`No coursesmith.yaml found in ${dir}`)
}

export function loadPipelineDefinition(dir: string, name: string): PipelineDefinition {
  const pipelineDir = path.join(dir, 'pipelines')
  const candidates = [
    path.join(pipelineDir, `${name}.yaml`),
    path.join(pipelineDir, `${name}.yml`),
  ]
  for (const filepath of candidates) {
    if (fs.existsSync(filepath)) {
      const content = fs.readFileSync(filepath, 'utf-8')
      const parsed = parse(content) as any
      return parsed.pipeline || parsed
    }
  }

  const builtinCandidates = [
    path.join(__dirname, '..', 'pipelines', `${name}.yaml`),
    path.join(__dirname, '..', 'pipelines', `${name}.yml`),
    path.join(__dirname, '..', '..', 'pipelines', `${name}.yaml`),
    path.join(dir, 'node_modules', 'coursesmith-core', 'core', 'pipelines', `${name}.yaml`),
  ]
  for (const filepath of builtinCandidates) {
    if (fs.existsSync(filepath)) {
      const content = fs.readFileSync(filepath, 'utf-8')
      const parsed = parse(content) as any
      return parsed.pipeline || parsed
    }
  }

  throw new Error(`Pipeline "${name}" not found`)
}

export function getOutputDir(config: ProjectConfig, baseDir: string): string {
  return path.resolve(baseDir, config.output?.directory || './output')
}
