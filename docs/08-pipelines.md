# docs/08-pipelines.md

# Pipeline Specification

Version: 1.0

Status: Draft

---

# 1. Purpose

Pipelines are the execution backbone of CourseSmith.

A Pipeline is a declarative YAML definition that describes the sequence of steps required to transform educational inputs into a complete, published course.

The Pipeline Engine executes these steps deterministically, routing Artifacts between Agents through the Artifact Bus.

---

# 2. Motivation

Hardcoded educational workflows create coupling between the Runtime and domain logic.

Declarative Pipelines provide:

- **Separation of concerns** — Pipeline definitions are configuration, not code
- **Reusability** — the same pipeline can run different courses with different inputs
- **Composability** — pipelines can be nested, branched, and combined
- **Versionability** — pipelines are Git-native YAML files
- **Auditability** — every execution maps to a specific pipeline version
- **Discoverability** — available pipelines are listed and documented

---

# 3. Pipeline Model

```text
Input Sources
     │
     ▼
┌──────────────┐
│   Pipeline   │  (declarative YAML)
└──────┬───────┘
       │
       ▼
┌────────────────────────────────────────────┐
│              Pipeline Engine                │
│                                            │
│  Step 1: Parser        → RawCourse         │
│  Step 2: Curriculum    → CourseStructure   │
│  Step 3: Planner       → LessonPlans       │
│  Step 4: Teacher       → Lessons           │
│  Step 5: QuizGen       → Quizzes           │
│  Step 6: Publisher     → Output Course     │
└────────────────────────────────────────────┘
       │
       ▼
  Generated Course
```

---

# 4. Pipeline Definition

## Basic structure

```yaml
# pipelines/standard-course.yaml
pipeline:
  name: standard-course
  version: 1.0.0
  description: Complete course generation from syllabus with web enrichment

  input:
    sources:
      - syllabus.md
    parser: @coursesmith/markdown-parser

  steps:
    - id: web-researcher
      capability: research-topic
      input: raw-course
      output: research-material
      config:
        depth: thorough
        sources: [web, docs, tutorials]
      parallel: false

    - id: curriculum-architect
      capability: design-curriculum
      input:
        - raw-course
        - research-material
      output: course-structure
      config:
        modules: auto

    - id: lesson-planner
      capability: plan-lessons
      input: course-structure
      output: lesson-plans
      config:
        lessonCount: auto

    - id: teacher
      capability: generate-lesson
      input: lesson-plans
      output: lessons
      config:
        tone: professional
        examples: 3

    - id: content-enricher
      capability: enrich-lesson
      input:
        - lessons
        - research-material
      output: enriched-lessons
      config:
        addReferences: true
        addExternalExamples: true

    - id: quiz-generator
      capability: generate-quiz
      input: enriched-lessons
      output: quizzes
      config:
        questionsPerLesson: 5

    - id: flashcard-generator
      capability: generate-flashcards
      input: enriched-lessons
      output: flashcards
      config:
        cardsPerLesson: 10

    - id: publisher
      capability: publish-markdown
      input:
        - course-structure
        - enriched-lessons
        - quizzes
        - flashcards
      output: generated-course
      config:
        format: docusaurus

  output:
    directory: ./output
    format: markdown
    manifest: true
```

---

# 5. Pipeline Components

## Steps

Each step in a Pipeline maps to a Capability provided by an Agent.

```yaml
steps:
  - id: teacher                         # Unique step identifier
    capability: generate-lesson         # Capability to resolve
    input: lesson-plans                 # Input Artifact type(s)
    output: lessons                     # Output Artifact type(s)
    config:                             # Step-level configuration
      tone: professional
    retry:                              # Retry policy (optional)
      maxAttempts: 3
      delay: 5s
    timeout: 120s                       # Step timeout (optional)
    dependsOn:                          # Explicit dependencies (optional)
      - lesson-planner
    condition:                          # Conditional execution (optional)
      if: "hasLessons(input) > 0"
```

## Input sources

```yaml
input:
  sources:
    - syllabus.md                       # Local file
    - src/**/*.md                       # Glob pattern
    - https://example.com/syllabus.pdf  # Remote URL
  parser: @coursesmith/pdf-parser       # Parser plugin
```

## Output targets

```yaml
output:
  directory: ./output
  format: docusaurus                    # Publisher format
  manifest: true                        # Generate course manifest
  overwrite: false                      # Preserve existing files
  cleanup: false                        # Clean output dir before publishing
```

---

# 6. Pipeline Execution

## Execution phases

```text
┌────────────────────────────────────────────┐
│              Phase 1: Validate              │
│  - Validate pipeline YAML                  │
│  - Validate input sources                  │
│  - Resolve all capabilities                │
│  - Check plugin compatibility              │
└────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────┐
│            Phase 2: Initialize              │
│  - Load and configure plugins              │
│  - Initialize Artifact Bus                 │
│  - Create working directory                │
└────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────┐
│          Phase 3: Execute Steps             │
│  - For each step in order:                 │
│    1. Load input Artifacts                 │
│    2. Resolve Agent                        │
│    3. Execute Agent                        │
│    4. Validate output Artifacts            │
│    5. Publish to Artifact Bus              │
└────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────┐
│           Phase 4: Publish                  │
│  - Generate manifest                       │
│  - Run publisher plugins                   │
│  - Write output files                      │
│  - Generate summary                        │
└────────────────────────────────────────────┘
```

## Step execution

Each step follows this lifecycle:

```text
1. Receive input Artifact(s) from Artifact Bus
2. Validate input against Agent contract
3. Resolve Agent providing the required Capability
4. Load Agent configuration (pipeline → plugin → default)
5. Agent executes (loads Skills, calls LLM, produces Artifact)
6. Validate output Artifact against Agent contract
7. Publish output Artifact to Artifact Bus
8. Log completion metrics
```

---

# 7. Pipeline Types

## Standard pipelines

Full course generation pipelines:

- `standard-course` — syllabus → complete course
- `quick-course` — syllabus → minimal course (no quizzes/labs)
- `module-only` — syllabus → module structure only

## Specialized pipelines

Targeted generation pipelines:

- `regenerate-lesson` — regenerate a single lesson
- `add-quizzes` — add quizzes to existing course
- `translate-course` — translate course to another language
- `add-diagrams` — add Mermaid diagrams to existing lessons
- `validate-course` — validate course completeness without generating
- `research-enrich` — research and enrich existing course content
- `topic-research` — research a topic from scratch and build material

## Custom pipelines

User-defined pipelines composed from available capabilities:

```yaml
pipeline:
  name: my-custom-pipeline
  steps:
    - capability: parse-syllabus
    - capability: generate-lesson
    - capability: generate-quiz
    - capability: publish-markdown
```

---

# 8. Pipeline Configuration

## Global pipeline config

```yaml
# coursesmith.yaml
pipeline: standard-course

runtime:
  provider: opencode
  model: gpt-5
  temperature: 0.3
  maxConcurrency: 2
```

## Per-step configuration

```yaml
steps:
  - id: teacher
    capability: generate-lesson
    config:
      tone: conversational
      lessonLength: long
    runtime:
      model: gpt-5          # Override model for this step
      temperature: 0.5       # Override temperature for this step
```

---

# 9. Conditional Execution

Steps can be skipped based on conditions:

```yaml
steps:
  - id: diagram-generator
    capability: generate-diagrams
    condition:
      if: ".Config.generateDiagrams == true"
```

---

# 10. Parallel Execution

Steps can run in parallel:

```yaml
steps:
  - id: quiz-generator
    capability: generate-quiz
    parallel: true           # Run concurrently with other parallel steps
    input: lessons

  - id: flashcard-generator
    capability: generate-flashcards
    parallel: true
    input: lessons

  - id: publisher            # Waits for all parallel steps to complete
    capability: publish-markdown
    input:
      - lessons
      - quizzes
      - flashcards
```

---

# 11. Error Handling

## Retry policy

```yaml
steps:
  - id: teacher
    capability: generate-lesson
    retry:
      maxAttempts: 3
      delay: 5s
      backoff: exponential
      maxDelay: 60s
      retryableErrors:
        - timeout
        - rate_limit
        - model_error
```

## Failure strategies

```yaml
pipeline:
  errorStrategy: stop          # stop | skip | continue
  onFailure:
    - action: log              # log, notify, fallback
    - action: notify
      channel: slack
```

## Error classification

| Error type | Default strategy | Description |
|-----------|------------------|-------------|
| `validation` | stop | Artifact or config validation failed |
| `capability_not_found` | stop | No plugin provides required capability |
| `agent_failure` | retry (3x) | Agent execution failed |
| `timeout` | retry (3x) | Step exceeded timeout |
| `rate_limit` | retry (5x, backoff) | LLM rate limit exceeded |
| `fatal` | stop | Non-recoverable error |
| `missing_input` | skip | Input artifact not available |

---

# 12. Logging and Observability

```yaml
pipeline:
  logging:
    level: info
    format: json
    output: file              # file | stdout | both
    file: .coursesmith/logs/pipeline-{run-id}.jsonl
```

Execution produces:

```yaml
runId: cs-run-2026-01-15-a1b2c3
pipeline: standard-course
version: 1.0.0
status: completed
steps:
  - id: teacher
    status: success
    duration: 12.4s
    attempts: 1
    input: lesson-plans-001
    output: lesson-networking-001
    errors: []
startedAt: 2026-01-15T10:30:00Z
completedAt: 2026-01-15T10:32:15Z
totalDuration: 135s
artifactsProduced: 47
```

---

# 13. Testing Pipelines

## Pipeline test definition

```yaml
# tests/pipelines/standard-course-test.yaml
test:
  pipeline: standard-course
  input: tests/fixtures/sample-syllabus.md
  expected:
    status: completed
    artifactCount: 10
    artifacts:
      - type: course-structure
      - type: lesson
        count: 5
      - type: quiz
        count: 5
```

## Test types

- **Dry-run tests** — validate pipeline configuration without executing LLM steps
- **Fixture tests** — run pipeline against known inputs and compare outputs
- **Regression tests** — re-run and verify determinism
- **Performance tests** — measure execution time and resource usage

---

# 14. Pipeline Registry

Pipelines are discovered automatically:

```text
pipelines/
├── standard-course.yaml
├── quick-course.yaml
└── validate-course.yaml
```

Users select a pipeline in `coursesmith.yaml`:

```yaml
pipeline: standard-course
```

---

# 15. Future Extensions

- **Pipeline branching** — conditional paths based on intermediate results
- **Pipeline loops** — iterate over modules or lessons
- **Pipeline composition** — include one pipeline inside another
- **Distributed execution** — run steps across multiple machines
- **Pipeline visualization** — generate Mermaid diagrams from pipeline YAML
- **GUI pipeline builder** — visual pipeline editor
- **Scheduled pipelines** — cron-based course regeneration
- **Event-driven pipelines** — trigger on source changes

---

# 16. Cross References

- `docs/04-architecture.md` — Pipeline Engine and Artifact Bus architecture
- `docs/06-agents.md` — Agent execution model within pipeline steps
- `docs/12-capabilities.md` — Capability resolution used by pipeline steps
- `docs/10-plugin-api.md` — Pipeline as a plugin type
- `docs/13-configuration.md` — Pipeline configuration in coursesmith.yaml
- `docs/05-domain-model.md` — Artifact types flowing through pipelines
