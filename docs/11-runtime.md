# docs/11-runtime.md

# Runtime Specification

Version: 1.0

Status: Draft

---

# 1. Purpose

The Runtime is the minimal execution core of CourseSmith.

It contains zero educational logic. Its sole responsibility is to load configuration, discover plugins, resolve capabilities, execute pipelines, validate artifacts, and publish outputs.

The Runtime must be runtime-agnostic: it must not depend on OpenCode, Claude Code, or any specific AI platform.

---

# 2. Responsibilities

The Runtime is responsible for:

- Loading `coursesmith.yaml` project configuration
- Discovering plugins from configured locations
- Validating plugin compatibility and resolving dependencies
- Resolving capabilities to concrete plugin implementations
- Executing pipeline steps in declared order
- Routing artifacts through the Artifact Bus
- Validating artifacts against schemas
- Applying retry and error-handling policies
- Publishing final artifacts to the output directory
- Generating execution manifests and logs

The Runtime is NOT responsible for:

- Understanding educational concepts
- Generating course content
- Evaluating output quality
- Optimizing prompts
- Selecting LLM models
- Any domain-specific behavior

---

# 3. Runtime Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                     CourseSmith Runtime                  │
│                                                          │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────┐ │
│  │ Configuration │  │  Plugin        │  │  Capability │ │
│  │  Loader       │  │  Registry      │  │  Resolver   │ │
│  └──────┬───────┘  └───────┬────────┘  └──────┬──────┘ │
│         │                  │                   │        │
│         ▼                  ▼                   ▼        │
│  ┌──────────────────────────────────────────────────┐  │
│  │                Pipeline Engine                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │  │
│  │  │  Step 1  │  │  Step 2  │  │  Step 3  │  ...  │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘       │  │
│  │       │              │              │             │  │
│  │       ▼              ▼              ▼             │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │              Artifact Bus                 │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────┐ │
│  │  Artifact    │  │  Publisher     │  │  Logger     │ │
│  │  Validator   │  │  Engine        │  │             │ │
│  └──────────────┘  └────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

# 4. Core Components

## Configuration Loader

Reads and validates `coursesmith.yaml`.

```yaml
project:
  name: Cloud Architecture
  version: 1.0.0

pipeline: standard-course

runtime:
  provider: opencode          # Runtime adapter
  model: gpt-5
  temperature: 0.3
  maxConcurrency: 3
  timeout: 300s

plugins:
  - @coursesmith/markdown-parser
  - @coursesmith/teacher
  - @coursesmith/quiz-generator
  - @coursesmith/publisher

output:
  directory: ./output
  format: markdown

cache:
  enabled: true
  directory: .coursesmith/cache
```

## Plugin Registry

Scans configured directories for plugin manifests.

```yaml
# Discovery paths (in order)
discovery:
  - .coursesmith/plugins/
  - plugins/
  - agents/
  - skills/
  - templates/
  - pipelines/
```

Responsibilities:

1. Scan discovery paths for `plugin.yaml` files
2. Parse and validate each manifest
3. Check runtime version compatibility
4. Resolve inter-plugin dependencies
5. Index capabilities
6. Register plugins in the capability registry

## Capability Resolver

Maps pipeline step capability requests to concrete plugin implementations.

```text
Pipeline step: { capability: "generate-lesson" }
                      │
                      ▼
Capability Registry:
  generate-lesson  →  @coursesmith/teacher (v1.0.0)
  generate-quiz    →  @coursesmith/quiz-generator (v1.0.0)
                      │
                      ▼
Resolved: @coursesmith/teacher (v1.0.0)
```

Resolution rules:

1. Exact match on capability name
2. If multiple plugins provide the capability:
   - Use explicit plugin selection from pipeline config
   - Otherwise use version priority (highest compatible)
   - Otherwise use configured default
3. If no plugin provides the capability → pipeline error

## Pipeline Engine

Executes pipeline steps in order.

```text
1. Load pipeline YAML
2. Validate pipeline structure
3. Resolve all capabilities upfront
4. For each step:
   a. Load input artifacts from Artifact Bus
   b. Execute agent plugin
   c. Validate output artifacts
   d. Publish to Artifact Bus
   e. Log completion
5. Execute publisher step
6. Generate manifest
```

## Artifact Bus

In-memory artifact store during pipeline execution.

```text
Interface:
  publish(artifact: Artifact): void
  consume(type: string, id?: string): Artifact | Artifact[]
  list(): Artifact[]
  clear(): void
```

## Artifact Validator

Validates artifacts against JSON Schemas.

```text
Validation:
  1. Load schema for artifact type
  2. Check required fields
  3. Validate field types and constraints
  4. Verify identifier format
  5. Check reference integrity
  6. Return validation result (pass/fail + errors)
```

## Publisher Engine

Writes final artifacts to the output directory.

```text
1. Load publisher plugin
2. Determine output structure from manifest
3. Write each artifact to its target path
4. Generate manifest.json
5. Return output summary
```

## Logger

Produces structured logs throughout execution.

```yaml
timestamp: 2026-01-15T10:30:00Z
level: info
component: pipeline-engine
event: step.started
step:
  id: teacher
  capability: generate-lesson
  attempt: 1
```

---

# 5. Execution Flow

```text
┌──────────────────────────────────────────────────────────┐
│                     coursesmith.yaml                      │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    1. Validate Project                    │
│  - Read coursesmith.yaml                                 │
│  - Validate against schema                               │
│  - Validate output directory exists                      │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    2. Load Plugins                        │
│  - Scan discovery paths                                  │
│  - Parse plugin.yaml manifests                           │
│  - Check runtime compatibility                           │
│  - Resolve dependencies                                  │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    3. Resolve Capabilities                │
│  - Build capability → plugin mapping                     │
│  - Validate every pipeline step can be resolved          │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    4. Initialize Pipeline                 │
│  - Load pipeline YAML                                    │
│  - Parse input sources                                   │
│  - Initialize Artifact Bus                               │
│  - Create working directory                              │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│              5. Execute Pipeline Steps                    │
│  (loop over steps in order)                              │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Step: Load Input → Execute → Validate → Publish  │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    6. Publish Output                      │
│  - Run publisher plugin                                  │
│  - Write artifacts to output directory                   │
│  - Generate manifest.json                                │
│  - Log execution summary                                 │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    7. Complete                            │
│  - Return exit code                                      │
│  - Print summary to stdout                               │
└──────────────────────────────────────────────────────────┘
```

---

# 6. Runtime Adapters

The Runtime is designed to be platform-agnostic. Adapters provide the bridge to specific execution environments.

## Adapter interface

```yaml
adapter:
  name: opencode
  version: 1.0.0
  capabilities:
    - file-system
    - subprocess
    - network
    - ai-completion
```

## Built-in adapters

| Adapter | Environment | Notes |
|---------|-------------|-------|
| CLI | Terminal | Direct execution, no LLM |
| OpenCode | OpenCode | Uses OpenCode tool system |
| Claude Code | Claude Code | Uses Claude Code CLI |
| Generic | Any | Minimal adapter, raw LLM calls |

## Adapter responsibilities

- Provide file system access
- Execute subprocesses
- Make LLM completion calls
- Handle environment-specific configuration
- Translate between Runtime API and platform API

---

# 7. Installation

## Global CLI

```bash
npm install -g @coursesmith/cli
```

The CLI installs only the Runtime. No educational plugins are included.

## Project dependency

```bash
npm install --save-dev @coursesmith/core
```

```yaml
# coursesmith.yaml
project:
  name: my-course
  version: 1.0.0
pipeline: standard-course
```

## Init command

```bash
npx @coursesmith/cli init
```

Generates:

```text
my-course/
├── coursesmith.yaml
├── .coursesmith/
├── agents/
├── skills/
├── templates/
├── pipelines/
└── content/
```

---

# 8. Commands

```bash
coursesmith init                      # Initialize new project
coursesmith add <plugin>              # Install plugin
coursesmith remove <plugin>           # Uninstall plugin
coursesmith list                      # List installed plugins
coursesmith run                       # Run configured pipeline
coursesmith run <pipeline>            # Run specific pipeline
coursesmith validate                  # Validate project configuration
coursesmith plugins:list              # List available capabilities
coursesmith cache:clear               # Clear artifact cache
coursesmith --version                 # Show version
coursesmith --help                    # Show help
```

---

# 9. Error Handling

## Startup errors

| Error | Cause | Resolution |
|-------|-------|------------|
| `CONFIG_NOT_FOUND` | No coursesmith.yaml found | Run `coursesmith init` |
| `CONFIG_INVALID` | coursesmith.yaml is invalid | Check syntax |
| `PLUGIN_NOT_FOUND` | Declared plugin is missing | Run `coursesmith add <plugin>` |
| `CAPABILITY_UNRESOLVED` | No plugin provides a step's capability | Install the required plugin |
| `VERSION_MISMATCH` | Plugin incompatible with runtime | Update plugin or runtime |

## Runtime errors

| Error | Action |
|-------|--------|
| Step timeout | Retry with backoff (configurable) |
| Plugin crash | Retry (up to maxAttempts) |
| Validation failure | Stop pipeline, report errors |
| LLM call failure | Retry with backoff |
| Out of memory | Stop pipeline immediately |

---

# 10. Logging and Observability

```yaml
# coursesmith.yaml
logging:
  level: info
  format: json
  output: file
  file: .coursesmith/logs/runtime.log
```

Each log entry:

```json
{
  "timestamp": "2026-01-15T10:30:00Z",
  "level": "info",
  "component": "pipeline-engine",
  "runId": "cs-run-a1b2c3",
  "event": "step.completed",
  "data": {
    "step": "teacher",
    "duration": 12.4,
    "attempts": 1,
    "input": "lesson-plan-001",
    "output": "lesson-001"
  }
}
```

---

# 11. Configuration Reference

```yaml
project:
  name: string            # Required: project name
  version: string         # Required: project version

pipeline: string          # Required: pipeline identifier

runtime:
  provider: string        # Runtime adapter (default: "cli")
  model: string           # LLM model identifier
  temperature: number     # LLM temperature (0.0 - 1.0)
  maxConcurrency: number  # Max parallel steps (default: 1)
  timeout: number         # Step timeout in seconds (default: 300)

plugins:
  - string                # Plugin references (name, github:user/repo, or URL)

plugins_config:
  plugin-name:            # Plugin-specific configuration
    key: value

output:
  directory: string       # Output directory (default: "./output")
  format: string          # Publisher format (default: "markdown")
  overwrite: boolean      # Overwrite existing files (default: false)
  manifest: boolean       # Generate manifest (default: true)

cache:
  enabled: boolean        # Enable artifact caching (default: false)
  directory: string       # Cache directory (default: ".coursesmith/cache")
  ttl: number             # Cache TTL in seconds (default: 3600)

logging:
  level: string           # debug | info | warn | error
  format: string          # text | json
  output: string          # stdout | file | both
  file: string            # Log file path
```

---

# 12. Future Extensions

- **Hot reload** — detect config changes and restart pipelines
- **Remote execution** — run pipelines on remote runners
- **Dashboard** — web UI for monitoring pipeline execution
- **Plugin sandboxing** — isolate plugins for security
- **Multi-tenant runtime** — serve multiple projects from one runtime
- **API server mode** — expose Runtime as a REST API

---

# 13. Cross References

- `docs/04-architecture.md` — high-level architectural placement of the Runtime
- `docs/08-pipelines.md` — Pipeline Engine execution details
- `docs/10-plugin-api.md` — plugin discovery and lifecycle
- `docs/12-capabilities.md` — capability resolution mechanism
- `docs/13-configuration.md` — project configuration schema
