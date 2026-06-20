# docs/20-contributing.md

# Contributing Guide

Version: 1.0

Status: Draft

---

# 1. Purpose

This document explains how to contribute to CourseSmith.

All contributions — code, documentation, plugins, bug reports, and feature requests — are welcome.

---

# 2. Code of Conduct

All contributors must follow the CourseSmith Code of Conduct:

- Be respectful and inclusive
- Assume good faith
- Focus on technical merit
- Welcome newcomers
- Resolve disagreements constructively

---

# 3. Getting Started

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+
- Git
- An LLM API key (for running pipelines)

## Setup

```bash
# Clone the repository
git clone https://github.com/coursesmith/coursesmith.git
cd coursesmith

# Install dependencies
npm ci

# Build
npm run build

# Run tests
npm test

# Verify setup
node packages/cli/bin/coursesmith.js --version
```

## Development workflow

```bash
# Watch mode
npm run dev

# Lint
npm run lint

# Type check
npm run typecheck

# Test (watch)
npm run test -- --watch

# Test specific package
npm run test -- --scope @coursesmith/core
```

---

# 4. Repository Structure

```text
coursesmith/
├── packages/
│   ├── core/              # Runtime core
│   ├── cli/               # CLI interface
│   ├── plugin-sdk/        # Plugin development SDK
│   └── adapters/          # Runtime adapters
├── plugins/
│   ├── official/          # Maintained plugins
│   └── community/         # Community plugin references
├── docs/                  # Specification documentation
├── schemas/               # JSON Schemas
├── templates/             # Project templates
├── examples/              # Example projects
├── tests/                 # Integration and E2E tests
├── .github/               # CI/CD workflows
├── AGENTS.md              # AI agent instructions
├── Master_Prompt.md       # Primary AI instruction file
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

---

# 5. How to Contribute

## Reporting bugs

Open a GitHub issue with:

1. CourseSmith version (`coursesmith --version`)
2. Plugin versions
3. Configuration (sanitize API keys)
4. Full error output
5. Steps to reproduce
6. Expected vs actual behavior

## Suggesting features

Open a GitHub issue with:

1. Problem statement
2. Proposed solution
3. Alternative approaches considered
4. How it fits the architecture (plugin vs core)

## Writing documentation

Documentation follows the standards in `docs/17-style-guide.md`:

1. Read existing docs to understand the style
2. Never duplicate concepts — extend instead
3. Maintain terminology consistency
4. Include cross-references

## Creating plugins

Follow `docs/10-plugin-api.md`:

1. Create plugin directory with `plugin.yaml`
2. Implement capabilities
3. Add tests
4. Publish to npm or GitHub
5. Submit to plugin registry

## Creating Skills

Follow `docs/07-skills.md`:

1. Define skill manifest
2. Write prompt template
3. Add examples and tests
4. Submit as plugin or contribute to existing agent

## Creating Pipelines

Follow `docs/08-pipelines.md`:

1. Create pipeline YAML
2. Test with `coursesmith run <pipeline> --dry-run`
3. Submit as plugin or add to pipelines/

---

# 6. Pull Request Process

## Before submitting

- [ ] Code follows style guide
- [ ] Tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Type check passes (`npm run typecheck`)
- [ ] Documentation updated
- [ ] Changeset added (if applicable)

## PR requirements

1. One PR per logical change (no mixed concerns)
2. Descriptive title and description
3. Reference the related issue number
4. Include tests for new code
5. Include documentation for new features
6. No breaking changes without deprecation notice

## Review process

1. Automated checks run (CI)
2. At least one maintainer reviews
3. Reviewer may request changes
4. Author addresses feedback
5. Maintainer approves and merges

## After merge

- PR is squashed into a single commit
- Commit message follows conventional commits format
- Changelog updated

---

# 7. Conventional Commits

```
<type>(<scope>): <description>

[optional body]
```

Types:

| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `chore` | Maintenance |
| `refactor` | Code restructuring |
| `test` | Adding or fixing tests |
| `perf` | Performance improvement |
| `style` | Formatting, style |
| `ci` | CI/CD changes |

Examples:

```
feat(runtime): add parallel step execution
fix(teacher-agent): handle empty lesson plans gracefully
docs(architecture): clarify artifact bus interface
test(core): add capability resolver unit tests
```

---

# 8. Branch Strategy

```text
main              # Stable releases
develop           # Integration branch
feat/*            # Feature branches
fix/*             # Bug fix branches
docs/*            # Documentation branches
release/*         # Release preparation
```

- Feature branches branch from `develop`
- Bug fix branches branch from the affected release
- Release branches branch from `develop` for stabilization

---

# 9. Release Process

1. Release branch created from `develop`
2. Stabilization period (testing, documentation)
3. Version bump in package manifests
4. Changelog finalized
5. Release candidate published
6. Final testing
7. Merge to `main` and tag
8. Publish to npm
9. Release notes published on GitHub

---

# 10. Setting Up a Development Environment

## Full setup

```bash
git clone https://github.com/coursesmith/coursesmith.git
cd coursesmith
npm ci
npm run build
npm test
```

## Testing with real LLM

```bash
export COURSESMITH_API_KEY=sk-...
npm run test:e2e
```

## Testing without LLM

```bash
npm run test:unit        # Unit tests only
npm run test:contract    # Contract tests only
```

---

# 11. Plugin Development

## Scaffold a plugin

```bash
npx @coursesmith/plugin-sdk init my-plugin
cd my-plugin
npm install
```

## Plugin structure

```text
my-plugin/
├── plugin.yaml
├── README.md
├── src/
│   └── index.ts
├── schemas/
├── tests/
│   ├── unit/
│   ├── contract/
│   └── golden/
└── package.json
```

## Local testing

```bash
# Link plugin locally
cd my-plugin
npm link

# In your course project
npm link @coursesmith/my-plugin
coursesmith run
```

---

# 12. Documentation Contributions

## Writing style

Follow `docs/17-style-guide.md`. Key points:

- Professional technical English
- Precise, implementation-oriented
- Assume senior engineer audience
- All sections required (Purpose, Motivation, etc.)
- Cross-references to related documents

## Documentation directory

```text
docs/
├── NN-title.md          # Numbered spec documents
├── AI_IMPLEMENTATION_GUIDE.md     # Implementation constitution
└── README.md                       # Doc index (generated)
```

---

# 13. Getting Help

- GitHub Issues — bug reports and feature requests
- GitHub Discussions — questions and community support
- Discord — real-time chat (invite in README)

---

# 14. Cross References

- `docs/16-governance.md` — project governance and decision making
- `docs/17-style-guide.md` — coding and documentation style
- `docs/18-roadmap.md` — planned development milestones
- `docs/19-faq.md` — common questions
- `docs/14-testing.md` — testing requirements
- `Master_Prompt.md` — primary AI instruction file
- `AGENTS.md` — compact AI orientation
