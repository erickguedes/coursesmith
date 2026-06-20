import * as fs from 'fs'
import * as path from 'path'

export async function initCommand(directory: string): Promise<void> {
  const dir = path.resolve(process.cwd(), directory)
  console.log(`\n  🏗  Initializing CourseSmith project in ${dir}\n`)

  const dirs = [
    dir,
    path.join(dir, 'content'),
    path.join(dir, 'pipelines'),
    path.join(dir, 'agents'),
    path.join(dir, 'skills'),
    path.join(dir, 'templates'),
    path.join(dir, '.coursesmith'),
  ]

  for (const d of dirs) {
    fs.mkdirSync(d, { recursive: true })
  }

  const configYaml = `# coursesmith.yaml — CourseSmith Configuration
project:
  name: ${path.basename(dir)}
  version: 1.0.0

pipeline: standard-course

runtime:
  provider: openai
  model: gpt-4
  temperature: 0.3

input:
  sources:
    - content/syllabus.md

output:
  directory: ./output
  format: markdown

plugins:
  - "@coursesmith/web-research"
  - "@coursesmith/teacher"
  - "@coursesmith/quiz-generator"
  - "@coursesmith/flashcard-generator"
  - "@coursesmith/publisher"
`

  fs.writeFileSync(path.join(dir, 'coursesmith.yaml'), configYaml)

  const syllabusMd = `# Course Syllabus

## Course Title

Replace this with your course title.

## Topics

- Topic 1
- Topic 2
- Topic 3
`

  fs.writeFileSync(path.join(dir, 'content', 'syllabus.md'), syllabusMd)

  console.log(`  ✅ Project initialized successfully!
  
  Next steps:
    cd ${directory}
    # Edit content/syllabus.md with your course material
    coursesmith run
`)
}
