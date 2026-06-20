# docs/14-testing.md

# Testing Strategy

Version: 1.0

Status: Draft

---

# 1. Purpose

This document defines the testing strategy for CourseSmith.

Testing is critical for a framework built on non-deterministic components (LLMs). Every plugin, pipeline, and artifact must be independently testable to guarantee reliability, determinism, and backward compatibility.

---

# 2. Testing Principles

- **Every component must be independently testable**
- **Tests must be deterministic** — same input, same result
- **Golden outputs define expected behavior**
- **Contract tests verify compatibility**
- **LLM-dependent tests use recorded fixtures, not live models**
- **Test speed matters** — prefer unit tests over integration tests

---

# 3. Test Pyramid

```text
                ┌───────┐
              ┌─┤ E2E   ├─┐       Few: end-to-end pipeline tests
              │ └───────┘ │
            ┌─┤           ├─┐
            │ │ ┌───────┐ │ │     Some: integration tests
            │ │ │       │ │ │
          ┌─┤ └─┤ Int  ├─┘ ├─┐
          │ │   └───────┘   │ │
        ┌─┤ │               │ ├─┐
        │ │ │ ┌───────────┐ │ │ │  Many: contract tests
        │ └─└─┤ Contract  ├─┘─┘ │
      ┌─┤     └───────────┘     ├─┐
      │ │ ┌───────────────────┐ │ │  Most: unit tests
      │ └─┤      Unit         ├─┘ │
      │   └───────────────────┘   │
      └───────────────────────────┘
```

## Layer breakdown

| Layer | Count | Dependencies | Speed |
|-------|-------|--------------|-------|
| Unit | Many | None | ms |
| Contract | Many | Schemas | ms |
| Integration | Some | Plugins | s |
| E2E | Few | Full pipeline | min |

---

# 4. Unit Tests

## What to test

- Plugin manifest parsing
- Configuration validation
- Artifact schema validation
- Capability resolution logic
- Pipeline step resolution
- Naming convention enforcement
- Error classification

## Example

```typescript
// Runtime: capability resolution
describe("CapabilityResolver", () => {
  it("resolves exact capability match", () => {
    const registry = new CapabilityRegistry();
    registry.register(teacherPlugin);
    const resolved = registry.resolve("generate-lesson");
    expect(resolved).toBe(teacherPlugin);
  });

  it("throws on unresolved capability", () => {
    const registry = new CapabilityRegistry();
    expect(() => registry.resolve("unknown"))
      .toThrow("Capability 'unknown' not found");
  });

  it("prefers explicit plugin selection", () => {
    const registry = new CapabilityRegistry();
    registry.register(teacherPlugin);
    registry.register(professorPlugin);
    const resolved = registry.resolve("generate-lesson", {
      plugin: "@coursesmith/professor",
    });
    expect(resolved).toBe(professorPlugin);
  });
});
```

---

# 5. Contract Tests

## What they verify

- Plugins declare correct input/output artifact types
- Artifact schemas match plugin declarations
- Plugin versions are compatible with runtime
- Capability contracts are fulfilled

## Example

```yaml
# tests/contracts/teacher-contract.yaml
plugin: @coursesmith/teacher
version: 1.0.0
contracts:
  - capability: generate-lesson
    input:
      - type: lesson-plan
        version: "1.x"
    output:
      - type: lesson
        version: "1.0"
    tests:
      - name: valid lesson-plan produces valid lesson
        input: fixtures/lesson-plan-valid.json
        expect:
          outputType: lesson
          validSchema: true
      - name: missing input field
        input: fixtures/lesson-plan-incomplete.json
        expect:
          error: "validation"
```

---

# 6. Golden Output Tests

Golden output tests verify that plugins produce expected outputs from known inputs.

## Structure

```yaml
# tests/golden/teacher-golden.yaml
cases:
  - name: networking-lesson
    input: fixtures/golden-inputs/networking-lesson-plan.json
    golden: fixtures/golden-outputs/networking-lesson.md
    tolerance: 0.8                 # Similarity threshold
    ignore:
      - "content.examples[*].code" # Code may vary
      - "metadata.generatedAt"
    assertions:
      - "content.topics.length >= 2"
      - "content.topics[0].explanation.length > 100"
      - "content.summary.length < 500"
```

## Execution

```bash
coursesmith test golden --plugin @coursesmith/teacher
```

Output:

```text
✓ networking-lesson        (similarity: 0.92)
✓ containers-lesson        (similarity: 0.88)
✓ security-lesson          (similarity: 0.95)
Result: 3/3 passed
```

## Similarity checking

Golden tests use structural similarity rather than exact string matching:

- Same section structure and ordering
- Same number of examples
- Same key terms present
- Same metadata fields populated
- Content length within expected bounds

---

# 7. Schema Validation Tests

## Artifact schema tests

```yaml
# tests/schemas/lesson.test.yaml
cases:
  - name: valid lesson passes
    artifact: fixtures/artifacts/lesson-valid.yaml
    schema: schemas/lesson.json
    expect: valid

  - name: missing objectives fails
    artifact: fixtures/artifacts/lesson-no-objectives.yaml
    schema: schemas/lesson.json
    expect: invalid
    expectedError: "requires property 'objectives'"

  - name: wrong id format fails
    artifact: fixtures/artifacts/lesson-bad-id.yaml
    schema: schemas/lesson.json
    expect: invalid
    expectedError: "pattern mismatch"
```

## Configuration schema tests

```yaml
# tests/schemas/coursesmith-config.test.yaml
cases:
  - name: minimum valid config
    config: fixtures/configs/minimal.yaml
    expect: valid

  - name: full config
    config: fixtures/configs/full.yaml
    expect: valid

  - name: missing project name
    config: fixtures/configs/missing-name.yaml
    expect: invalid
```

---

# 8. Integration Tests

## Plugin integration

Test plugin execution with real (but isolated) infrastructure:

```bash
coursesmith test integration --plugin @coursesmith/teacher
```

Each integration test:

1. Sets up a temporary project with `coursesmith.yaml`
2. Provides input fixtures
3. Runs the relevant pipeline step
4. Validates output artifacts
5. Cleans up temporary files

```yaml
# tests/integration/teacher-pipeline.yaml
name: teacher-integration
steps:
  - capability: generate-lesson
    input: fixtures/lesson-plan.json
    config:
      tone: professional
      examples: 2
assert:
  - artifactType: lesson
  - fieldExists: content.topics
  - fieldExists: content.summary
  - minLength: content.topics 2
```

## Runtime integration

Test the Runtime's ability to load plugins, resolve capabilities, and execute steps:

```bash
coursesmith test runtime
```

---

# 9. End-to-End Tests

## Full pipeline test

```bash
coursesmith test e2e --pipeline standard-course --input fixtures/syllabus.md
```

E2E tests:

1. Initialize a project
2. Configure a full pipeline
3. Execute against known input
4. Verify complete output structure
5. Check determinism (re-run and compare)

```yaml
# tests/e2e/standard-course.yaml
pipeline: standard-course
input: fixtures/sample-syllabus.md
assert:
  - courseDirectory: output/
  - fileExists: course.yaml
  - fileExists: manifest.json
  - fileExists: modules/networking/module.yaml
  - fileExists: modules/networking/lessons/*.md
  - fileExists: modules/networking/quizzes/*.json
  - directoryCount: 3 modules
  - artifactCount: ">= 10"
  - determinism: true
```

---

# 10. Test Fixtures

## Fixture directory structure

```text
tests/
├── fixtures/
│   ├── artifacts/
│   │   ├── lesson-valid.yaml
│   │   ├── lesson-incomplete.yaml
│   │   ├── quiz-valid.json
│   │   └── course-valid.yaml
│   ├── configs/
│   │   ├── minimal.yaml
│   │   ├── full.yaml
│   │   └── invalid.yaml
│   ├── golden-inputs/
│   │   └── networking-lesson-plan.json
│   ├── golden-outputs/
│   │   └── networking-lesson.md
│   └── pipelines/
│       └── sample-syllabus.md
├── unit/
├── contract/
├── integration/
├── golden/
├── schemas/
└── e2e/
```

---

# 11. Test Commands

```bash
# Run all tests
coursesmith test

# Run specific test levels
coursesmith test unit
coursesmith test contract
coursesmith test integration
coursesmith test golden
coursesmith test e2e

# Run tests for a specific plugin
coursesmith test --plugin @coursesmith/teacher

# Run with coverage
coursesmith test --coverage

# Run in watch mode
coursesmith test --watch

# Dry-run (validate test config without executing)
coursesmith test --dry-run

# Determinism check (run twice, compare outputs)
coursesmith test --determinism
```

---

# 12. CI Integration

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: coursesmith test unit
      - run: coursesmith test contract
      - run: coursesmith test schema
      - run: coursesmith test integration
      - run: coursesmith test e2e
        env:
          LLM_API_KEY: ${{ secrets.LLM_API_KEY }}
```

---

# 13. Determinism Testing

Because LLM outputs are non-deterministic by nature, CourseSmith tests determinism at the structural level:

```bash
coursesmith test --determinism --iterations 3
```

Checks:

- Same number and type of artifacts produced
- Same artifact structure and field types
- Same file paths and naming
- Same metadata field existence
- Content length within tolerance

---

# 14. Performance Testing

```bash
coursesmith test performance --pipeline standard-course
```

Metrics:

- Total execution time
- Per-step execution time
- Token consumption
- Artifact size
- Memory usage

```yaml
# tests/performance/benchmark.yaml
pipeline: standard-course
input: fixtures/large-syllabus.md
thresholds:
  totalDuration: 600s
  perStep:
    teacher: 120s
    quiz-generator: 60s
  tokenUsage: 50000
  memoryUsage: 512MB
```

---

# 15. Future Extensions

- **Regression test suite** — automated regression on every plugin update
- **Visual regression** — compare generated Markdown rendering
- **LLM mock framework** — deterministic LLM responses for unit tests
- **Fuzz testing** — randomize input to find edge cases
- **Property-based testing** — verify invariants across random inputs
- **Load testing** — simulate multiple concurrent pipeline executions

---

# 16. Cross References

- `docs/06-agents.md` — agent test requirements
- `docs/09-artifacts.md` — artifact validation and fixture format
- `docs/10-plugin-api.md` — plugin test requirements
- `docs/07-skills.md` — skill test specifications
- `docs/11-runtime.md` — Runtime test commands
