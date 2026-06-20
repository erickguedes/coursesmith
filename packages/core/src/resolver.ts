import { PluginRegistry } from './registry.js'
import { Plugin } from './types.js'

export class CapabilityResolver {
  constructor(private registry: PluginRegistry) {}

  resolve(capabilityId: string, preferredPlugin?: string): Plugin {
    if (preferredPlugin) {
      const plugin = this.registry.getPlugin(preferredPlugin)
      if (plugin && plugin.manifest.capabilities.some(c => c.id === capabilityId)) {
        return plugin
      }
      throw new Error(
        `Plugin "${preferredPlugin}" does not provide capability "${capabilityId}"`
      )
    }

    const plugins = this.registry.findPluginsByCapability(capabilityId)
    if (plugins.length === 0) {
      throw new Error(`No plugin provides capability "${capabilityId}"`)
    }

    plugins.sort((a, b) => b.manifest.version.localeCompare(a.manifest.version))
    return plugins[0]
  }
}
