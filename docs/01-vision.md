# CourseSmith

> **AI Multi-Agent Framework for Curriculum Engineering**

> *Transform a simple syllabus into a complete, structured and publishable learning experience.*

---

# Vision

CourseSmith is an open-source framework designed to automate the engineering of educational content using specialized AI agents.

Instead of asking a Large Language Model to "write a course", CourseSmith orchestrates multiple specialized agents that collaborate to transform a syllabus into a complete learning experience.

The project is designed to be AI-first.

Every component of the framework should be understandable, extensible and executable by AI coding assistants such as OpenCode, Claude Code, Codex CLI, Cursor and future compatible runtimes.

---

# Mission

Create an extensible framework capable of converting educational inputs into structured learning artifacts through deterministic multi-agent pipelines.

The framework must produce content that is:

* Modular
* Reproducible
* Extensible
* Versionable
* Reviewable
* Publishable

without requiring manual prompt engineering for every lesson.

---

# Project Scope

CourseSmith focuses exclusively on **course generation**.

It does not optimize existing content.

It does not evaluate learning performance.

It does not personalize learning.

Those capabilities are intentionally left to external frameworks.

---

# Primary Input

The framework accepts one or more educational sources, including:

* Course syllabus
* Curriculum
* Table of contents
* Markdown
* PDF
* DOCX
* Plain text
* Knowledge graph
* Existing documentation

---

# Primary Output

The framework generates a complete learning project containing:

* Course structure
* Modules
* Lessons
* Learning objectives
* Explanations
* Examples
* Practical labs
* Exercises
* Quizzes
* Projects
* Flashcards
* Summaries
* Mermaid diagrams
* Metadata
* Publishable Markdown

---

# Core Principles

## AI Native

Every workflow should be executable by AI.

---

## Artifact First

Agents never communicate using free text.

Agents exchange structured artifacts.

---

## Modular

Every agent can be replaced independently.

---

## Pipeline Based

Every course is produced through deterministic pipelines.

---

## Extensible

New agents, skills and templates can be added without modifying existing components.

---

## Versionable

Every artifact is stored as Markdown or structured files suitable for Git.

---

# Architecture Overview

```text
Input

↓

Pipeline

↓

Agents

↓

Artifacts

↓

Publisher

↓

Learning Project
```

---

# Repository Structure

```text
coursesmith/

README.md

LICENSE

CONTRIBUTING.md

docs/

01-vision.md

02-business-case.md

03-prd.md

04-architecture.md

05-domain-model.md

06-agents.md

07-skills.md

08-pipelines.md

09-artifacts.md

10-plugin-api.md

11-file-structure.md

12-roadmap.md

13-contributing.md

agents/

skills/

pipelines/

templates/

schemas/

examples/

tests/

plugin/
```

---

# Documentation Roadmap

## 01 — Vision

Product vision.

Mission.

Philosophy.

---

## 02 — Business Case

Problem statement.

Target audience.

Competitive landscape.

Future opportunities.

---

## 03 — Product Requirements Document

Functional requirements.

Non-functional requirements.

Acceptance criteria.

Constraints.

---

## 04 — Architecture

High-level architecture.

Modules.

Interfaces.

Runtime.

Execution flow.

---

## 05 — Domain Model

Educational entities.

Relationships.

Artifact lifecycle.

Metadata model.

---

## 06 — Agents

Definition of every AI agent.

Responsibilities.

Inputs.

Outputs.

Contracts.

Execution rules.

---

## 07 — Skills

Reusable capabilities shared by agents.

Prompt specifications.

Expected outputs.

Validation rules.

---

## 08 — Pipelines

End-to-end orchestration.

Pipeline definitions.

Execution order.

Failure handling.

Retry strategy.

---

## 09 — Artifacts

Markdown specification.

JSON schemas.

Naming conventions.

Metadata.

Versioning.

---

## 10 — Plugin API

How external runtimes integrate with CourseSmith.

Plugin lifecycle.

Configuration.

Hooks.

---

## 11 — File Structure

Generated course layout.

Naming conventions.

Folder hierarchy.

Output specification.

---

## 12 — Roadmap

Version planning.

Milestones.

Future capabilities.

---

## 13 — Contribution Guide

Development standards.

Coding conventions.

Documentation rules.

Testing strategy.

Pull request process.

---

# MVP

Version 1.0 should support:

* Parsing a syllabus
* Building the course hierarchy
* Generating modules
* Generating lessons
* Creating quizzes
* Creating practical labs
* Creating flashcards
* Producing Markdown output
* Publishing a structured course folder

---

# Long-Term Vision

CourseSmith should become the reference open-source framework for AI-powered curriculum engineering, allowing educational institutions, companies and independent creators to generate high-quality learning experiences from structured knowledge sources.
