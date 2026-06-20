# docs/19-faq.md

# Frequently Asked Questions

Version: 1.0

Status: Draft

---

# 1. General

## What is CourseSmith?

CourseSmith is an open-source, AI-native framework for curriculum engineering. It transforms structured educational knowledge (syllabi, books, documentation, PDFs, Markdown) into complete, modular courses through deterministic multi-agent orchestration.

## Is CourseSmith a chatbot?

No. CourseSmith is a framework that runs deterministic pipelines to generate courses. It is not a conversational interface.

## Is CourseSmith a prompt library?

No. CourseSmith uses Skills (structured prompting units) as part of its architecture, but the framework is a complete runtime with plugin discovery, capability resolution, artifact validation, and pipeline execution.

## Is CourseSmith tied to any LLM provider?

No. The runtime is provider-agnostic. Supported providers are configured through adapters.

## Is CourseSmith tied to OpenCode?

No. OpenCode is one possible runtime adapter. CourseSmith supports multiple runtimes including CLI, Claude Code, Codex CLI, and Cursor.

---

# 2. Architecture

## Why doesn't the Runtime contain educational logic?

Educational logic belongs in plugins. The Runtime only loads config, discovers plugins, resolves capabilities, executes pipelines, validates artifacts, and publishes output. This ensures the framework is extensible without modifying the core.

## How do agents communicate?

Agents communicate exclusively through Artifacts. There is no direct agent-to-agent communication, no free-text exchange between agents.

## What is a Capability?

A Capability is an abstraction that describes what an agent can do. Pipelines request capabilities by name, and the Runtime resolves them to specific plugins. This decouples pipeline definitions from plugin implementations.

## What is a Skill?

A Skill is a reusable reasoning unit that encapsulates prompting strategy. Agents load and orchestrate Skills to produce artifacts. Skills are versionable, testable, and reusable across agents.

## What is an Artifact?

An Artifact is a structured, immutable output produced by an agent. All framework entities (courses, modules, lessons, quizzes, etc.) are Artifacts. Artifacts are validated against schemas, versioned, and stored as plain text.

---

# 3. Usage

## How do I start using CourseSmith?

```bash
npx @coursesmith/cli init my-course
cd my-course
# Edit coursesmith.yaml with your settings
# Add your syllabus to content/
npx coursesmith run
```

## Can I generate a single lesson?

Yes. Use the `regenerate-lesson` pipeline:

```bash
npx coursesmith run regenerate-lesson --lesson lesson-networking-001
```

## Can I customize the output format?

Yes. Plugins define output formats. Install a different publisher plugin or create your own.

## Can I use my own LLM provider?

Yes. Configure the provider in `coursesmith.yaml`:

```yaml
runtime:
  provider: openai
  model: gpt-5
  apiKey: ${OPENAI_API_KEY}
```

## Can I run CourseSmith without an LLM?

The Runtime can run without an LLM for validation and dry-run operations:

```bash
coursesmith validate     # Validate configuration only
coursesmith run --dry-run  # Validate pipeline without execution
```

---

# 4. Development

## How do I create a plugin?

Follow the plugin structure defined in `docs/10-plugin-api.md`. At minimum:

1. Create a directory with `plugin.yaml`
2. Declare your plugin metadata and capabilities
3. Implement the capability
4. Test with `coursesmith test`

## How do I create a Skill?

Follow the skill structure defined in `docs/07-skills.md`. At minimum:

1. Create a `skill.yaml` with input/output schema
2. Write `prompt.md` with the reasoning instructions
3. Add examples if applicable
4. Test with golden output tests

## How do I create a Pipeline?

Follow the pipeline structure defined in `docs/08-pipelines.md`. Create a YAML file in your `pipelines/` directory:

```yaml
pipeline:
  name: my-pipeline
  steps:
    - capability: parse-markdown
    - capability: generate-lesson
```

## Can I use CourseSmith without npm?

CourseSmith is designed for npm distribution, but the core is platform-agnostic. You can build from source or use Docker images.

---

# 5. Plugins

## Where can I find plugins?

Official plugins are published on npm under the `@coursesmith` scope. Community plugins can be found on GitHub and the plugin registry.

## Can I write a plugin in any language?

Currently plugins are written in TypeScript/JavaScript. Future versions may support additional languages through WASM or gRPC.

## Are plugins sandboxed?

Current plugins run in the same process. Sandboxed execution (Docker, WASM) is planned for v2.0.

## What happens if a plugin has a security issue?

Security issues are handled according to the policy in `docs/15-security.md`. Critical issues receive immediate patch releases.

---

# 6. Output

## What format are generated courses?

Primary output is Markdown. Other formats (Docusaurus, MkDocs, HTML) are available through publisher plugins.

## Are generated courses human-editable?

Yes. Every artifact is plain text (Markdown, YAML, or JSON) and can be edited with any text editor.

## Can I version generated courses in Git?

Yes. All artifacts are Git-native. The output directory can be committed to any Git repository.

## Can I regenerate part of a course without losing edits?

Yes. The framework preserves existing files by default (`overwrite: false`). Individual lessons can be regenerated independently.

---

# 7. Performance

## How long does course generation take?

Depends on course size and LLM speed. A typical 10-lesson module takes 5-15 minutes.

## Can I parallelize generation?

Yes. Steps can be configured to run in parallel. This is especially useful for generating independent artifacts (lessons, quizzes, flashcards).

## Does CourseSmith cache results?

Optional caching is available. Enable it in `coursesmith.yaml`:

```yaml
cache:
  enabled: true
  ttl: 3600
```

---

# 8. Troubleshooting

## Pipeline fails with "capability not found"

The required plugin is not installed:

```bash
coursesmith search generate-lesson  # Find the plugin
coursesmith add @coursesmith/teacher # Install it
```

## Pipeline fails with "validation error"

Check the artifact schema. Common issues:

- Missing required fields
- Wrong field types
- Invalid identifier format

Run `coursesmith validate` to check your configuration.

## Plugin produces low-quality output

- Check the Skill configuration (tone, length, examples)
- Try a different LLM model
- Adjust the temperature setting
- Check the input Artifact quality

## "API key not found"

Set your API key as an environment variable:

```bash
export COURSESMITH_API_KEY=sk-...
```

---

# 9. Community

## How can I contribute?

See `docs/20-contributing.md` for detailed guidance.

## Where is the source code?

The main repository is at `github.com/coursesmith/coursesmith`.

## What license does CourseSmith use?

Apache License 2.0 for the core and official plugins.

## How do I report a bug?

Open an issue on GitHub with:

- CourseSmith version
- Plugin versions
- Configuration (sanitized)
- Full error output
- Steps to reproduce

---

# 10. Cross References

- `docs/01-vision.md` — product vision
- `docs/02-business-case.md` — problem and market context
- `docs/03-prd.md` — detailed requirements
- `docs/20-contributing.md` — how to get involved
