# docs/17-style-guide.md

# Style Guide

Version: 1.0

Status: Draft

---

# 1. Purpose

This document defines coding and documentation standards for CourseSmith.

Consistent style ensures that the codebase remains readable, maintainable, and predictable across all contributions.

---

# 2. Documentation Style

## Language

- Professional technical English
- Precise and implementation-oriented
- Assume senior software engineer audience
- Avoid marketing language and unnecessary explanations
- Avoid humor, metaphors, and casual phrasing

## Document structure

Every document follows this template:

```markdown
# docs/NN-title.md

# Title

Version: X.Y

Status: Draft

---

# 1. Purpose

One paragraph explaining what this document defines.

---

# 2. Motivation

Why this concept exists and what problem it solves.

---

# N. Cross References

- `docs/related-doc.md` — relationship description
```

## Section format

```markdown
# 1. Major Section                (h1 with number)

## Subsection                     (h2)

Text content.

### Sub-subsection                (h3)

More details.
```

## Lists

```markdown
- Item one
- Item two
- Nested item
  - Sub-item

1. Ordered step one
2. Ordered step two
```

## Code blocks

```markdown
```yaml
key: value
```
```

Every code block must specify the language.

## Cross references

```markdown
- `docs/04-architecture.md` — high-level architecture
- `docs/10-plugin-api.md#section-4` — specific section reference
```

---

# 3. YAML Style

- Use 2-space indentation
- No tabs
- Use `---` document separator for standalone files
- Prefer single-line for simple values
- Use multi-line (`|` or `>`) for long strings
- Quote strings containing special characters
- Place colons after keys with one space

```yaml
# Good
name: my-plugin
version: 1.0.0
description: |
  A longer description that spans
  multiple lines.
tags:
  - assessment
  - quiz

# Bad
name:my-plugin
version : 1.0.0
description: A very long description that should use block scalar
```

---

# 4. JSON Style

- Use 2-space indentation
- No trailing commas
- Use double quotes for strings
- Include trailing newline
- Prefer descriptive property names

---

# 5. Markdown Style

- Use ATX headers (`#`, not underlines)
- One space after `#` in headers
- Blank line before and after headers
- Blank line before and after code blocks
- Use `---` for horizontal rules between sections
- Use `*` for italic, `**` for bold
- Use `>` for blockquotes (sparingly)
- Use `-` for unordered lists, `1.` for ordered
- Code spans use backticks

---

# 6. Naming Conventions

## Identifiers

| Context | Convention | Example |
|---------|-----------|---------|
| Plugin names | kebab-case with scope | `@coursesmith/teacher` |
| Capabilities | kebab-case | `generate-lesson` |
| Artifact types | kebab-case | `lesson-plan` |
| Artifact IDs | kebab-case with numbers | `lesson-networking-001` |
| Configuration keys | camelCase | `lessonLength` |
| Environment variables | UPPER_SNAKE_CASE | `COURSESMITH_API_KEY` |
| File names | kebab-case | `plugin.yaml` |
| Directory names | kebab-case | `lesson-planner/` |
| Tags | kebab-case | `networking` |

## File extensions

| Format | Extension |
|--------|-----------|
| Markdown | `.md` |
| YAML | `.yaml` |
| JSON | `.json` |
| Mermaid | `.mmd` |
| Environment | `.env` |
| Git ignore | `.gitignore` |

---

# 7. Schema Style

JSON Schema conventions:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://coursesmith.dev/schemas/lesson.json",
  "type": "object",
  "required": ["id", "type", "version", "title"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^lesson-[a-z0-9-]+$",
      "description": "Unique lesson identifier"
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    }
  },
  "additionalProperties": false
}
```

Rules:

- Include `$schema` and `$id`
- Use `draft-07`
- Set `additionalProperties: false` for strict validation
- Include descriptions for non-obvious fields
- Use semantic patterns over length constraints

---

# 8. CLI Style

```bash
# Commands
coursesmith <command> [options]

# Command format
coursesmith run                     # Verb form
coursesmith plugin:list             # Colon for related subcommands
coursesmith cache:clear

# Flags
coursesmith run --pipeline standard-course   # Long form preferred
coursesmith run -p standard-course           # Short form available
coursesmith run --no-cache                   # Boolean negation

# Arguments
coursesmith add @coursesmith/teacher         # Positional
coursesmith run --output ./dist              # Flag with value
```

---

# 9. Documentation Versioning

Each document carries a version:

```markdown
Version: 1.0
Status: Draft         # Draft | Review | Stable | Deprecated
```

Status lifecycle:

```text
Draft → Review → Stable → Deprecated
```

- **Draft** — initial writing, may change significantly
- **Review** — under community review before stabilization
- **Stable** — accepted as current standard
- **Deprecated** — superseded by newer version

---

# 10. Cross References

- `docs/20-contributing.md` — detailed contribution guidelines
- `docs/16-governance.md` — code review and quality standards
- `docs/14-testing.md` — test style and conventions
