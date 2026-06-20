import { Artifact, Plugin } from '@coursesmith/core'

const manifest = {
  name: '@coursesmith/quiz-generator',
  version: '1.0.0',
  type: 'agent',
  description: 'Generates quiz questions from lesson content',
  capabilities: [
    {
      id: 'generate-quiz',
      version: '1.0',
      description: 'Creates quiz questions from lesson content',
      input: [{ type: 'lesson', version: '1.x' }],
      output: [{ type: 'quiz', version: '1.0' }],
    },
  ],
}

async function execute(
  capability: string,
  input: Artifact[],
  config: Record<string, unknown>
): Promise<Artifact[]> {
  const now = new Date().toISOString()
  const questionsPerLesson = (config.questionsPerLesson as number) || 5

  switch (capability) {
    case 'generate-quiz': {
      const lessons = input.filter(
        a => a.type === 'lesson' || a.type === 'enriched-lesson'
      )

      console.log(`    📝 Generating ${questionsPerLesson} questions for ${lessons.length} lesson(s)`)

      return lessons.map((lesson, li) => {
        const topic = lesson.title
        const questions = generateQuizQuestions(topic, questionsPerLesson)

        return {
          id: `quiz-${li + 1}`,
          type: 'quiz',
          version: '1.0.0',
          title: `Quiz: ${topic}`,
          createdBy: '@coursesmith/quiz-generator',
          createdAt: now,
          schemaVersion: '1.0',
          data: {
            lessonId: lesson.id,
            questions,
            passThreshold: 0.7,
          } as Record<string, unknown>,
        }
      })
    }

    default:
      throw new Error(`Unsupported capability: ${capability}`)
  }
}

function generateQuizQuestions(topic: string, count: number): Record<string, unknown>[] {
  const questions: Record<string, unknown>[] = []

  const types = ['multiple-choice', 'true-false', 'multiple-choice', 'true-false', 'multiple-choice']

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length]
    questions.push({
      id: `q-${i + 1}`,
      type,
      question: `What is a key aspect of ${topic}?`,
      options: type === 'multiple-choice'
        ? [
            `A: The primary benefit of ${topic}`,
            `B: An alternative approach to ${topic}`,
            `C: A common misconception about ${topic}`,
            `D: All of the above`,
          ]
        : undefined,
      answer: type === 'multiple-choice' ? 'D' : 'true',
      explanation: `This question tests understanding of ${topic} fundamentals.`,
      difficulty: i < 2 ? 'easy' : i < 4 ? 'medium' : 'hard',
    })
  }

  return questions
}

export const plugin: Plugin = { manifest, execute }
export default plugin
