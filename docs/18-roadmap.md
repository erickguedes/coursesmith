# docs/18-roadmap.md

# Roadmap

Version: 1.0

Status: Draft

---

# 1. Purpose

This document defines the planned evolution of CourseSmith across major versions.

The roadmap is a living document, updated as the project evolves and community priorities shift.

---

# 2. Version Philosophy

- **v1.x** — establish the core framework, plugin model, and essential agents
- **v2.x** — expand the plugin ecosystem, improve runtime capabilities
- **v3.x** — enterprise features, advanced orchestration, scale

Each major version guarantees at least 12 months of patch support after the next major release.

---

# 3. Version 1.0 — Foundation

## Themes

Core runtime, essential agents, basic pipeline, Markdown publishing.

## Milestones

### M1: Runtime Core

- [ ] Configuration Loader (coursesmith.yaml)
- [ ] Plugin Registry + discovery
- [ ] Capability Resolver
- [ ] Pipeline Engine (sequential steps)
- [ ] Artifact Bus (in-memory)
- [ ] Artifact Validator (JSON Schema)
- [ ] Publisher Engine
- [ ] Logger

### M2: CLI

- [ ] `coursesmith init`
- [ ] `coursesmith run`
- [ ] `coursesmith add / remove / list`
- [ ] `coursesmith validate`
- [ ] `coursesmith cache:clear`

### M3: Core Plugins

- [ ] Markdown parser
- [ ] Curriculum Architect agent
- [ ] Lesson Planner agent
- [ ] Teacher agent
- [ ] Quiz Generator agent
- [ ] Flashcard Generator agent
- [ ] Markdown Publisher

### M4: Standard Pipelines

- [ ] `standard-course` pipeline
- [ ] `quick-course` pipeline
- [ ] `regenerate-lesson` pipeline

### M5: Testing & Quality

- [ ] Unit test framework
- [ ] Contract tests for all plugins
- [ ] Golden output tests
- [ ] Integration tests
- [ ] E2E tests for standard pipeline
- [ ] Determinism verification

### M6: Documentation

- [ ] All 20 specification documents complete
- [ ] Plugin SDK documentation
- [ ] Getting started guide
- [ ] Tutorial: create a course from syllabus
- [ ] Tutorial: create a custom agent plugin

---

# 4. Version 1.1 — Enhancement

## Themes

PDF support, parallel execution, caching, additional agents.

- [ ] PDF parser plugin
- [ ] DOCX parser plugin
- [ ] Parallel step execution
- [ ] Artifact caching
- [ ] Exercise Generator agent
- [ ] Lab Writer agent
- [ ] Summary Generator agent
- [ ] Mermaid Diagram agent
- [ ] `validate-course` pipeline
- [ ] Course manifest generation

---

# 5. Version 1.2 — Community

## Themes

Plugin registry, community onboarding, runtime adapters.

- [ ] Official plugin registry
- [ ] `coursesmith search` command
- [ ] `coursesmith publish` command
- [ ] OpenCode runtime adapter
- [ ] Claude Code runtime adapter
- [ ] Generic CLI adapter (direct LLM calls)
- [ ] RFC process documentation
- [ ] Community plugin template
- [ ] Example projects

---

# 6. Version 2.0 — Scale

## Themes

Advanced pipelines, composite skills, sandboxing.

### Breaking changes (if any)

- Plugin API may evolve based on v1.x feedback
- Artifact schemas may add new required fields

### Features

- [ ] Pipeline branching (conditional paths)
- [ ] Pipeline composition (nested pipelines)
- [ ] Composite skills (skill chaining)
- [ ] Plugin sandboxing (Docker/WASM)
- [ ] Plugin signing and verification
- [ ] Streaming artifact generation
- [ ] Multi-model routing (different models per step)
- [ ] Performance benchmarks
- [ ] `add-diagrams` pipeline
- [ ] `translate-course` pipeline
- [ ] Docusaurus publisher plugin
- [ ] MkDocs publisher plugin

---

# 7. Version 2.1 — Intelligence

## Themes

Output quality improvements, determinism enhancements.

- [ ] Skill A/B testing framework
- [ ] Output quality scoring
- [ ] Automated skill improvement loop
- [ ] Multi-attempt consensus (run 3x, pick best)
- [ ] Content cross-reference verification
- [ ] Plagiarism / originality check

---

# 8. Version 3.0 — Enterprise

## Themes

Security, governance, cloud scale.

### Features

- [ ] Multi-tenant runtime
- [ ] REST API server mode
- [ ] GitHub Actions integration
- [ ] Scheduled pipeline execution
- [ ] Audit trail and compliance reporting
- [ ] Role-based access control (RBAC)
- [ ] Encrypted secrets management
- [ ] SSO/SAML integration
- [ ] Cloud execution (AWS Batch / GCP Cloud Run)
- [ ] Managed cloud offering

---

# 9. Future (Post v3.0)

## Exploration

- **Adaptive learning** — personalize courses based on learner progress
- **Assessment engine** — auto-grading and feedback generation
- **Knowledge graph generation** — export curriculum as knowledge graphs
- **Interactive content** — generate sandbox environments and simulations
- **Multi-language** — generate and maintain courses in multiple languages
- **Content marketplace** — share and sell generated courses
- **Visual editor** — drag-and-drop pipeline builder

---

# 10. Deprecation Policy

## Feature deprecation

1. Announce deprecation in MINOR version release notes
2. Feature remains functional for one MAJOR version cycle
3. Feature is removed in the next MAJOR version

Example: deprecated in v1.2 → removed in v2.0.

## Plugin deprecation

1. Official plugins are deprecated with one MINOR version notice
2. Deprecated plugins remain available in registry with "deprecated" tag
3. Community plugins may be deprecated at any time by their maintainers

---

# 11. Cross References

- `docs/01-vision.md` — long-term product vision
- `docs/16-governance.md` — release process and decision making
- `docs/10-plugin-api.md` — plugin API evolution planning
- `docs/20-contributing.md` — how to contribute to roadmap items
