# CourseSmith — AGENTS.md

## Start here

Read `Master_Prompt.md` first — it is the primary instruction file for any AI agent working in this repository.

Then read the documents under `docs/` in numbered order (01 → 20).

## Project phase

**Documentation phase.** No implementation code exists yet. This repository contains only specifications. The documentation *is* the source code. Treat it with the same rigor.

## Existing docs status

| File | Status |
|------|--------|
| `01-vision.md` | Complete |
| `02-business-case.md` | Empty — needs content |
| `03-prd.md` | Complete |
| `04-architecture.md` | Complete |
| `05-domain-model.md` | Complete |
| `06-agents.md` | Complete |
| `07-skills.md` | Not created |
| `08-pipelines.md` | Not created |
| `09-artifacts.md` | Not created |
| `10-plugin-api.md` | Empty — needs content |
| `11-runtime.md` → `20-contributing.md` | Not created |
| `AI_IMPLEMENTATION_GUIDE.md` | Complete (secondary reference) |

## Documentation quality standard

Every document must explain: **Purpose, Motivation, Responsibilities, Inputs, Outputs, Configuration, Examples, Contracts, Validation, Failure cases, Future extensions, Cross references.**

Never leave the reader guessing.

## Immutable architecture rules

These come from `Master_Prompt.md` and the architecture docs. Do not violate them:

- **Runtime never contains educational logic.** The Core only loads config, discovers plugins, resolves capabilities, executes pipelines, validates artifacts, and publishes output.
- **Agents communicate only through Artifacts.** No direct agent-to-agent calls. No free-text exchange.
- **Everything is a plugin.** Agents, skills, templates, pipelines, publishers, validators, parsers — all plugins.
- **Pipelines are declarative YAML.** Never hardcode educational workflows.
- **Everything is Git-native.** Markdown, JSON, YAML only. No proprietary formats, no binary artifacts.
- **Runtime agnostic.** The framework must not depend on OpenCode, Claude Code, or any specific AI runtime. Adapters enable integration.
- **Artifacts are immutable, versioned, and validated.** No in-place edits.
- **Backward compatibility is mandatory.** Never replace existing concepts — propose compatible evolutions.

## Coding philosophy

Prefer: Composition > inheritance, Interfaces > concrete classes, Contracts > conventions, Schemas > assumptions, Plugins > modifications, Configuration > branching logic.

## Style

Professional technical English. Precise, implementation-oriented. Assume senior software engineer audience. Avoid marketing language and unnecessary explanations.

## Adding new documentation

Follow the order defined in `Master_Prompt.md`. Add new numbered docs when a concept is not covered by existing ones. Never duplicate. Never contradict. Always extend.

## Key reference files

- `Master_Prompt.md` — agent role, mission, doc order, rules
- `docs/AI_IMPLEMENTATION_GUIDE.md` — implementation constitution
- `docs/04-architecture.md` — system architecture and component boundaries
- `docs/05-domain-model.md` — entity definitions and artifact lifecycle
- `docs/06-agents.md` — agent contracts, lifecycle, and capability system
