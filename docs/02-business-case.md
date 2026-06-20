# docs/02-business-case.md

# Business Case

Version: 1.0

Status: Draft

---

# 1. Problem Statement

Creating high-quality educational content with Large Language Models is currently unreliable and unscalable.

Each course requires extensive prompt engineering, repeated manual iterations, and bespoke workflows that cannot be reused across projects. The result is:

- **Inconsistent quality** — outputs vary widely between sessions and models
- **No structure** — generated content lacks standard formats, making editing and publishing difficult
- **Poor reuse** — every new course starts from scratch, even when domains overlap
- **Fragile prompts** — small changes to a prompt can break the entire output
- **No determinism** — the same input can produce completely different results
- **No audit trail** — there is no record of how content was created or what sources were used

Educational institutions, training companies, and technical content creators lack a framework to transform source knowledge into structured courses reliably and reproducibly.

---

# 2. Target Audience

## Primary

**Technical content professionals** creating educational material:
- Curriculum designers
- Technical instructors
- Developer advocates
- Training engineers
- Documentation writers

## Secondary

**Organizations** producing structured learning at scale:
- Universities and academic departments
- Corporate academies and L&D teams
- EdTech startups and platforms
- Open source projects needing documentation and tutorials
- Certification bodies

## Tertiary

**Independent creators** building courses as products:
- Course creators on platforms like Udemy, Coursera, or Skillshare
- Technical bloggers and newsletter writers
- Consultants packaging their expertise

---

# 3. Market Context

## Current approaches

| Approach | Limitation |
|----------|------------|
| Manual authoring | Slow, expensive, not scalable |
| Single LLM prompt | Unreliable, inconsistent, no structure |
| Prompt libraries | Fragile, model-dependent, no orchestration |
| LMS platforms | Content management, not content generation |
| Custom scripts | Not reusable, hard to maintain |

## Gap in the market

No open-source framework exists that:

1. Provides a **deterministic, multi-agent pipeline** for curriculum generation
2. Keeps the **runtime independent** of any LLM provider
3. Encapsulates educational logic in **reusable, versionable plugins**
4. Produces **Git-native, human-editable output**
5. Enables **declarative pipeline configuration** without writing code

CourseSmith fills this gap.

---

# 4. Competitive Landscape

## Adjacent projects

| Project | Focus | Differences from CourseSmith |
|---------|-------|------------------------------|
| LangChain | LLM application framework | Generic, not education-specific; no curriculum model |
| LlamaIndex | Data indexing for LLMs | Retrieval-focused, not generation-focused |
| Instructor | Structured LLM outputs | Single-responsibility, no orchestration |
| Docusaurus | Documentation sites | Publishing only, no generation |
| GitBook | Documentation platform | Managed service, not a framework |
| Curvenote | Scientific publishing | Academic focus, not curriculum engineering |

## Why CourseSmith wins

- **Domain-specific** — built for curriculum engineering, not general LLM orchestration
- **Plugin ecosystem** — educational knowledge lives in interchangeable plugins
- **Deterministic pipelines** — same input always produces the same output structure
- **Runtime independence** — not locked to any model or platform
- **Open source** — community can extend every component
- **Git-native** — courses are versionable, reviewable, and portable

---

# 5. Revenue Model

CourseSmith is **open source** under a permissive license.

Revenue opportunities:

- **Official plugin registry** — premium plugins maintained by the core team
- **Managed runtime** — cloud-hosted pipeline execution
- **Enterprise support** — SLA-backed support for organizations
- **Training and consulting** — workshops and implementation services
- **Certification** — developer certification program

---

# 6. Success Criteria

- A complete course can be generated from a syllabus in a single pipeline execution
- The same input produces identical output across runs (determinism)
- A new plugin can be created without modifying the Core runtime
- The framework runs on at least three different AI runtimes (OpenCode, Claude Code, CLI)
- All generated artifacts pass schema validation and are human-editable
- Any lesson can be regenerated independently without affecting the rest of the course

---

# 7. Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| LLM output inconsistency | Deterministic pipelines, validation gates, retry strategies |
| Plugin ecosystem fragmentation | Plugin SDK, compatibility contracts, versioning |
| Runtime dependency | Runtime-agnostic architecture from day one |
| Low adoption | Open source, permissive license, clear documentation |
| Quality variance across models | Capability-based routing, model-agnostic contracts |

---

# 8. Future Opportunities

- **Assessment engine** — automated grading and feedback
- **Adaptive learning** — personalized course paths based on learner performance
- **Content optimization** — A/B testing lesson variants
- **Multi-language generation** — translate courses while preserving structure
- **LMS integration** — publish directly to Moodle, Canvas, Blackboard
- **Interactive content** — generate simulations, code labs, and sandbox environments
- **Knowledge graph export** — generate curriculum graphs for visualization

---

# 9. Summary

CourseSmith addresses a clear market gap: the lack of an open-source, deterministic, multi-agent framework for curriculum engineering. By keeping the runtime minimal, educational logic in plugins, and outputs Git-native, it enables scalable, reproducible course generation while remaining independent of any LLM provider or runtime platform.
