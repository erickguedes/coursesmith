import { Artifact, Plugin } from '@coursesmith/core'

const manifest = {
  name: '@coursesmith/teacher',
  version: '1.0.0',
  type: 'agent',
  description: 'Generates lesson content from lesson plans and course structures',
  capabilities: [
    {
      id: 'generate-lesson',
      version: '1.0',
      description: 'Generates full lesson content from a lesson plan',
      input: [{ type: 'lesson-plan', version: '1.x' }],
      output: [{ type: 'lesson', version: '1.0' }],
    },
    {
      id: 'design-curriculum',
      version: '1.0',
      description: 'Designs course curriculum from raw source material',
      input: [{ type: 'raw-source', version: '1.x' }],
      output: [{ type: 'course-structure', version: '1.0' }],
    },
    {
      id: 'plan-lessons',
      version: '1.0',
      description: 'Creates lesson plans from course structure',
      input: [{ type: 'course-structure', version: '1.x' }],
      output: [{ type: 'lesson-plan', version: '1.0' }],
    },
  ],
}

function extractTopics(content: string): string[] {
  const lines = content.split('\n')
  const topics: string[] = []
  for (const line of lines) {
    const trimmed = line.replace(/^[#*\-\s•·]*/, '').trim()
    if (trimmed && trimmed.length > 3 && trimmed.length < 200) {
      const isHeading = line.startsWith('#') || line.match(/^[A-Z][a-z]+/)
      if (isHeading || line.startsWith('-') || line.startsWith('*')) {
        topics.push(trimmed)
      }
    }
  }
  return topics.length > 0 ? topics : [content.substring(0, 100).trim()]
}

function generateModuleStructure(topics: string[], moduleCount: number = 3) {
  const modules: { name: string; lessons: string[] }[] = []
  const topicsPerModule = Math.max(1, Math.ceil(topics.length / moduleCount))

  for (let i = 0; i < Math.min(moduleCount, Math.ceil(topics.length / topicsPerModule)); i++) {
    const moduleTopics = topics.slice(i * topicsPerModule, (i + 1) * topicsPerModule)
    modules.push({
      name: `Module ${i + 1}: ${moduleTopics[0] || `Topic Cluster ${i + 1}`}`,
      lessons: moduleTopics,
    })
  }

  return modules
}

async function execute(
  capability: string,
  input: Artifact[],
  config: Record<string, unknown>
): Promise<Artifact[]> {
  const now = new Date().toISOString()
  const tone = (config.tone as string) || 'professional'
  const examples = (config.examples as number) || 3

  switch (capability) {
    case 'design-curriculum': {
      const source = input.find(a => a.type === 'raw-source' || a.type === 'enriched-syllabus')
      const content = (source?.data?.content as string) || ''
      const topics = extractTopics(content)

      console.log(`    📐 Designing curriculum from ${topics.length} topics`)

      const modules = generateModuleStructure(topics)

      return [
        {
          id: `course-structure-${Date.now()}`,
          type: 'course-structure',
          version: '1.0.0',
          title: 'Course Structure',
          createdBy: '@coursesmith/teacher',
          createdAt: now,
          schemaVersion: '1.0',
          data: {
            modules,
            totalLessons: topics.length,
          } as Record<string, unknown>,
        },
      ]
    }

    case 'plan-lessons': {
      const structure = input.find(a => a.type === 'course-structure')
      const modules = (structure?.data?.modules as any[]) || []

      console.log(`    📝 Planning ${modules.length} module(s)`)

      const plans: Record<string, unknown>[] = []
      for (const mod of modules) {
        const lessonTopics = (mod.lessons as string[]) || []
        for (const topic of lessonTopics) {
          plans.push({
            moduleName: mod.name,
            topic,
            objectives: [
              `Understand ${topic}`,
              `Apply ${topic} in practice`,
              `Analyze use cases for ${topic}`,
            ],
            estimatedMinutes: 45,
            difficulty: 'intermediate',
          })
        }
      }

      return plans.map((plan, i) => ({
        id: `lesson-plan-${i + 1}`,
        type: 'lesson-plan',
        version: '1.0.0',
        title: `Plan: ${plan.topic as string}`,
        createdBy: '@coursesmith/teacher',
        createdAt: now,
        schemaVersion: '1.0',
        data: plan,
      }))
    }

    case 'generate-lesson': {
      const plans = input.filter(a => a.type === 'lesson-plan')

      console.log(`    ✍️  Generating ${plans.length} lesson(s)`)

      return plans.map((plan, i) => {
        const topic = (plan.data?.topic as string) || 'Unknown Topic'
        const moduleName = (plan.data?.moduleName as string) || 'Module'
        const objectives = (plan.data?.objectives as string[]) || []

        const content = generateLessonContent(topic, tone, examples)

        return {
          id: `lesson-${i + 1}`,
          type: 'lesson',
          version: '1.0.0',
          title: topic,
          createdBy: '@coursesmith/teacher',
          createdAt: now,
          schemaVersion: '1.0',
          data: {
            moduleName,
            topic,
            objectives,
            content,
            tone,
            examples,
          } as Record<string, unknown>,
        }
      })
    }

    default:
      throw new Error(`Unsupported capability: ${capability}`)
  }
}

function generateLessonContent(
  topic: string,
  tone: string,
  exampleCount: number
): string {
  return `# ${topic}

## Introduction

${topic} is a fundamental concept that plays a crucial role in modern software development. This lesson covers the core principles, practical applications, and best practices.

## Learning Objectives

- Understand the core concepts of ${topic}
- Learn how to apply ${topic} in real-world scenarios
- Identify common patterns and anti-patterns
- Build practical skills through hands-on examples

## Core Concepts

### What is ${topic}?

${topic} refers to a set of principles and practices that enable developers to build more robust, maintainable, and scalable systems. At its core, it provides a structured approach to solving common problems in software architecture.

### Key Principles

1. **Principle 1**: Start with understanding the fundamentals
2. **Principle 2**: Apply patterns consistently
3. **Principle 3**: Test and validate your approach
4. **Principle 4**: Iterate based on feedback

## Practical Examples

${generateExamples(topic, exampleCount)}

## Best Practices

- Always start with a clear understanding of the requirements
- Choose the right approach for your specific use case
- Document your decisions and reasoning
- Review and refactor regularly

## Common Pitfalls

- Overcomplicating the solution
- Ignoring edge cases
- Not considering scalability
- Skipping testing

## Summary

${topic} is an essential skill for modern software developers. By understanding the core concepts and applying them consistently, you can build better software more efficiently.

## Further Reading

- Official documentation
- Community best practices
- Related patterns and approaches
`
}

function generateExamples(topic: string, count: number): string {
  const examples: string[] = []
  for (let i = 1; i <= count; i++) {
    examples.push(`### Example ${i}: ${topic} in Practice

\`\`\`typescript
// Example ${i}: Practical implementation of ${topic}
function example${i}(): void {
  console.log("Implementing ${topic} - Example ${i}");
  // Add your implementation here
}
\`\`\`

This example demonstrates how to apply ${topic} in a real-world scenario. The key takeaway is to understand the pattern and adapt it to your specific needs.
`)
  }
  return examples.join('\n')
}

export const plugin: Plugin = { manifest, execute }
export default plugin
