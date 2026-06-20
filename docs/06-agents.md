# docs/06-agents.md

# Agent Specification

Version: 1.0

Status: Draft

---

# Purpose

This document defines the standard used by every AI Agent in CourseSmith.

Agents are independent software components responsible for producing Artifacts.

They encapsulate educational knowledge.

The Runtime never contains educational logic.

---

# Definition

An Agent is a specialized AI worker.

Agents receive Artifacts.

Agents execute Skills.

Agents generate new Artifacts.

Agents never communicate directly.

---

# Agent Lifecycle

Every Agent follows the same lifecycle.

```text
Receive Artifact

↓

Validate Input

↓

Load Skills

↓

Execute Task

↓

Validate Output

↓

Generate Artifact

↓

Publish
```

---

# Agent Responsibilities

An Agent MUST:

* accept one or more Artifacts

* execute one responsibility

* generate deterministic outputs

* validate generated artifacts

* never modify existing artifacts

* remain stateless

---

# Agent Interface

Every Agent implements the same interface.

```yaml
id:
name:
description:
version:
author:
capabilities:
input:
output:
skills:
configuration:
```

---

# Example

```yaml
id: teacher

name: Teacher Agent

version: 1.0

input:

- lesson-plan

output:

- lesson

capabilities:

- write-lesson

- explain-topic

skills:

- expand-topic

- explain-concept

- write-summary
```

---

# Agent Categories

CourseSmith defines several categories.

---

## Research Agents

Responsible for gathering and enriching source material.

Examples

Web Research Agent

Documentation Scraper

Reference Collector

Content Enricher

---

## Parser Agents

Responsible for importing information.

Examples

PDF Parser

Markdown Parser

DOCX Parser

Book Parser

---

## Planning Agents

Responsible for educational planning.

Examples

Curriculum Architect

Module Planner

Lesson Planner

Dependency Planner

---

## Content Agents

Responsible for producing educational material.

Examples

Teacher

Example Writer

Lab Writer

Project Writer

Reference Writer

---

## Assessment Agents

Responsible for evaluation.

Examples

Quiz Generator

Exercise Generator

Flashcard Generator

Exam Generator

---

## Visualization Agents

Responsible for diagrams.

Examples

Mermaid Generator

PlantUML Generator

Mind Map Generator

---

## Publishing Agents

Responsible for exporting.

Examples

Markdown Publisher

Docusaurus Publisher

MkDocs Publisher

HTML Publisher

---

# Agent Contract

Agents consume Artifacts.

Example

```text
lesson-plan.json

↓

Teacher

↓

lesson.md
```

Another example

```text
lesson.md

↓

Quiz Agent

↓

quiz.json
```

---

# Stateless Design

Agents must never keep internal state.

All required information must be contained in Artifacts.

---

# Configuration

Every Agent supports configuration.

Example

```yaml
teacher:

tone:

professional

lessonLength:

long

examples:

5

language:

en
```

---

# Skill Loading

Agents never contain prompts.

Agents load Skills.

Example

```text
Teacher

↓

expand-topic.md

↓

write-lesson.md

↓

create-summary.md
```

Skills remain reusable.

---

# Capability System

Agents expose Capabilities.

Example

```yaml
capabilities:

- generate-lesson

- summarize

- explain-topic
```

Pipelines depend on Capabilities.

Never on concrete Agents.

---

# Artifact Validation

Before publishing,

Agents validate:

schema

required fields

references

metadata

version

Invalid Artifacts terminate execution.

---

# Error Handling

Every Agent must classify errors.

Recoverable

Retryable

Fatal

Validation

Configuration

Unsupported Input

---

# Logging

Agents produce structured logs.

Example

```yaml
agent:

teacher

duration:

8s

input:

lesson-plan

output:

lesson

status:

success
```

---

# Plugin Packaging

Each Agent lives inside an independent plugin.

Structure

```text
teacher-agent/

plugin.yaml

README.md

skills/

templates/

schemas/

tests/

src/
```

---

# Testing

Every Agent must provide:

Unit tests

Contract tests

Schema validation

Golden output examples

---

# Compatibility

Every Agent declares compatibility.

Example

```yaml
requires:

runtime:

>=1.0

artifacts:

lesson-plan: 1.x
```

---

# Design Rules

An Agent MUST NOT:

Modify Artifacts

Call another Agent

Read unrelated files

Depend on implementation details

Contain business logic outside its responsibility

---

# Discovery

The Runtime discovers Agents automatically.

Registration is metadata-based.

No source-code modification is required.

---

# Future Extensions

Agents may later support:

Streaming generation

Parallel execution

Multi-model execution

Distributed execution

Cloud execution

The Agent Contract remains unchanged.

---

# Summary

Agents are isolated educational workers.

They receive Artifacts.

Execute Skills.

Expose Capabilities.

Generate Artifacts.

Nothing more.

This isolation guarantees scalability, portability and long-term maintainability.
