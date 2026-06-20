# CourseSmith — AGENTS.md

## Start here

Read `Master_Prompt.md` first — it is the primary instruction file for any AI agent working in this repository.

Then read the documents under `docs/` in numbered order (01 → 20).

## Project phase

**Implementation complete.** TypeScript packages under `packages/` (core + cli) and `plugins/` (teacher, quiz-generator, flashcard-generator, publisher, web-research). Documentation in `docs/` is the formal specification.

## Implementation summary

- **Monorepo** with npm workspaces under `packages/` and `plugins/`
- **Core** (`packages/core`): ArtifactBus, PluginRegistry, CapabilityResolver, PipelineEngine, config loader
- **CLI** (`packages/cli`): `init` and `run` commands, plugin loader with builtin discovery
- **Plugins** (6 total): web-research, teacher, quiz-generator, flashcard-generator, publisher
- **Built-in pipeline**: `packages/core/pipelines/standard-course.yaml`
- **All packages build** with `npm run build --workspaces`
- **Pipeline tested** generating 137 artifacts from Docker syllabus

## npm publishing

| Package | Status |
|---------|--------|
| `coursesmith-core` | ⏳ Pending (2FA config blocked, see note) |
| `coursesmith-cli` | ⏳ Pending |
| `coursesmith-teacher` | ⏳ Pending |
| `coursesmith-quiz-generator` | ⏳ Pending |
| `coursesmith-flashcard-generator` | ⏳ Pending |
| `coursesmith-web-research` | ⏳ Pending |
| `coursesmith-publisher` | ⏳ Pending |

**Pending reason:** npm account has 2FA enabled but the user cannot access the npm website (login redirects to 404). Must publish once the website is accessible and 2FA can be adjusted.

**Temporary install workaround:**
```bash
npx github:erickguedes/coursesmith init meu-curso
```

## GitHub

Remote: `https://github.com/erickguedes/coursesmith`

## Key reference files

| File | Purpose |
|------|---------|
| `Master_Prompt.md` | Agent role, mission, doc order, rules |
| `README.md` | User-facing project overview and quickstart |
| `docs/04-architecture.md` | System architecture and component boundaries |
| `docs/05-domain-model.md` | Entity definitions and artifact lifecycle |
| `docs/06-agents.md` | Agent contracts, lifecycle, and capability system |
| `docs/AI_IMPLEMENTATION_GUIDE.md` | Implementation constitution |

## Build commands

```bash
npm run build --workspaces     # Compile all packages
npm run dev --workspaces       # Watch mode
```
