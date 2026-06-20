import { Artifact, Plugin } from '@coursesmith/core'

const manifest = {
  name: '@coursesmith/flashcard-generator',
  version: '1.0.0',
  type: 'agent',
  description: 'Generates flashcards from lesson content',
  capabilities: [
    {
      id: 'generate-flashcards',
      version: '1.0',
      description: 'Creates flashcards from lesson content',
      input: [{ type: 'lesson', version: '1.x' }],
      output: [{ type: 'flashcards', version: '1.0' }],
    },
  ],
}

async function execute(
  capability: string,
  input: Artifact[],
  config: Record<string, unknown>
): Promise<Artifact[]> {
  const now = new Date().toISOString()
  const cardsPerLesson = (config.cardsPerLesson as number) || 8

  switch (capability) {
    case 'generate-flashcards': {
      const lessons = input.filter(
        a => a.type === 'lesson' || a.type === 'enriched-lesson'
      )

      console.log(`    🃏 Generating ${cardsPerLesson} cards for ${lessons.length} lesson(s)`)

      return lessons.map((lesson, li) => {
        const topic = lesson.title
        const cards = generateFlashcards(topic, cardsPerLesson)

        return {
          id: `flashcards-${li + 1}`,
          type: 'flashcards',
          version: '1.0.0',
          title: `Flashcards: ${topic}`,
          createdBy: '@coursesmith/flashcard-generator',
          createdAt: now,
          schemaVersion: '1.0',
          data: {
            lessonId: lesson.id,
            cards,
          } as Record<string, unknown>,
        }
      })
    }

    default:
      throw new Error(`Unsupported capability: ${capability}`)
  }
}

function generateFlashcards(topic: string, count: number): Record<string, unknown>[] {
  const cards: Record<string, unknown>[] = []
  for (let i = 0; i < count; i++) {
    cards.push({
      id: `fc-${i + 1}`,
      front: `What is a key concept of ${topic}?`,
      back: `This relates to the fundamental principles of ${topic} and how they apply in practice.`,
      difficulty: i < 3 ? 'easy' : i < 6 ? 'medium' : 'hard',
      tags: [topic.toLowerCase().replace(/\s+/g, '-'), 'core-concept'],
    })
  }
  return cards
}

export const plugin: Plugin = { manifest, execute }
export default plugin
