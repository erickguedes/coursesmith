# docs/10-plugin-api.md

# Plugin API Specification

Version: 1.0

Status: Draft

---

# 1. Purpose

This document defines how third-party developers create plugins for CourseSmith.

Every extension point in CourseSmith uses the same plugin model. Agents, Skills, Templates, Pipelines, Publishers, Validators, and Parsers are all plugins.

This document describes the plugin lifecycle, metadata format, discovery mechanism, and integration contracts.

---

# 2. Motivation

CourseSmith must remain extensible without modifying the Core.

Every educational capability should be packaged as a standalone plugin that can be installed, updated, and removed independently.

The Plugin API guarantees that:

- Plugins are discoverable without code changes
- Plugins declare their dependencies and compatibility
- The Runtime can validate and load plugins safely
- Plugins communicate exclusively through Artifacts

---

# 3. Plugin Structure

Every plugin follows the same directory structure:

```text
my-plugin/
├── plugin.yaml          # Plugin manifest (required)
├── README.md            # Human-readable documentation (recommended)
├── src/                 # Source code or prompts (optional)
├── skills/              # Skill definitions (optional)
├── templates/           # Output templates (optional)
├── schemas/             # Artifact JSON Schemas (optional)
├── tests/               # Test files (optional)
└── examples/            # Usage examples (optional)
```

---

# 4. Plugin Manifest

## plugin.yaml

Every plugin MUST include a `plugin.yaml` manifest at its root.

### Required fields

```yaml
name: my-plugin                        # Unique plugin identifier
version: 1.0.0                         # Semantic version
type: agent                            # Plugin type (see §5)
description: Generates quiz artifacts   # Human-readable description
author:                                # Author information
  name: Jane Doe
  email: jane@example.com
```

### Optional fields

```yaml
runtime:                               # Runtime compatibility constraint
  min: "1.0.0"
  max: "2.0.0"

capabilities:                          # Capabilities this plugin provides
  - generate-quiz
  - generate-flashcards

artifacts:                             # Artifact types this plugin handles
  input:
    - lesson-plan
  output:
    - quiz
    - flashcards

dependencies:                          # Other plugins this plugin depends on
  - name: @coursesmith/core
    version: ">=1.0.0"

configuration:                         # Configuration schema (JSON Schema)
  type: object
  properties:
    questionCount:
      type: integer
      default: 5

tags:                                  # Classification tags
  - assessment
  - quiz

license: MIT                           # SPDX license identifier

homepage: https://github.com/user/my-plugin

repository:
  type: git
  url: https://github.com/user/my-plugin.git
```

---

# 5. Plugin Types

## agent

Wraps an AI agent responsible for generating Artifacts.

Example: `teacher`, `curriculum-architect`, `quiz-generator`

plugin.yaml example:

```yaml
name: @coursesmith/teacher
version: 1.0.0
type: agent
description: Generates lesson content from lesson plans
capabilities:
  - generate-lesson
  - summarize-lesson
artifacts:
  input:
    - lesson-plan
  output:
    - lesson
skills:
  - expand-topic
  - explain-concept
  - write-summary
```

## skill

Provides a reusable reasoning unit (prompt template + instructions).

Skills are loaded by Agents at execution time.

```yaml
name: explain-concept
version: 1.0.0
type: skill
description: Explains a concept clearly with examples
artifacts:
  input:
    - concept-definition
  output:
    - explanation
```

## template

Provides a reusable output template.

Templates define the structure of generated artifacts.

```yaml
name: lesson-markdown
version: 1.0.0
type: template
description: Standard lesson template in Markdown
formats:
  - md
artifacts:
  output:
    - lesson
```

## pipeline

Defines an execution workflow.

Pipelines orchestrate multiple agents.

```yaml
name: standard-course
version: 1.0.0
type: pipeline
description: Full course generation pipeline
steps:
  - parser
  - curriculum-architect
  - lesson-planner
  - teacher
  - quiz-generator
  - publisher
```

## publisher

Exports generated artifacts to a specific format or platform.

```yaml
name: @coursesmith/docusaurus
version: 1.0.0
type: publisher
description: Publishes courses to Docusaurus sites
formats:
  - markdown
  - sidebars
artifacts:
  input:
    - manifest
```

## validator

Validates artifacts against schemas or business rules.

```yaml
name: lesson-validator
version: 1.0.0
type: validator
description: Validates lesson completeness and structure
artifacts:
  input:
    - lesson
rules:
  - required-fields
  - objective-count
  - example-count
```

## parser

Converts source input formats into normalized artifacts.

```yaml
name: @coursesmith/pdf-parser
version: 1.0.0
type: parser
description: Parses PDF syllabi into normalized course structure
formats:
  - pdf
artifacts:
  output:
    - raw-course
```

---

# 6. Plugin Lifecycle

```text
Discovered  →  Validated  →  Loaded  →  Initialized  →  Active
                                                              ↓
                                                         Error / Removed
```

| Phase | Description |
|-------|-------------|
| **Discovered** | Runtime finds the plugin in a registered location |
| **Validated** | Manifest is parsed and checked against schema |
| **Loaded** | Plugin metadata and resources are loaded into memory |
| **Initialized** | Plugin configuration is applied |
| **Active** | Plugin is ready to execute its capabilities |
| **Error** | Plugin encountered a fatal error and is deactivated |
| **Removed** | Plugin has been uninstalled or disabled |

---

# 7. Discovery

## Default locations

The Runtime discovers plugins in the following locations (in order):

```text
.coursesmith/plugins/
plugins/
agents/
skills/
templates/
pipelines/
```

## Remote installation

Plugins can be installed from registries:

```bash
coursesmith add @coursesmith/teacher
coursesmith add github:user/plugin-name
coursesmith add https://example.com/plugins/my-plugin.tar.gz
```

The install command:
1. Downloads the plugin package
2. Validates the manifest
3. Checks compatibility with the current runtime
4. Resolves dependencies
5. Copies the plugin to `.coursesmith/plugins/`
6. Updates `coursesmith.yaml`

---

# 8. Capability Resolution

The Runtime resolves capabilities at startup:

1. Scan all loaded plugins for declared capabilities
2. Build a capability registry mapping capability → plugin
3. When a pipeline step requests a capability, find the matching plugin
4. If multiple plugins provide the same capability, use configured priority or explicit selection

```yaml
# coursesmith.yaml
pipeline:
  steps:
    - capability: generate-lesson      # Requests any plugin providing this
      plugin: @coursesmith/teacher     # Optional: force a specific plugin
```

---

# 9. Configuration

## Default configuration

Plugins may declare default configuration in `plugin.yaml`:

```yaml
configuration:
  type: object
  properties:
    tone:
      type: string
      enum: [professional, conversational, academic]
      default: professional
    lessonLength:
      type: string
      enum: [short, medium, long]
      default: medium
```

## User overrides

Users override plugin configuration in `coursesmith.yaml`:

```yaml
plugins:
  @coursesmith/teacher:
    tone: conversational
    lessonLength: short
```

Configuration is merged at load time: user values override defaults.

## Validation

Configuration is validated against the declared JSON Schema at initialization.

Invalid configuration prevents the plugin from loading.

---

# 10. Artifact Contracts

Every plugin declares which Artifact types it consumes and produces:

```yaml
artifacts:
  input:
    - lesson-plan      # Required input type
  output:
    - lesson            # Required output type
  optional_input:
    - reference-list   # Optional input type
```

The Runtime validates that:

- Every required input artifact is available before execution
- Every produced output matches the declared type
- Artifact versions are compatible

---

# 11. Versioning and Compatibility

## Plugin versioning

Plugins MUST use Semantic Versioning (MAJOR.MINOR.PATCH).

Breaking changes to the input/output contract:

- **MAJOR** — changes to required input or output artifact types
- **MINOR** — new optional inputs or capabilities added
- **PATCH** — internal improvements, no contract changes

## Runtime compatibility

```yaml
runtime:
  min: "1.0.0"    # Minimum runtime version required
  max: "2.0.0"    # Maximum runtime version supported (optional)
```

The Runtime refuses to load a plugin whose compatibility constraints are not satisfied.

## Artifact version compatibility

```yaml
artifacts:
  input:
    lesson-plan: "1.x"    # Accepts any 1.x version of lesson-plan
  output:
    lesson: "1.0"         # Produces lesson artifact version 1.0
```

---

# 12. Error Handling

Plugins MUST classify errors into these categories:

| Category | Behavior |
|----------|----------|
| `recoverable` | Pipeline retries the step |
| `retryable` | Pipeline retries after a configurable delay |
| `fatal` | Pipeline stops immediately |
| `validation` | Artifact failed validation, logged and pipeline stops |
| `configuration` | Plugin config is invalid, plugin is disabled |
| `unsupported_input` | Input artifact type or version not supported |

Plugins communicate errors through the Artifact Bus:

```yaml
# Error artifact
type: error
severity: fatal
code: E-1001
message: Input lesson-plan version 2.0 is not supported
plugin: @coursesmith/teacher
artifact: lesson-plan-001
```

---

# 13. Logging

Plugins produce structured log entries:

```yaml
timestamp: 2026-01-15T10:30:00Z
level: info
plugin: @coursesmith/teacher
event: artifact.produced
artifact:
  id: lesson-networking-001
  type: lesson
  size: 14KB
duration: 8.2s
```

Log levels:

- `debug` — detailed diagnostic information
- `info` — normal operation events
- `warn` — unexpected but non-fatal situations
- `error` — errors that may affect output quality
- `fatal` — errors that prevent execution

---

# 14. Testing Requirements

Every plugin MUST include:

- **Unit tests** — test individual capabilities in isolation
- **Contract tests** — verify input/output artifact contracts
- **Schema validation** — ensure produced artifacts match declared schemas
- **Golden output tests** — verify outputs match expected examples

Test files live in the plugin's `tests/` directory.

---

# 15. Packaging and Distribution

## Directory structure for distribution

```text
my-plugin-1.0.0.tar.gz
├── plugin.yaml
├── README.md
├── LICENSE
├── src/
├── skills/
├── templates/
├── schemas/
└── tests/
```

## Distribution channels

- **Official registry** — `@coursesmith/*` packages
- **GitHub** — `github:user/repo` shorthand
- **npm** — `npm install @coursesmith/my-plugin`
- **Direct URL** — `https://.../plugin.tar.gz`

---

# 16. Security

- Plugins run in the same process as the Runtime (current architecture)
- Future versions may support sandboxed execution
- Plugins MUST NOT access files outside their designated directories
- Plugins MUST NOT make network calls unless explicitly declared in capabilities
- Plugin integrity can be verified via checksums in the manifest

---

# 17. Future Extensions

- **Sandboxed plugin execution** — separate process or WASM runtime
- **Plugin hot-reload** — install and update plugins without restarting
- **Plugin dependencies** — automatic dependency resolution and version locking
- **Plugin signing** — cryptographic signatures to verify plugin authenticity
- **Plugin marketplace** — web UI for browsing and installing plugins
- **Cross-runtime plugins** — plugins that work with any AI runtime adapter

---

# 18. Cross References

- `docs/04-architecture.md` — high-level architecture and plugin model
- `docs/06-agents.md` — agent lifecycle and capability system
- `docs/07-skills.md` — skill plugin specification
- `docs/12-capabilities.md` — capability resolution detail
- `docs/13-configuration.md` — global and per-plugin configuration
