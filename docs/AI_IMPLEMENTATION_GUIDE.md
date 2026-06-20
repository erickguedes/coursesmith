# docs/AI_IMPLEMENTATION_GUIDE.md

# CourseSmith AI Implementation Constitution

Version: 1.0

Status: Living Document

---

# Purpose

This document defines how any AI agent must think, reason and implement CourseSmith.

It is not a Product Requirements Document.

It is not an Architecture Document.

It is the implementation constitution of the project.

Whenever ambiguity exists, this document takes precedence.

---

# Primary Mission

Build the most extensible open-source framework for AI-powered curriculum engineering.

The framework must transform structured educational knowledge into complete learning experiences through deterministic multi-agent orchestration.

Every implementation decision must maximize:

* Simplicity
* Extensibility
* Reusability
* Predictability
* Maintainability

Never optimize for shortcuts.

Always optimize for long-term evolution.

---

# Architectural Philosophy

CourseSmith is NOT:

* a collection of prompts
* a chatbot
* a course generator
* a prompt library

CourseSmith IS:

* a runtime
* a plugin ecosystem
* an artifact pipeline
* an educational operating system

Every implementation must reinforce this philosophy.

---

# Core Principles

The following principles are immutable.

## Runtime Agnostic

The runtime must never depend on OpenCode.

Adapters should allow future support for:

* Claude Code
* Codex CLI
* Cursor
* VS Code
* Local AI runtimes

Changing runtime must never require changes to plugins.

---

## Artifact First

Artifacts are the universal language.

Agents never exchange free text.

Agents never invoke each other.

Agents only consume and produce Artifacts.

If a feature bypasses Artifacts, the design is incorrect.

---

## Plugin First

Educational logic must never exist inside the Runtime.

Everything educational belongs to plugins.

Examples:

Agents

Skills

Templates

Publishers

Pipelines

Validators

Parsers

---

## Declarative First

Behavior should be described through configuration.

Never hardcode educational workflows.

Pipelines must be defined using YAML.

---

## Git Native

Everything must be stored as plain text.

Preferred formats:

Markdown

JSON

YAML

No proprietary formats.

---

## AI Native

Every project artifact should be understandable by humans and AI.

Documentation is part of the product.

---

# Design Priorities

Whenever multiple implementations are possible, prioritize:

1.

Less coupling

2.

Higher extensibility

3.

Smaller Runtime

4.

More reusable plugins

5.

Clear contracts

6.

Declarative configuration

Performance is secondary to architecture.

---

# Runtime Responsibilities

The Runtime only:

Load configuration

Discover plugins

Resolve capabilities

Execute pipelines

Validate artifacts

Publish outputs

Nothing more.

The Runtime must never understand educational concepts.

---

# Plugin Responsibilities

Plugins contain domain knowledge.

A plugin should be replaceable without changing the Runtime.

Plugins communicate exclusively through Artifacts.

---

# Skills

Skills are reusable reasoning units.

Agents orchestrate Skills.

Skills encapsulate prompting strategy.

A Skill must never depend on a specific Agent.

---

# Capabilities

Agents expose Capabilities.

Examples:

generate-lesson

generate-quiz

generate-summary

create-project

create-diagram

Pipelines request Capabilities.

Never concrete implementations.

---

# Artifacts

Artifacts are immutable.

Artifacts are versioned.

Artifacts are validated.

Artifacts are never edited in place.

Every transformation generates a new Artifact.

---

# Pipelines

Pipelines describe orchestration.

Pipelines are configuration.

Pipelines are never code.

Execution order should remain visible.

---

# Documentation Standards

Every public component requires documentation.

Documentation must explain:

Purpose

Inputs

Outputs

Dependencies

Examples

Configuration

Failure modes

Future extensions

No undocumented behavior.

---

# Code Standards

Prefer composition over inheritance.

Prefer interfaces over concrete classes.

Prefer contracts over conventions.

Prefer schemas over assumptions.

Prefer plugins over modifications.

Prefer configuration over branching logic.

---

# Testing Philosophy

Every component must be independently testable.

Required tests:

Unit

Contract

Schema validation

Golden outputs

Integration

---

# Extensibility Rules

Before adding a new feature, ask:

Can this be implemented as a plugin?

Can this be implemented as a Skill?

Can this be implemented as a Capability?

Can this be implemented without changing the Runtime?

If yes, do not modify the Core.

---

# AI Collaboration Rules

Future AI agents working on this repository must:

Read all documentation before writing code.

Avoid architectural changes unless explicitly requested.

Respect existing contracts.

Never duplicate concepts.

Never introduce competing abstractions.

Extend instead of replacing.

---

# Documentation Roadmap

The implementation must eventually produce the following documentation.

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

11-runtime.md

12-capabilities.md

13-configuration.md

14-testing.md

15-security.md

16-governance.md

17-style-guide.md

18-roadmap.md

19-faq.md

20-contributing.md

Every document should be implementation-ready.

---

# Repository Roadmap

The final repository should resemble:

coursesmith/

docs/

packages/

runtime/

cli/

plugin-sdk/

core/

plugins/

official/

parser/

teacher/

quiz/

publisher/

community/

templates/

examples/

schemas/

tests/

.github/

README.md

LICENSE

CONTRIBUTING.md

CODE_OF_CONDUCT.md

---

# Final Objective

When this repository reaches Version 1.0, an AI should be capable of cloning it, reading the documentation and implementing the framework without requiring additional architectural decisions from the project creators.

If future contributors must guess how CourseSmith works, the documentation is incomplete.

The documentation is considered part of the source code.

It must evolve with the same rigor as the implementation.

End of Constitution.
