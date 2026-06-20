# docs/16-governance.md

# Governance Specification

Version: 1.0

Status: Draft

---

# 1. Purpose

This document defines the governance model for CourseSmith.

Governance covers how the project is managed, how decisions are made, how plugins are maintained, and how the ecosystem evolves while maintaining stability and backward compatibility.

---

# 2. Governance Principles

- **Open participation** — anyone can contribute plugins, skills, and pipelines
- **Quality gates** — contributions meet defined quality standards
- **Backward compatibility** — breaking changes require deprecation cycles
- **Transparency** — decisions and roadmap are public
- **Plugin independence** — no single plugin is required
- **Community-driven evolution** — major changes involve community input

---

# 3. Repository Structure

## Repository separation

```text
coursesmith/                     # Core runtime
coursesmith-plugins/official/    # Maintained plugins
coursesmith-plugins/community/   # Community plugins (references)
coursesmith-spec/                # Specification and tests
coursesmith-website/             # Documentation site
```

## Core repository

The main `coursesmith` repository contains:

- Runtime source code
- CLI source code
- Plugin SDK
- Core documentation
- CI/CD configuration
- Issue and PR templates

## Plugin repositories

Official plugins live in the `coursesmith-plugins` organization:

```text
coursesmith-parser-markdown/
coursesmith-parser-pdf/
coursesmith-curriculum-agent/
coursesmith-lesson-planner/
coursesmith-teacher/
coursesmith-quiz-generator/
coursesmith-flashcard-generator/
coursesmith-publisher-markdown/
coursesmith-publisher-docusaurus/
```

---

# 4. Release Process

## Versioning

CourseSmith follows Semantic Versioning (MAJOR.MINOR.PATCH):

| Bump | Scope | Frequency |
|------|-------|-----------|
| MAJOR | Breaking API changes | Yearly |
| MINOR | New features, deprecations | Quarterly |
| PATCH | Bug fixes, security | As needed |

## Release cycle

```text
1. Development (local branches)
2. Pre-release (alpha/beta/rc)
3. Release candidate testing
4. Stable release
5. Patch releases as needed
```

## Release checklist

- [ ] All tests pass
- [ ] Changelog updated
- [ ] Documentation updated
- [ ] Migration guide written (if breaking)
- [ ] Plugin compatibility verified
- [ ] Security audit completed
- [ ] Version bumped in all manifests
- [ ] Release tagged in Git
- [ ] Published to npm
- [ ] Release notes published

---

# 5. Plugin Governance

## Plugin tiers

| Tier | Maintainer | Quality | Support |
|------|-----------|---------|---------|
| **Official** | Core team | Full tests, docs, contracts | Guaranteed |
| **Community** | External author | Self-declared | Best effort |
| **Experimental** | Anyone | Minimal | None |

## Official plugin requirements

- Full test suite (unit, contract, golden, integration)
- Complete documentation (README, plugin.yaml, examples)
- Artifact schemas for all input/output types
- Compatibility with current and previous runtime major version
- No external dependencies beyond CourseSmith SDK
- Responsiveness to security issues (72 hours for critical)

## Community plugin guidelines

- Follow plugin structure defined in `docs/10-plugin-api.md`
- Declare compatibility with runtime version
- Include at minimum a README and plugin.yaml
- No malicious or deceptive behavior
- Licensed under a compatible open-source license

---

# 6. Decision Making

## Decision types

| Type | Process | Example |
|------|---------|---------|
| **Tactical** | Core team decides | Bug fix, patch release |
| **Minor** | Issue discussion + team decision | New capability, optional feature |
| **Major** | RFC process + community feedback | Breaking change, new extension point |
| **Strategic** | Foundation vote | Governance change, license change |

## RFC process

For major changes:

1. **Pre-RFC** — informal discussion in GitHub Issues
2. **RFC** — formal proposal document in `rfcs/` directory
3. **Review** — community review period (minimum 2 weeks)
4. **Decision** — core team accepts, rejects, or requests revisions
5. **Implementation** — RFC is implemented and merged

---

# 7. Compatibility Policy

## Runtime compatibility

- MAJOR version changes may break plugin API
- Deprecated features receive at least one MINOR version notice
- Migration guide provided for every breaking change
- Runtime can load plugins targeting the previous MAJOR version (with warnings)

## Artifact compatibility

- Artifact schemas use independent versioning
- New fields are always optional for one MINOR cycle
- Required fields are never removed — use deprecation
- Schema migrations documented and automated where possible

## Plugin compatibility

- Plugins declare runtime version requirements
- Runtime validates compatibility at load time
- Incompatible plugins produce clear error messages
- Plugin marketplaces filter by compatibility

---

# 8. Plugin Registry

## Official registry

```text
registry.coursesmith.dev
```

The registry provides:

- Plugin search and discovery
- Version listings
- Compatibility information
- Download counts and ratings
- Security audit status

## Registration process

1. Developer publishes plugin (GitHub, npm, or direct tarball)
2. Plugin is submitted to registry (automated or manual)
3. Registry validates manifest and structure
4. Registry runs compatibility checks
5. Plugin is listed (official tier requires additional review)

---

# 9. Code of Conduct

CourseSmith follows a standard Code of Conduct:

- Be respectful and inclusive
- Assume good faith
- Focus on technical merit
- Avoid personal attacks
- Welcome newcomers
- Resolve disagreements constructively

---

# 10. Contribution Process

## Steps

1. Find or create an issue
2. Discuss approach with community
3. Fork the repository
4. Implement the change
5. Add tests
6. Update documentation
7. Submit pull request
8. Address review feedback
9. Merge (after approval)

## PR requirements

- Passes all CI checks
- Includes tests (unit + contract for plugins)
- Includes documentation updates
- Follows coding style (see `docs/17-style-guide.md`)
- No breaking changes without deprecation notice

---

# 11. Licensing

CourseSmith Core and official plugins are licensed under the **Apache License 2.0**.

Community plugins may use any OSI-approved open-source license.

---

# 12. Future Extensions

- **Plugin certification** — formal certification program for official plugins
- **Plugin quality scoring** — automated quality metrics for registry listings
- **Governance board** — elected community governance board for strategic decisions
- **Funding model** — open collective or similar for sustainable development
- **Security incident response team** — dedicated team for security issues
- **Plugin retirement policy** — process for officially retiring deprecated plugins

---

# 13. Cross References

- `docs/10-plugin-api.md` — plugin manifest and packaging requirements
- `docs/14-testing.md` — quality gates for plugin acceptance
- `docs/17-style-guide.md` — coding and documentation style
- `docs/18-roadmap.md` — planned releases and milestones
- `docs/20-contributing.md` — detailed contribution guide
