# docs/09-artifacts.md

# Artifact Specification

Version: 1.0

Status: Draft

---

# 1. Purpose

Artifacts are the universal communication mechanism in CourseSmith.

Every piece of information generated, consumed, or transformed by the framework is represented as an Artifact. Agents never exchange natural language — they exchange Artifacts.

This document defines the Artifact model, serialization format, naming conventions, metadata schema, versioning rules, and validation requirements.

---

# 2. Motivation

Without a standardized Artifact model:

- Agents would need to understand each other's output formats
- Plugins would be coupled to specific Agent implementations
- Pipelines could not guarantee compatibility between steps
- Outputs would not be reusable across projects

Artifacts solve these problems by providing:

- **Interoperability** — any Agent can consume any Artifact if the schema matches
- **Immutability** — Artifacts are never modified, only replaced
- **Versioning** — schema evolution without breaking existing consumers
- **Validation** — every Artifact is validated before publication
- **Traceability** — each Artifact records its origin and lineage

---

# 3. Artifact Model

## Core structure

Every Artifact shares this base structure:

```yaml
# Base artifact fields (all artifacts)
id: lesson-networking-001                     # Unique identifier
type: lesson                                   # Artifact type
version: 1.0.0                                 # Schema version
title: Introduction to Networking              # Human-readable title
createdBy: teacher                             # Agent or plugin that created it
createdAt: 2026-01-15T10:30:00Z                # ISO 8601 timestamp
schemaVersion: 1.0                             # Schema version for validation
metadata:                                      # Optional metadata block
  courseId: cloud-arch-101
  moduleId: module-networking
  difficulty: intermediate
  estimatedTime: 45min
  language: en
  tags:
    - networking
    - TCP/IP
    - OSI
dependsOn:                                     # Optional dependency chain
  - lesson-plan-networking-001
```

---

# 4. Artifact Types

## Course

```yaml
id: course-cloud-arch-101
type: course
version: 1.0.0
title: Cloud Architecture Fundamentals
metadata:
  author: CourseSmith
  difficulty: intermediate
  estimatedHours: 40
modules:
  - module-networking-001
  - module-containers-001
  - module-orchestration-001
objectives:
  - Design cloud-native applications
  - Implement container-based deployments
  - Configure orchestration platforms
manifest: manifest-cloud-arch-101.json
```

## Module

```yaml
id: module-networking-001
type: module
version: 1.0.0
title: Cloud Networking
objectives:
  - Understand VPC design patterns
  - Configure subnets and routing
lessons:
  - lesson-networking-001
  - lesson-networking-002
  - lesson-networking-003
summary: "This module covers cloud networking fundamentals..."
projects:
  - project-vpc-design-001
```

## Lesson

```yaml
id: lesson-networking-001
type: lesson
version: 1.0.0
title: Introduction to Virtual Private Clouds
moduleId: module-networking-001
objectives:
  - Explain what a VPC is
  - Create a VPC with public and private subnets
  - Configure route tables and internet gateways
content:
  introduction: "In this lesson, you will learn..."
  topics:
    - id: topic-vpc-overview
      title: What is a VPC?
      explanation: "..."
      examples:
        - title: Creating a VPC
          code: |
            resource "aws_vpc" "main" {
              cidr_block = "10.0.0.0/16"
            }
    - id: topic-subnets
      title: Public and Private Subnets
      explanation: "..."
  summary: "Key takeaways from this lesson..."
  references:
    - title: AWS VPC Documentation
      url: https://docs.aws.amazon.com/vpc/
```

## Lesson Plan

```yaml
id: lesson-plan-networking-001
type: lesson-plan
version: 1.0.0
title: VPC Fundamentals
moduleId: module-networking-001
topics:
  - VPC definition and purpose
  - Subnets (public vs private)
  - Route tables and gateways
  - Security groups vs NACLs
objectives:
  - Explain VPC architecture
  - Configure basic networking components
estimatedMinutes: 45
difficulty: beginner
prerequisites:
  - Basic cloud computing concepts
```

## Quiz

```yaml
id: quiz-networking-001
type: quiz
version: 1.0.0
title: Networking Fundamentals Quiz
lessonId: lesson-networking-001
questions:
  - id: q1
    type: multiple-choice
    question: What is the purpose of a route table in a VPC?
    options:
      - A: Define IP address ranges
      - B: Control traffic between subnets
      - C: Filter traffic at the instance level
      - D: Encrypt data in transit
    answer: B
    explanation: Route tables determine where network traffic is directed.
    difficulty: easy
  - id: q2
    type: true-false
    question: A security group operates at the subnet level.
    answer: false
    explanation: Security groups operate at the instance level, not subnet level.
    difficulty: medium
passThreshold: 0.7
```

## Exercise

```yaml
id: exercise-networking-001
type: exercise
version: 1.0.0
title: Configure a VPC
lessonId: lesson-networking-001
difficulty: medium
type: practical
instructions: |
  Using the AWS Console or Terraform, create a VPC with:
  - CIDR block 10.0.0.0/16
  - One public subnet (10.0.1.0/24)
  - One private subnet (10.0.2.0/24)
  - An internet gateway attached to the public subnet
hints:
  - Start by creating the VPC resource
  - Subnets must reference the VPC ID
expectedOutcome: A VPC with two subnets and working internet access
```

## Lab

```yaml
id: lab-networking-001
type: lab
version: 1.0.0
title: Build a Three-Tier Network Architecture
lessonId: lesson-networking-001
objectives:
  - Design a multi-tier network
  - Implement security boundaries
prerequisites:
  - Completed lesson on VPC fundamentals
  - AWS account with administrative access
steps:
  - order: 1
    title: Create the VPC
    description: Create a VPC with CIDR 10.0.0.0/16
    command:
  - order: 2
    title: Create subnets
    description: Create public, private, and database subnets
    command:
expectedResult: |
  A fully functional three-tier network with:
  - Public subnet with internet access
  - Private subnet with NAT gateway
  - Database subnet with restricted access
cleanup: |
  terraform destroy -auto-approve
validation:
  - All subnets route correctly
  - Internet gateway is attached
  - NAT gateway is configured
```

## Project

```yaml
id: project-vpc-design-001
type: project
version: 1.0.0
title: Design a Multi-Region Network
moduleId: module-networking-001
scope: module
objectives:
  - Design a multi-region VPC architecture
  - Implement cross-region connectivity
  - Apply security best practices
deliverables:
  - Architecture diagram
  - Terraform configuration
  - Network access matrix
criteria:
  - All subnets are properly isolated
  - Cross-region traffic uses transit gateway
  - Security groups follow least privilege
```

## Flashcards

```yaml
id: flashcards-networking-001
type: flashcards
version: 1.0.0
title: Networking Flashcards
lessonId: lesson-networking-001
cards:
  - id: fc-001
    front: What is a VPC?
    back: Virtual Private Cloud — a logically isolated network in the cloud
    difficulty: easy
    tags: [vpc, basics]
  - id: fc-002
    front: Difference between security group and NACL
    back: Security group is instance-level (stateful), NACL is subnet-level (stateless)
    difficulty: medium
    tags: [security, networking]
```

## Summary

```yaml
id: summary-networking-001
type: summary
version: 1.0.0
title: VPC Fundamentals Summary
lessonId: lesson-networking-001
maxLength: 500
content: |
  A Virtual Private Cloud (VPC) is a logically isolated network in the cloud.
  Key concepts include subnets (public/private), route tables, internet gateways,
  NAT gateways, security groups, and network ACLs. Subnets segment the VPC,
  route tables control traffic flow, and security groups provide instance-level
  firewall protection.
keyTerms:
  - VPC
  - Subnet
  - Route Table
  - Internet Gateway
  - Security Group
```

## Diagram

```yaml
id: diagram-vpc-architecture-001
type: diagram
version: 1.0.0
title: VPC Architecture
lessonId: lesson-networking-001
syntax: mermaid
content: |
  graph TD
    A[Internet] --> B[Internet Gateway]
    B --> C[Public Subnet]
    C --> D[EC2 Instance]
    C --> E[NAT Gateway]
    E --> F[Private Subnet]
    F --> G[EC2 Instance]
```

## Manifest

```yaml
id: manifest-cloud-arch-101
type: manifest
version: 1.0.0
title: Cloud Architecture Course Manifest
courseId: course-cloud-arch-101
pipeline: standard-course
pipelineVersion: 1.0.0
generatedAt: 2026-01-15T10:32:15Z
plugins:
  - name: @coursesmith/teacher
    version: 1.0.0
  - name: @coursesmith/quiz-generator
    version: 1.0.0
artifacts:
  - id: course-cloud-arch-101
    type: course
    path: course.yaml
  - id: module-networking-001
    type: module
    path: modules/networking/module.yaml
  - id: lesson-networking-001
    type: lesson
    path: modules/networking/lessons/vpc-fundamentals.md
checksum: a1b2c3d4e5f6...
totalArtifacts: 47
```

---

# 5. Naming Conventions

## Identifiers

```text
{type}-{module|lesson|topic}-{sequence}

Examples:
lesson-networking-001
quiz-networking-001
lab-networking-001
module-cloud-computing-001
course-cloud-arch-101
```

Rules:

- Lowercase with hyphens
- Type prefix for easy identification
- Sequential numbering within context
- Stable identifiers (never reuse deleted IDs)
- Maximum 64 characters

## File paths

```text
output/
├── course.yaml
├── manifest.json
├── modules/
│   ├── networking/
│   │   ├── module.yaml
│   │   ├── lessons/
│   │   │   ├── vpc-fundamentals.md
│   │   │   ├── subnet-design.md
│   │   │   └── security-networking.md
│   │   ├── quizzes/
│   │   │   └── quiz-networking.json
│   │   ├── exercises/
│   │   │   └── exercise-networking.json
│   │   ├── labs/
│   │   │   └── lab-three-tier-network.md
│   │   └── flashcards/
│   │       └── flashcards-networking.json
│   └── containers/
│       ├── module.yaml
│       └── lessons/
└── assets/
    └── diagrams/
        └── vpc-architecture.mmd
```

---

# 6. Serialization Formats

| Artifact type | Format | Extension |
|--------------|--------|-----------|
| Course | YAML | `.yaml` |
| Module | YAML | `.yaml` |
| Lesson | Markdown + YAML frontmatter | `.md` |
| Lesson Plan | JSON | `.json` |
| Quiz | JSON | `.json` |
| Exercise | JSON | `.json` |
| Lab | Markdown + YAML frontmatter | `.md` |
| Project | YAML | `.yaml` |
| Flashcards | JSON | `.json` |
| Summary | Markdown | `.md` |
| Diagram | Mermaid | `.mmd` |
| Manifest | JSON | `.json` |
| References | JSON | `.json` |

---

# 7. Versioning

## Artifact version

Every Artifact carries its own semantic version:

```yaml
version: 1.0.0
```

Version changes:

- **MAJOR** — breaking changes to the Artifact structure
- **MINOR** — new optional fields added
- **PATCH** — corrections that don't change the schema

## Schema version

The `schemaVersion` field tracks the Artifact type's schema version:

```yaml
schemaVersion: 1.0
```

Schema versions are independent of individual Artifact versions.

## Compatibility rules

- Consumers declare which version ranges they accept
- Producers declare which version they produce
- The Runtime validates compatibility at pipeline startup

```yaml
# Agent contract
artifacts:
  input:
    lesson-plan: "1.x"    # Accepts any 1.x lesson-plan
  output:
    lesson: "1.0"         # Produces lesson schema 1.0
```

---

# 8. Validation

## Schema validation

Every Artifact type defines a JSON Schema:

```yaml
# schemas/lesson.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "type", "version", "title", "createdBy", "createdAt"],
  "properties": {
    "id": { "type": "string", "pattern": "^lesson-[a-z0-9-]+$" },
    "type": { "const": "lesson" },
    "version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
    "title": { "type": "string", "minLength": 1 },
    "moduleId": { "type": "string" },
    "objectives": { "type": "array", "minItems": 1 },
    "content": { "type": "object" }
  }
}
```

## Validation rules

1. All required fields must be present
2. Field types must match schema
3. Identifier must follow naming convention
4. References must point to existing Artifacts
5. Metadata values must be within allowed ranges

## Validation phases

| Phase | Scope | Action on failure |
|-------|-------|-------------------|
| Pre-execution | Input artifacts | Stop pipeline |
| Post-execution | Produced artifacts | Agent retries |
| Publishing | Final artifacts | Stop pipeline |

---

# 9. Artifact Lifecycle

```text
┌──────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐     ┌──────────┐
│ Created   │ ──▶ │ Validated │ ──▶ │ Published │ ──▶ │ Consumed  │ ──▶ │ Archived │
└──────────┘     └───────────┘     └───────────┘     └───────────┘     └──────────┘
                                                                              │
                                                                              ▼
                                                                       (read-only)
```

| Phase | Description |
|-------|-------------|
| **Created** | Agent produces the Artifact |
| **Validated** | Schema and business rules are checked |
| **Published** | Artifact is written to the Artifact Bus |
| **Consumed** | Downstream Agent reads the Artifact |
| **Archived** | Pipeline completes, Artifact is stored in output |

## Immutability rule

No Artifact may be modified in place.

Changes produce a new Artifact with a new version:

```yaml
# Original
id: lesson-networking-001
version: 1.0.0

# After correction
id: lesson-networking-001
version: 1.0.1
```

---

# 10. Artifact Relationships

```text
Course (1)
  │
  ├── Module (N)
  │     │
  │     ├── Lesson Plan (1) ─── Lesson (1) ─── Summary (1)
  │     │                           │
  │     │                           ├── Quiz (1)
  │     │                           ├── Exercise (N)
  │     │                           ├── Lab (1)
  │     │                           ├── Flashcards (1)
  │     │                           └── Diagram (N)
  │     │
  │     └── Project (N)
  │
  └── Manifest (1)
```

---

# 11. Artifact Bus

The Artifact Bus is the runtime communication channel:

```text
┌────────────────────────────────────────┐
│            Artifact Bus                │
│                                        │
│  ┌──────────┐    ┌──────────┐         │
│  │ Producer │ ──▶ │   Store  │ ──▶ │ Consumer │
│  │  Agent   │     │ (memory) │     │  Agent   │
│  └──────────┘    └──────────┘     └──────────┘
└────────────────────────────────────────┘
```

Properties:

- **Ordered** — artifacts are available in production order
- **Addressed** — artifacts are retrieved by type + ID
- **Immutable** — stored artifacts never change
- **Transient** — artifacts exist only during pipeline execution
- **Traceable** — every read/write is logged

---

# 12. Storage

## In-memory (during execution)

Artifacts are held in the Artifact Bus memory store during pipeline execution.

## File system (after execution)

Artifacts are written to the output directory following the naming conventions in §5.

## Caching (optional)

Frequently-used or intermediate artifacts may be cached to speed up partial re-execution:

```yaml
# coursesmith.yaml
cache:
  enabled: true
  directory: .coursesmith/cache
  ttl: 3600
```

---

# 13. Testing Artifacts

## Artifact fixture

```yaml
# tests/fixtures/artifacts/lesson-valid.yaml
id: lesson-test-001
type: lesson
version: 1.0.0
title: Test Lesson
createdBy: test
createdAt: "2026-01-01T00:00:00Z"
schemaVersion: 1.0
moduleId: module-test-001
objectives:
  - Test objective
content:
  topics:
    - id: topic-1
      title: Test Topic
      explanation: Test content
```

## Validation tests

```yaml
# tests/schemas/lesson.test.yaml
test-cases:
  - name: valid-lesson
    fixture: fixtures/artifacts/lesson-valid.yaml
    expect: valid
  - name: missing-required-field
    fixture: fixtures/artifacts/lesson-missing-id.yaml
    expect: invalid
    expectedError: "'id' is a required property"
```

---

# 14. Future Extensions

- **Streaming artifacts** — agents producing partial artifacts during long generation
- **Artifact compression** — optional compression for large courses
- **Artifact signing** — cryptographic signatures for integrity verification
- **Artifact diffing** — compare two versions of an artifact
- **Artifact migration** — auto-migration between schema versions
- **Artifact references across pipelines** — reuse artifacts from previous runs

---

# 15. Cross References

- `docs/05-domain-model.md` — conceptual entity definitions underlying artifacts
- `docs/06-agents.md` — agents produce and consume artifacts
- `docs/08-pipelines.md` — artifact flow through pipeline steps
- `docs/10-plugin-api.md` — artifact contracts in plugin manifests
- `docs/14-testing.md` — artifact validation and testing strategy
