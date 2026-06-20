import { Plugin, CapabilityDefinition } from './types.js'

export class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map()
  private capabilityIndex: Map<string, string[]> = new Map()

  register(plugin: Plugin): void {
    this.plugins.set(plugin.manifest.name, plugin)
    for (const cap of plugin.manifest.capabilities) {
      const existing = this.capabilityIndex.get(cap.id) || []
      existing.push(plugin.manifest.name)
      this.capabilityIndex.set(cap.id, existing)
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name)
  }

  findPluginsByCapability(capability: string): Plugin[] {
    const names = this.capabilityIndex.get(capability) || []
    return names.map(n => this.plugins.get(n)).filter(Boolean) as Plugin[]
  }

  getCapabilityDefinitions(capabilityId: string): CapabilityDefinition[] {
    const plugins = this.findPluginsByCapability(capabilityId)
    const defs: CapabilityDefinition[] = []
    for (const p of plugins) {
      const cap = p.manifest.capabilities.find(c => c.id === capabilityId)
      if (cap) defs.push(cap)
    }
    return defs
  }

  listCapabilities(): string[] {
    return Array.from(this.capabilityIndex.keys())
  }

  listPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }
}
