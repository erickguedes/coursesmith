# docs/13-configuration.md

# Configuration Specification

Version: 1.0

Status: Draft

---

# 1. Purpose

This document defines the configuration model for CourseSmith projects, plugins, pipelines, and runtime behavior.

Configuration is the primary mechanism for customizing CourseSmith behavior without modifying code. Every aspect of the framework — from project metadata to pipeline execution — is controlled through declarative configuration files.

---

# 2. Motivation

Hardcoded configuration creates fragile systems that require source-code changes for every behavioral tweak.

Declarative configuration provides:

- **Separation** — behavior is defined in YAML, not code
- **Versionability** — configuration is Git-native
- **Discoverability** — all options are documented
- **Validation** — configuration is validated at startup
- **Override hierarchy** — sensible defaults with layered overrides

---

# 3. Configuration Files

## Primary: coursesmith.yaml

The main project configuration file.

```yaml
# coursesmith.yaml
project:
  name: Cloud Architecture
  version: 1.0.0
  description: A comprehensive course on cloud architecture

pipeline: standard-course

runtime:
  provider: opencode
  model: gpt-5
  temperature: 0.3
  maxConcurrency: 3
  timeout: 300

plugins:
  - @coursesmith/markdown-parser
  - @coursesmith/curriculum-agent
  - @coursesmith/lesson-planner
  - @coursesmith/teacher
  - @coursesmith/quiz-generator
  - @coursesmith/flashcard-generator
  - @coursesmith/publisher

plugins_config:
  @coursesmith/teacher:
    tone: professional
    lessonLength: long
    examples: 3

  @coursesmith/quiz-generator:
    questionsPerLesson: 5
    types:
      - multiple-choice
      - true-false

output:
  directory: ./output
  format: markdown
  overwrite: false
  manifest: true

cache:
  enabled: false
  directory: .coursesmith/cache
  ttl: 3600

logging:
  level: info
  format: json
  output: stdout
```

---

# 4. Configuration Schema

## Project section

```yaml
project:
  name: string                    # Required: unique project name
  version: string                 # Required: semantic version
  description: string             # Optional: project description
  author:                         # Optional: author information
    name: string
    email: string
  license: string                 # Optional: SPDX license identifier
  repository: string              # Optional: source repository URL
```

## Pipeline section

```yaml
pipeline: string                  # Required: pipeline identifier
```

Or inline:

```yaml
pipeline:
  name: string                    # Pipeline identifier
  steps:                          # Inline step definitions
    - capability: string
      config: {}
```

## Runtime section

```yaml
runtime:
  provider: string                # Runtime adapter (default: cli)
  model: string                   # LLM model identifier
  endpoint: string                # Custom LLM endpoint URL
  apiKey: string                  # API key (env var recommended)
  temperature: number             # 0.0 - 1.0 (default: 0.3)
  maxTokens: integer              # Max tokens per response
  maxConcurrency: integer         # Parallel steps (default: 1)
  timeout: integer                # Step timeout in seconds (default: 300)
  retry:
    maxAttempts: integer          # Default: 3
    delay: integer                # Seconds between retries (default: 5)
    backoff: string               # fixed | exponential (default: exponential)
```

## Plugins section

```yaml
plugins:
  - string                        # Plugin reference (name, github:user/repo, URL)

plugins_config:
  plugin-name:                    # Plugin identifier
    key: value                    # Plugin-specific configuration
    nested:
      key: value
```

## Output section

```yaml
output:
  directory: string               # Output path (default: ./output)
  format: string                  # Publisher format (default: markdown)
  overwrite: boolean              # Overwrite existing files (default: false)
  cleanup: boolean                # Clean directory before write (default: false)
  manifest: boolean               # Generate manifest (default: true)
```

## Cache section

```yaml
cache:
  enabled: boolean                # Enable caching (default: false)
  directory: string               # Cache path (default: .coursesmith/cache)
  ttl: integer                    # Cache TTL in seconds (default: 3600)
```

## Logging section

```yaml
logging:
  level: string                   # debug | info | warn | error (default: info)
  format: string                  # text | json (default: text)
  output: string                  # stdout | file | both (default: stdout)
  file: string                    # Log file path (default: .coursesmith/logs/runtime.log)
```

---

# 5. Configuration Hierarchy

Configuration is resolved with this priority (highest wins):

```text
1. CLI flags                          (--model gpt-5)
2. Environment variables              (COURSESMITH_MODEL=gpt-5)
3. Pipeline-level configuration       (pipeline.steps[].config)
4. Plugin-level configuration         (plugins_config.teacher)
5. Project-level configuration        (coursesmith.yaml)
6. Plugin defaults                    (plugin.yaml)
7. Runtime defaults                   (hardcoded defaults)
```

## CLI flags

```bash
coursesmith run --model gpt-5 --temperature 0.5
coursesmith run --pipeline quick-course
coursesmith run --output ./dist
```

## Environment variables

```bash
COURSESMITH_MODEL=gpt-5
COURSESMITH_TEMPERATURE=0.5
COURSESMITH_OUTPUT_DIR=./dist
COURSESMITH_CACHE_ENABLED=true
COURSESMITH_LOG_LEVEL=debug
```

---

# 6. Environment Variable Reference

| Variable | Maps to | Default |
|----------|---------|---------|
| `COURSESMITH_MODEL` | `runtime.model` | — |
| `COURSESMITH_TEMPERATURE` | `runtime.temperature` | 0.3 |
| `COURSESMITH_MAX_TOKENS` | `runtime.maxTokens` | 4096 |
| `COURSESMITH_API_KEY` | `runtime.apiKey` | — |
| `COURSESMITH_ENDPOINT` | `runtime.endpoint` | — |
| `COURSESMITH_PROVIDER` | `runtime.provider` | cli |
| `COURSESMITH_OUTPUT_DIR` | `output.directory` | ./output |
| `COURSESMITH_CACHE_ENABLED` | `cache.enabled` | false |
| `COURSESMITH_LOG_LEVEL` | `logging.level` | info |
| `COURSESMITH_PIPELINE` | `pipeline` | — |

---

# 7. Per-Step Configuration

Each pipeline step can override global configuration:

```yaml
pipeline:
  steps:
    - id: teacher
      capability: generate-lesson
      config:
        tone: conversational
        lessonLength: short
      runtime:
        model: gpt-5                # Override model for this step
        temperature: 0.5             # Override temperature for this step
        timeout: 600                 # Longer timeout for content generation
```

---

# 8. Validation

Configuration is validated at startup against a JSON Schema:

```yaml
Validation checks:
  ✓ Required fields are present
  ✓ Field types match schema
  ✓ Plugin references are resolvable
  ✓ Pipeline identifier exists
  ✓ Capability references are resolvable
  ✓ Output directory is writable
  ✓ Cache directory is writable (if enabled)
```

Validation errors produce actionable messages:

```text
Error: coursesmith.yaml validation failed
  - plugins[2]: "@coursesmith/unknown" — plugin not found
  - pipeline: "custom-pipeline" — no pipeline definition found
  - output.directory: "./output" — path is not writable
```

---

# 9. Multiple Configuration Files

Projects may split configuration across files:

```yaml
# coursesmith.yaml
$include:
  - plugins.yaml
  - runtime.yaml

project:
  name: Cloud Architecture
  pipeline: standard-course
```

The `$include` directive merges referenced files into the main configuration.

---

# 10. Configuration Templates

CourseSmith ships with configuration templates:

```bash
coursesmith init
```

Generates a default `coursesmith.yaml` with commented options:

```yaml
# coursesmith.yaml — CourseSmith Configuration
# Generated by coursesmith init v1.0.0

project:
  name: my-course
  version: 1.0.0

pipeline: standard-course

# runtime:
#   provider: cli
#   model: gpt-5

plugins:
  - @coursesmith/markdown-parser
  - @coursesmith/curriculum-agent
  - @coursesmith/lesson-planner
  - @coursesmith/teacher
  - @coursesmith/quiz-generator
  - @coursesmith/publisher

output:
  directory: ./output
```

---

# 11. Configuration Migration

As CourseSmith evolves, configuration schemas may change:

```yaml
# Schema version tracking
coursesmith:
  config-version: "1.0"           # Configuration schema version
```

The Runtime can auto-migrate configurations:

```bash
coursesmith migrate               # Migrate coursesmith.yaml to latest schema
coursesmith migrate --check       # Check if migration is needed
```

---

# 12. Future Extensions

- **Remote configuration** — fetch configuration from URL
- **Dynamic configuration** — configuration values computed at runtime
- **Configuration profiles** — switch between config profiles (dev, prod, test)
- **UI configuration editor** — graphical configuration builder
- **Configuration validation API** — validate CI without running pipeline
- **Encrypted secrets** — encrypted fields in configuration for API keys

---

# 13. Cross References

- `docs/11-runtime.md` — Runtime configuration loading
- `docs/08-pipelines.md` — Pipeline-specific configuration
- `docs/10-plugin-api.md` — Plugin manifest and default configuration
- `docs/12-capabilities.md` — Capability-level configuration
- `docs/04-architecture.md` — Configuration Loader component
