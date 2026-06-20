import * as fs from 'fs'
import * as path from 'path'
import { Artifact, Plugin } from 'coursesmith-core'

const manifest = {
  name: 'coursesmith-publisher',
  version: '1.0.0',
  type: 'publisher',
  description: 'Publishes generated course artifacts to the filesystem',
  capabilities: [
    {
      id: 'publish-markdown',
      version: '1.0',
      description: 'Writes artifacts as Markdown files to the output directory',
      input: [
        { type: 'course-structure', version: '1.x' },
        { type: 'lesson', version: '1.x' },
        { type: 'enriched-lesson', version: '1.x' },
        { type: 'quiz', version: '1.x' },
        { type: 'flashcards', version: '1.x' },
      ],
      output: [{ type: 'generated-course', version: '1.0' }],
    },
  ],
}

async function execute(
  capability: string,
  input: Artifact[],
  config: Record<string, unknown>
): Promise<Artifact[]> {
  const now = new Date().toISOString()
  const outputDir = (config.directory as string) || './output'
  const format = (config.format as string) || 'markdown'

  switch (capability) {
    case 'publish-markdown': {
      const absOutputDir = path.resolve(outputDir)
      fs.mkdirSync(absOutputDir, { recursive: true })

      console.log(`    📁 Publishing to ${absOutputDir}`)

      const lessons = input.filter(a => a.type === 'lesson' || a.type === 'enriched-lesson')
      const quizzes = input.filter(a => a.type === 'quiz')
      const flashcards = input.filter(a => a.type === 'flashcards')
      const structure = input.find(a => a.type === 'course-structure')
      const modules = (structure?.data?.modules as any[]) || []

      const courseManifest: Record<string, unknown> = {
        title: structure?.title || 'Course',
        generatedAt: now,
        modules: [],
        lessonCount: lessons.length,
        quizCount: quizzes.length,
        flashcardCount: flashcards.reduce((sum, f) => {
          const cards = (f.data?.cards as any[]) || []
          return sum + cards.length
        }, 0),
      }

      for (const mod of modules) {
        const moduleName = (mod.name as string) || 'Module'
        const safeName = moduleName.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()
        const moduleDir = path.join(absOutputDir, safeName)
        fs.mkdirSync(moduleDir, { recursive: true })

        const lessonDir = path.join(moduleDir, 'lessons')
        fs.mkdirSync(lessonDir, { recursive: true })

        const moduleLessons = lessons.filter(l => {
          const data = l.data || {}
          return (data.moduleName as string) === moduleName
        })

        for (const lesson of moduleLessons) {
          const data = lesson.data || {}
          const content = (data.content as string) || `# ${lesson.title}\n\nContent pending.`
          const safeLessonName = lesson.title.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()
          const filePath = path.join(lessonDir, `${safeLessonName}.md`)
          fs.writeFileSync(filePath, content, 'utf-8')
        }

        fs.writeFileSync(
          path.join(moduleDir, 'module.yaml'),
          `name: ${moduleName}\nlessons:\n${moduleLessons.map(l => `  - ${l.title}`).join('\n')}\n`,
          'utf-8'
        )

        courseManifest.modules = [
          ...(courseManifest.modules as any[]),
          { name: moduleName, lessonCount: moduleLessons.length },
        ]
      }

      const quizzesDir = path.join(absOutputDir, 'quizzes')
      fs.mkdirSync(quizzesDir, { recursive: true })
      for (const quiz of quizzes) {
        const safeName = quiz.title.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()
        fs.writeFileSync(
          path.join(quizzesDir, `${safeName}.json`),
          JSON.stringify(quiz.data, null, 2),
          'utf-8'
        )
      }

      const flashcardsDir = path.join(absOutputDir, 'flashcards')
      fs.mkdirSync(flashcardsDir, { recursive: true })
      for (const fc of flashcards) {
        const safeName = fc.title.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()
        fs.writeFileSync(
          path.join(flashcardsDir, `${safeName}.json`),
          JSON.stringify(fc.data, null, 2),
          'utf-8'
        )
      }

      fs.writeFileSync(
        path.join(absOutputDir, 'manifest.json'),
        JSON.stringify(courseManifest, null, 2),
        'utf-8'
      )

      fs.writeFileSync(
        path.join(absOutputDir, 'course.yaml'),
        `title: ${structure?.title || 'Course'}\ngeneratedAt: ${now}\nformat: ${format}\n`,
        'utf-8'
      )

      return [
        {
          id: 'generated-course',
          type: 'generated-course',
          version: '1.0.0',
          title: 'Generated Course',
          createdBy: 'coursesmith-publisher',
          createdAt: now,
          schemaVersion: '1.0',
          data: courseManifest,
        },
      ]
    }

    default:
      throw new Error(`Unsupported capability: ${capability}`)
  }
}

export const plugin: Plugin = { manifest, execute }
export default plugin
