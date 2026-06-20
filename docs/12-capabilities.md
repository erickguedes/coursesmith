# docs/12-capabilities.md

# Capability Specification

Version: 1.0

Status: Draft

---

# 1. Purpose

Capabilities are the abstraction layer between Pipelines and Agents.

A Capability describes *what* an Agent can do, not *how* it does it. Pipelines request Capabilities by name; the Runtime resolves them to concrete plugin implementations.

This decoupling enables pipelines to remain independent of specific Agent implementations and Agent versions.

---

# 2. Motivation

Without Capabilities:

- Pipelines would reference specific Agent plugins, creating tight coupling
- Replacing an Agent would require updating every pipeline that uses it
- Version upgrades could break pipeline definitions
- Multiple Agents providing the same function could not be swapped

Capabilities solve these problems:

- **Decoupling** — pipelines depend on capabilities, not plugins
- **Swappability** — any plugin providing a capability can be substituted
- **Discovery** — the Runtime can list available capabilities without inspecting pipelines
- **Compatibility** — capability versioning protects pipelines from breaking changes

---

# 3. Capability Model

```text
Pipeline Step:
  capability: generate-lesson
       │
       ▼
Capability Registry:
  generate-lesson  →  @coursesmith/teacher  (v1.0.0)
                   →  @coursesmith/professor (v2.1.0)
       │
       ▼
Resolution Strategy:
  1. Explicit plugin selection (if configured)
  2. Highest compatible version
  3. Default plugin for capability

Resolved:
  @coursesmith/teacher (v1.0.0)
```

---

# 4. Capability Definition

Capabilities are declared in the plugin manifest:

```yaml
# plugin.yaml
name: @coursesmith/teacher
type: agent
capabilities:
  - id: generate-lesson
    version: 1.0
    description: Generates lesson content from lesson plans
    input:
      - type: lesson-plan
        version: "1.x"
    output:
      - type: lesson
        version: "1.0"
    configuration:
      tone:
        type: string
        enum: [beginner, intermediate, advanced]
        default: intermediate
      exampleCount:
        type: integer
        default: 3

  - id: summarize-lesson
    version: 1.0
    description: Creates a condensed summary of lesson content
    input:
      - type: lesson
        version: "1.x"
    output:
      - type: summary
        version: "1.0"
    configuration:
      maxLength:
        type: integer
        default: 500
```

---

# 5. Capability Registry

The Capability Registry is built at startup:

```text
┌────────────────────────────────┐
│     Capability Registry        │
├────────────────────────────────┤
│ generate-lesson                │
│   ├── @coursesmith/teacher     │  v1.0.0  (compatible)
│   └── @coursesmith/professor   │  v2.1.0  (compatible)
│                                │
│ generate-quiz                  │
│   ├── @coursesmith/quiz-gen    │  v1.0.0  (compatible)
│   └── @coursesmith/exam-maker  │  v0.5.0  (incompatible: version)
│                                │
│ publish-markdown               │
│   └── @coursesmith/publisher   │  v1.0.0  (compatible)
└────────────────────────────────┘
```

## Registry operations

```yaml
# List all available capabilities
capabilities:
  - id: generate-lesson
    plugins: [@coursesmith/teacher, @coursesmith/professor]
  - id: generate-quiz
    plugins: [@coursesmith/quiz-gen]

# Check if capability exists
capability: generate-lesson  # → true

# Find plugin for capability
resolve(generate-lesson)     # → @coursesmith/teacher
```

---

# 6. Capability Resolution

## Resolution order

When a pipeline step requests a capability:

```text
1. Check explicit plugin selection in the step config
   → If set, verify plugin provides the capability
   → If not found, error

2. Check pipeline-level plugin preference
   → If set, verify plugin provides the capability
   → If not found, fall through

3. Use highest compatible version
   → Sort compatible plugins by version (descending)
   → Select the first

4. Use default plugin for capability class
   → If no other criteria match
```

## Resolution configuration

```yaml
# Pipeline step: force specific plugin
steps:
  - capability: generate-lesson
    plugin: @coursesmith/professor   # Explicit plugin selection

# Pipeline config: plugin preference
plugins:
  @coursesmith/teacher:              # Preferred over others
    priority: 10
  @coursesmith/professor:
    priority: 5
```

---

# 7. Capability Versioning

## Version declaration

```yaml
capabilities:
  - id: generate-lesson
    version: 1.0
```

## Consumer version constraints

```yaml
# Pipeline step declares compatible version
steps:
  - capability: generate-lesson
    version: "1.x"         # Accepts any 1.x version

# Agent declares which capability versions it provides
capabilities:
  - id: generate-lesson
    version: 1.0
    provides: "1.x"        # Backward compatible within 1.x
```

## Version compatibility rules

| Producer | Consumer constraint | Compatible? |
|----------|-------------------|-------------|
| 1.0 | "1.x" | Yes |
| 1.1 | "1.x" | Yes |
| 2.0 | "1.x" | No |
| 2.0 | ">=1.0 <3.0" | Yes |

---

# 8. Capability Contracts

Each capability declares its contract:

```yaml
capabilities:
  - id: generate-lesson
    input:
      - type: lesson-plan        # Required input artifact type
        version: "1.x"           # Compatible versions
    output:
      - type: lesson             # Guaranteed output artifact type
        version: "1.0"           # Produced version
    configuration:               # Configuration schema
      type: object
      properties:
        tone:
          type: string
```

## Contract validation

The Runtime validates contracts at pipeline startup:

1. For each step, check that input artifact requirements can be satisfied
2. Verify that output artifact types do not conflict with subsequent steps
3. Validate that configuration parameters match the capability schema
4. Check version compatibility between producer and consumer

---

# 9. Capability Categories

## Research capabilities

| Capability | Input | Output |
|-----------|-------|--------|
| `research-topic` | Topic + scope | Research artifact |
| `enrich-syllabus` | Syllabus outline | Enriched syllabus |
| `search-web` | Search query | Search results |
| `collect-references` | Topic list | Reference list |

## Parser capabilities

| Capability | Input | Output |
|-----------|-------|--------|
| `parse-markdown` | Raw markdown | Raw course structure |
| `parse-pdf` | PDF file | Raw course structure |
| `parse-docx` | DOCX file | Raw course structure |
| `parse-syllabus` | Text syllabus | Topic list |

## Planning capabilities

| Capability | Input | Output |
|-----------|-------|--------|
| `design-curriculum` | Raw course | Course structure |
| `plan-modules` | Course structure | Module definitions |
| `plan-lessons` | Module definition | Lesson plans |
| `sequence-topics` | Topic list | Ordered lesson plans |

## Content capabilities

| Capability | Input | Output |
|-----------|-------|--------|
| `generate-lesson` | Lesson plan | Lesson content |
| `write-examples` | Lesson plan + topic | Code examples |
| `write-exercises` | Topic | Exercise set |
| `write-labs` | Lesson content | Lab instructions |
| `write-summary` | Lesson content | Condensed summary |

## Content enrichment capabilities

| Capability | Input | Output |
|-----------|-------|--------|
| `enrich-lesson` | Lesson + research | Enriched lesson |
| `add-references` | Lesson | Lesson with references |
| `add-external-examples` | Lesson + web data | Lesson with real examples |

| Capability | Input | Output |
|-----------|-------|--------|
| `generate-lesson` | Lesson plan | Lesson content |
| `write-examples` | Lesson plan + topic | Code examples |
| `write-exercises` | Topic | Exercise set |
| `write-labs` | Lesson content | Lab instructions |
| `write-summary` | Lesson content | Condensed summary |

## Assessment capabilities

| Capability | Input | Output |
|-----------|-------|--------|
| `generate-quiz` | Lesson content | Quiz |
| `generate-flashcards` | Lesson content | Flashcard set |
| `generate-exam` | Module content | Exam |
| `design-project` | Module outline | Project spec |

## Visualization capabilities

| Capability | Input | Output |
|-----------|-------|--------|
| `generate-diagram` | Concept description | Mermaid diagram |
| `generate-flowchart` | Process description | Flowchart |
| `generate-concept-map` | Concept relationship | Concept map |

## Publishing capabilities

| Capability | Input | Output |
|-----------|-------|--------|
| `publish-markdown` | All artifacts | Markdown course |
| `publish-docusaurus` | All artifacts | Docusaurus site |
| `publish-mkdocs` | All artifacts | MkDocs site |
| `publish-html` | All artifacts | Static HTML |

---

# 10. Custom Capabilities

Plugins can define custom capabilities not in the standard set:

```yaml
# plugin.yaml
capabilities:
  - id: translate-lesson
    version: 1.0
    description: Translates lesson content to another language
    input:
      - type: lesson
        version: "1.x"
    output:
      - type: lesson
        version: "1.x"
    configuration:
      targetLanguage:
        type: string
        enum: [en, pt, es, fr, de]
```

Pipelines can use any capability, standard or custom:

```yaml
steps:
  - capability: translate-lesson
    config:
      targetLanguage: pt
```

---

# 11. Capability Discovery

Users can list available capabilities:

```bash
coursesmith capabilities
```

Output:

```text
Available capabilities:
  parse-markdown        @coursesmith/markdown-parser   v1.0.0
  design-curriculum     @coursesmith/curriculum-agent  v1.0.0
  plan-lessons          @coursesmith/lesson-planner    v1.0.0
  generate-lesson       @coursesmith/teacher           v1.0.0
                        @coursesmith/professor         v2.1.0
  generate-quiz         @coursesmith/quiz-generator    v1.0.0
  publish-markdown      @coursesmith/publisher         v1.0.0
```

---

# 12. Future Extensions

- **Capability composition** — combine multiple capabilities into a composite
- **Capability chaining** — define pipelines at capability level
- **Capability negotiation** — runtime negotiates capability version with plugin at startup
- **AI capability detection** — test if installed plugins actually fulfill declared capabilities
- **Capability marketplace** — search for plugins providing specific capabilities

---

# 13. Cross References

- `docs/06-agents.md` — agents expose capabilities
- `docs/08-pipelines.md` — pipeline steps request capabilities
- `docs/10-plugin-api.md` — capabilities declared in plugin.yaml
- `docs/11-runtime.md` — Capability Resolver component
- `docs/04-architecture.md` — capability resolution in the architecture
