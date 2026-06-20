# docs/07-skills.md

# Skills Specification

Version: 1.0

Status: Draft

---

# 1. Purpose

Skills are reusable reasoning units that encapsulate prompting strategy.

They represent the atomic capabilities that Agents orchestrate to produce Artifacts.

Skills decouple prompting knowledge from Agent logic, enabling prompt reuse across different Agents and pipelines.

---

# 2. Motivation

Without Skills, prompting logic would be duplicated across Agents, making maintenance expensive and behavior inconsistent.

Skills provide:

- **Reusability** — the same skill can be used by multiple Agents
- **Testability** — skills can be validated in isolation
- **Versioning** — skill improvements apply to all consumers
- **Specialization** — domain experts can author skills without modifying Agents
- **Swapability** — replace a skill without changing the Agent that uses it

---

# 3. Skill Definition

A Skill is a self-contained module that:

1. Accepts structured input (Artifact or parameters)
2. Applies a reasoning strategy (prompt + instructions)
3. Produces structured output (Artifact fragment)

```text
Input Artifact
     │
     ▼
┌─────────────┐
│   Skill     │
│  (prompt +  │
│  rules)     │
└─────────────┘
     │
     ▼
Output Fragment
```

---

# 4. Skill Structure

```text
skills/
└── explain-concept/
    ├── skill.yaml         # Skill manifest (required)
    ├── prompt.md          # System prompt template (required)
    ├── rules.md           # Behavioral rules (optional)
    ├── examples/          # Few-shot examples (optional)
    │   ├── example-1.yaml
    │   └── example-2.yaml
    ├── schemas/           # Input/output schemas (optional)
    │   ├── input.json
    │   └── output.json
    └── tests/             # Skill tests (optional)
        └── golden-output.md
```

---

# 5. Skill Manifest

```yaml
# skill.yaml
name: explain-concept
version: 1.0.0
description: Explains a technical concept clearly with examples and analogies

input:
  type: concept-definition
  fields:
    - name           # Concept name
    - definition     # Formal definition
    - context        # Where this concept fits
    - prerequisites  # Required prior knowledge

output:
  type: explanation
  fields:
    - introduction   # High-level overview
    - explanation    # Detailed explanation
    - analogy        # Relatable comparison
    - example        # Concrete code or scenario
    - key-points     # Summary takeaways

configuration:
  tone:
    type: string
    enum: [beginner, intermediate, advanced]
    default: intermediate
  exampleCount:
    type: integer
    default: 2

tags:
  - explanation
  - concept
  - teaching

compatibility:
  runtime: ">=1.0.0"
```

---

# 6. Prompt Template

The `prompt.md` file uses variables for dynamic content:

```markdown
You are explaining a technical concept to a {{ .Config.tone }} learner.

## Concept
Name: {{ .Input.name }}
Definition: {{ .Input.definition }}
Context: {{ .Input.context }}
Prerequisites: {{ .Input.prerequisites }}

## Instructions

1. Start with a high-level introduction that connects to what the learner already knows.
2. Explain the concept in {{ .Config.tone }} terms, building from prerequisites.
3. Provide a relatable analogy that makes the concept intuitive.
4. Show {{ .Config.exampleCount }} concrete example(s) with real code or scenario.
5. End with key points that summarize what was learned.

## Quality rules

- Every explanation must include at least one analogy.
- Every example must be realistic and runnable.
- Avoid jargon unless it is explicitly defined.
- Keep each section focused and concise.
```

---

# 7. Skill Categories

## Research Skills

Search, scrape, and synthesize information from external sources.

| Skill | Input | Output |
|-------|-------|--------|
| `web-search` | Topic + query | Search results |
| `scrape-url` | URL | Page content |
| `extract-content` | Raw HTML | Structured content |
| `synthesize-research` | Multiple sources | Research summary |
| `enrich-topic` | Topic outline | Enriched topic with references |

---

## Analysis Skills

Examine and extract information from artifacts.

| Skill | Input | Output |
|-------|-------|--------|
| `extract-topics` | Syllabus | Topic list |
| `identify-prerequisites` | Course plan | Prerequisite map |
| `assess-difficulty` | Lesson content | Difficulty rating |
| `analyze-structure` | Document | Structure tree |

## Planning Skills

Design educational structure and sequence.

| Skill | Input | Output |
|-------|-------|--------|
| `design-modules` | Course outline | Module breakdown |
| `plan-lessons` | Module spec | Lesson sequence |
| `sequence-topics` | Topic list | Ordered curriculum |
| `define-objectives` | Lesson plan | Learning objectives |

## Content Skills

Generate educational material.

| Skill | Input | Output |
|-------|-------|--------|
| `explain-concept` | Concept definition | Explanation |
| `write-example` | Concept + scenario | Code example |
| `create-analogy` | Concept | Analogy |
| `write-summary` | Lesson content | Condensed summary |
| `expand-topic` | Topic outline | Full topic content |
| `write-introduction` | Lesson plan | Lesson intro |

## Assessment Skills

Create evaluation artifacts.

| Skill | Input | Output |
|-------|-------|--------|
| `generate-quiz` | Lesson content | Quiz questions |
| `generate-exercise` | Topic | Practice exercise |
| `generate-flashcard` | Concept | Front/back card |
| `design-lab` | Lesson + topic | Lab instructions |
| `design-project` | Module outline | Project spec |

## Visualization Skills

Produce diagrams and visual aids.

| Skill | Input | Output |
|-------|-------|--------|
| `generate-mermaid` | Structure | Mermaid diagram |
| `draw-flowchart` | Process | Flowchart |
| `draw-concept-map` | Concept graph | Concept map |

## Reference Skills

Curate external resources.

| Skill | Input | Output |
|-------|-------|--------|
| `find-references` | Topic | Reading list |
| `suggest-reading` | Lesson plan | References |
| `curate-resources` | Domain | Resource list |

---

# 8. Skill Execution

## Execution flow

```text
1. Receive input Artifact
2. Load skill.yaml for configuration
3. Resolve prompt.md template with input data + config
4. Load examples/ if configured
5. Execute prompt against configured LLM
6. Parse response into output structure
7. Validate output against schema
8. Return output fragment
```

## Skill composition

Skills can compose into larger capabilities:

```text
write-lesson:
  - explain-concept    # Core explanation
  - write-example      # Practical examples
  - write-summary      # End-of-lesson summary
```

Agents orchestrate Skills internally, not through the Artifact Bus.

---

# 9. Configuration

Skill configuration can be set at multiple levels, with increasing priority:

1. **Skill default** — defined in `skill.yaml`
2. **Agent override** — defined in agent configuration
3. **Pipeline override** — defined in pipeline YAML
4. **User override** — defined in `coursesmith.yaml`

```yaml
# coursesmith.yaml
skills:
  explain-concept:
    tone: beginner
    exampleCount: 3
```

---

# 10. Validation

Every Skill SHOULD declare:

- **Input schema** — expected input structure
- **Output schema** — guaranteed output structure
- **Examples** — valid input/output pairs

Validation occurs:

- **Pre-execution** — input matches declared schema
- **Post-execution** — output matches declared schema
- **Regression** — golden examples produce expected output

---

# 11. Error Handling

| Error | Cause | Behavior |
|-------|-------|----------|
| `invalid_input` | Input missing required fields | Skill returns error, Agent handles |
| `invalid_output` | LLM output failed schema validation | Skill retries with corrected prompt |
| `execution_failed` | LLM call failed | Agent retries or skips |
| `configuration_invalid` | Skill config is invalid | Agent fails fast |

---

# 12. Testing

Skills MUST include:

- **Golden output tests** — run skill with known input, compare output
- **Schema validation** — verify output conforms to schema
- **Edge case tests** — empty input, minimal input, maximum input

```yaml
# tests/test-cases.yaml
cases:
  - name: basic-concept
    input:
      name: Dependency Injection
      definition: A pattern where objects receive dependencies...
      context: Software Architecture module
      prerequisites: Basic OOP knowledge
    expected:
      hasAnalogy: true
      hasExample: true
      sections: [introduction, explanation, analogy, example, key-points]
```

---

# 13. Skill Registry

Skills are registered in the Skill Registry at startup:

```yaml
# Agent manifest
skills:
  - explain-concept    # Resolved from agent's skills/ or global skills/
  - write-example      # Resolved from agent's skills/ or global skills/
```

Resolution order:

1. Agent-local `skills/` directory
2. Global `skills/` directory
3. Plugin-provided skills (via plugin dependencies)

---

# 14. Future Extensions

- **Skill chaining** — define composite skills as a sequence of atomic skills
- **Skill version pinning** — lock specific skill versions per pipeline
- **Skill marketplace** — community-contributed skills
- **Multi-model skills** — different prompts for different LLM providers
- **A/B testing** — run two skill variants and compare outputs
- **Skill caching** — cache skill outputs for deterministic re-execution

---

# 15. Cross References

- `docs/06-agents.md` — how Agents load and execute Skills
- `docs/12-capabilities.md` — capabilities expose Skills to Pipelines
- `docs/10-plugin-api.md` — Skills follow the plugin packaging model
- `docs/04-architecture.md` — Skill Registry location in the architecture
