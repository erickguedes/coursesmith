import { Artifact, Plugin } from 'coursesmith-core'

const manifest = {
  name: 'coursesmith-web-research',
  version: '1.0.0',
  type: 'agent',
  description: 'Web research agent that searches, scrapes, and enriches course content',
  capabilities: [
    {
      id: 'research-topic',
      version: '1.0',
      description: 'Researches a topic by searching the web and scraping relevant content',
      input: [{ type: 'raw-source', version: '1.x' }],
      output: [{ type: 'research-material', version: '1.0' }],
    },
    {
      id: 'enrich-lesson',
      version: '1.0',
      description: 'Enriches lesson content with external references and examples',
      input: [
        { type: 'lesson', version: '1.x' },
        { type: 'research-material', version: '1.x' },
      ],
      output: [{ type: 'enriched-lesson', version: '1.0' }],
    },
    {
      id: 'enrich-syllabus',
      version: '1.0',
      description: 'Enriches a raw syllabus with web research data',
      input: [{ type: 'raw-source', version: '1.x' }],
      output: [{ type: 'enriched-syllabus', version: '1.0' }],
    },
  ],
}

async function searchWeb(query: string): Promise<string[]> {
  const results: string[] = []
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`

  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CourseSmith/1.0; research)',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) return results

    const html = await response.text()

    const snippetRegex = /class="result__snippet">(.*?)<\/a>/gs
    let match
    while ((match = snippetRegex.exec(html)) !== null && results.length < 5) {
      const snippet = match[1].replace(/<[^>]*>/g, '').trim()
      if (snippet) results.push(snippet)
    }

    if (results.length === 0) {
      const altRegex = /<a[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>/gs
      while ((match = altRegex.exec(html)) !== null && results.length < 5) {
        const text = match[1].replace(/<[^>]*>/g, '').trim()
        if (text) results.push(text)
      }
    }
  } catch {
    // Search failed, return empty results
  }

  return results
}

async function scrapeUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CourseSmith/1.0; research)',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) return ''

    const html = await response.text()
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return text.substring(0, 5000)
  } catch {
    return ''
  }
}

async function researchTopic(
  topicName: string,
  depth: string = 'thorough'
): Promise<{ summary: string; references: string[]; keyConcepts: string[] }> {
  const searchQueries = [
    `${topicName} tutorial`,
    `${topicName} documentation`,
    `${topicName} concepts explained`,
    `learn ${topicName} guide`,
  ]

  const allSnippets: string[] = []
  for (const query of searchQueries) {
    const snippets = await searchWeb(query)
    allSnippets.push(...snippets)
  }

  const summary = allSnippets.length > 0
    ? allSnippets.join('\n').substring(0, 3000)
    : `Topic: ${topicName}. No web research results were retrieved.`

  const keyConcepts = extractKeyConcepts(summary, topicName)

  return {
    summary,
    references: [],
    keyConcepts,
  }
}

function extractKeyConcepts(text: string, topic: string): string[] {
  const words = text.toLowerCase().split(/\W+/)
  const freq = new Map<string, number>()
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
    'to', 'of', 'in', 'for', 'on', 'with', 'as', 'at', 'by',
    'this', 'that', 'it', 'its', 'from', 'or', 'and', 'but',
    'not', 'you', 'we', 'they', 'he', 'she', 'will', 'can',
    'has', 'have', 'had', 'do', 'does', 'did', 'would', 'could',
  ])

  for (const word of words) {
    if (word.length > 3 && !stopWords.has(word)) {
      freq.set(word, (freq.get(word) || 0) + 1)
    }
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word)
    .filter(w => w !== topic.toLowerCase())
}

async function execute(
  capability: string,
  input: Artifact[],
  config: Record<string, unknown>
): Promise<Artifact[]> {
  const now = new Date().toISOString()

  switch (capability) {
    case 'research-topic': {
      const source = input.find(a => a.type === 'raw-source')
      const topicName = source?.title || config.topic as string || 'Unknown Topic'
      const depth = (config.depth as string) || 'thorough'

      console.log(`    🔍 Researching: ${topicName}`)

      const research = await researchTopic(topicName, depth)

      return [
        {
          id: `research-${topicName.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'research-material',
          version: '1.0.0',
          title: `Research: ${topicName}`,
          createdBy: 'coursesmith-web-research',
          createdAt: now,
          schemaVersion: '1.0',
          data: {
            topic: topicName,
            summary: research.summary,
            keyConcepts: research.keyConcepts,
            references: research.references,
          } as Record<string, unknown>,
        },
      ]
    }

    case 'enrich-syllabus': {
      const source = input.find(a => a.type === 'raw-source')
      const content = (source?.data?.content as string) || ''
      const lines = content.split('\n').filter(l => l.trim())
      const topicName = source?.title || 'Unknown'

      const enrichedTopics: string[] = []
      for (const line of lines.slice(0, 10)) {
        const trimmed = line.replace(/^[#*\-\s]*/, '').trim()
        if (trimmed && trimmed.length > 3 && !trimmed.startsWith('http')) {
          enrichedTopics.push(trimmed)
          const snippets = await searchWeb(`${trimmed} ${topicName}`)
          enrichedTopics.push(...snippets.slice(0, 2))
        }
      }

      return [
        {
          id: `enriched-syllabus-${Date.now()}`,
          type: 'enriched-syllabus',
          version: '1.0.0',
          title: `Enriched: ${topicName}`,
          createdBy: 'coursesmith-web-research',
          createdAt: now,
          schemaVersion: '1.0',
          data: {
            originalContent: content,
            enrichedTopics,
          } as Record<string, unknown>,
        },
      ]
    }

    case 'enrich-lesson': {
      const lesson = input.find(a => a.type === 'lesson')
      const research = input.find(a => a.type === 'research-material')
      const lessonData = lesson?.data || {}
      const researchData = research?.data || {}

      const lessonContent = (lessonData.content as string) || ''
      const topicName = lesson?.title || 'Lesson'
      const researchSummary = (researchData.summary as string) || ''

      const enrichedContent = researchSummary
        ? `${lessonContent}\n\n## External References\n\n${researchSummary.substring(0, 1000)}`
        : lessonContent

      return [
        {
          id: `enriched-${lesson?.id || Date.now()}`,
          type: 'enriched-lesson',
          version: '1.0.0',
          title: `Enriched: ${topicName}`,
          createdBy: 'coursesmith-web-research',
          createdAt: now,
          schemaVersion: '1.0',
          data: {
            ...lessonData,
            content: enrichedContent,
            researchSummary,
            keyConcepts: researchData.keyConcepts || [],
          } as Record<string, unknown>,
        },
      ]
    }

    default:
      throw new Error(`Unsupported capability: ${capability}`)
  }
}

export const plugin: Plugin = { manifest, execute }
export default plugin
