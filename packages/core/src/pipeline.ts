import { ArtifactBus } from './artifact-bus.js'
import { CapabilityResolver } from './resolver.js'
import { PluginRegistry } from './registry.js'
import { PipelineDefinition, PipelineStep, Artifact } from './types.js'

export class PipelineEngine {
  constructor(
    private registry: PluginRegistry,
    private resolver: CapabilityResolver,
    private bus: ArtifactBus
  ) {}

  async execute(pipeline: PipelineDefinition, initialArtifacts: Artifact[]): Promise<Artifact[]> {
    for (const artifact of initialArtifacts) {
      this.bus.publish(artifact)
    }

    for (const step of pipeline.steps) {
      await this.executeStep(step)
    }

    return this.bus.list()
  }

  private async executeStep(step: PipelineStep): Promise<void> {
    const plugin = this.resolver.resolve(step.capability)

    const inputTypes = Array.isArray(step.input) ? step.input : [step.input]
    const inputs: Artifact[] = []
    for (const type of inputTypes) {
      const allOfType = this.bus.consumeAll(type)
      inputs.push(...allOfType)
    }

    if (inputs.length === 0) {
      const existing = this.bus.list()
      const matched = existing.filter(a => inputTypes.includes(a.type))
      inputs.push(...matched)

      if (inputs.length === 0) {
        console.log(`  ⚠ ${step.id}: no input artifacts found for types [${inputTypes.join(', ')}]`)
        return
      }
    }

    const maxAttempts = step.retry?.maxAttempts ?? 1
    let lastError: Error | undefined

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const outputs = await plugin.execute(step.capability, inputs, step.config || {})

        for (const output of outputs) {
          this.bus.publish(output)
        }

        console.log(`  ✓ ${step.id} (${step.capability}) → ${outputs.length} artifact(s)`)
        return
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
        if (attempt < maxAttempts) {
          const delay = step.retry?.delay ?? 5000
          console.log(`  ⚠ ${step.id} failed (attempt ${attempt}), retrying in ${delay}ms...`)
          await new Promise(r => setTimeout(r, delay))
        }
      }
    }

    throw new Error(
      `Step "${step.id}" (${step.capability}) failed after ${maxAttempts} attempt(s): ${lastError!.message}`
    )
  }
}
