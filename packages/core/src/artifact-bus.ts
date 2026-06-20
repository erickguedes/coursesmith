import { Artifact } from './types.js'

export class ArtifactBus {
  private store: Map<string, Artifact> = new Map()

  publish(artifact: Artifact): void {
    const key = `${artifact.type}:${artifact.id}`
    this.store.set(key, artifact)
  }

  consume(type: string, id?: string): Artifact | undefined {
    if (id) {
      return this.store.get(`${type}:${id}`)
    }
    const candidates = Array.from(this.store.values()).filter(a => a.type === type)
    return candidates[candidates.length - 1]
  }

  consumeAll(type: string): Artifact[] {
    return Array.from(this.store.values()).filter(a => a.type === type)
  }

  list(): Artifact[] {
    return Array.from(this.store.values())
  }

  clear(): void {
    this.store.clear()
  }
}
