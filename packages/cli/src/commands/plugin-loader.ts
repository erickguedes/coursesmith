import * as fs from 'fs/promises'
import * as path from 'path'
import { PluginRegistry, Plugin, PluginManifest } from '@coursesmith/core'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export async function discoverAndRegisterPlugins(
  registry: PluginRegistry,
  projectDir: string
): Promise<void> {
  const pluginDirs = [
    path.join(projectDir, 'node_modules'),
    path.join(projectDir, '.coursesmith', 'plugins'),
    path.join(projectDir, 'plugins'),
  ]

  for (const dir of pluginDirs) {
    await scanDir(registry, dir)
  }

  const builtinNames = [
    '@coursesmith/web-research',
    '@coursesmith/teacher',
    '@coursesmith/quiz-generator',
    '@coursesmith/flashcard-generator',
    '@coursesmith/publisher',
  ]

  for (const name of builtinNames) {
    try {
      const mod = require(name)
      const plugin = mod.default || mod.plugin
      if (plugin && plugin.manifest) {
        registry.register(plugin)
      }
    } catch {
      // Plugin not available, skip
    }
  }
}

async function scanDir(registry: PluginRegistry, dir: string): Promise<void> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const pluginDir = path.join(dir, entry.name)
        const manifestPath = path.join(pluginDir, 'plugin.yaml')
        try {
          await fs.access(manifestPath)
          const manifestContent = await fs.readFile(manifestPath, 'utf-8')
          const { parse } = require('yaml')
          const manifest = parse(manifestContent) as PluginManifest

          const distPath = path.join(pluginDir, 'dist', 'index.js')
          try {
            await fs.access(distPath)
            const pluginModule = require(distPath)
            const plugin = pluginModule.default || pluginModule.plugin
            if (plugin) {
              registry.register(plugin)
            }
          } catch {
            // No dist, skip
          }
        } catch {
          // Not a plugin, skip
        }
      }
    }
  } catch {
    // Directory doesn't exist, skip
  }
}
