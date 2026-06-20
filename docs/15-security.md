# docs/15-security.md

# Security Specification

Version: 1.0

Status: Draft

---

# 1. Purpose

This document defines the security model for CourseSmith.

As a framework that executes AI agents, handles user content, and integrates with external systems, CourseSmith must provide clear security boundaries, safe plugin execution, and protect against common attack vectors.

---

# 2. Security Principles

- **Least privilege** — plugins run with minimal necessary access
- **User control** — users explicitly approve sensitive operations
- **Input validation** — all external inputs are validated before processing
- **Default deny** — capabilities are opt-in, not opt-out
- **No secrets in output** — generated artifacts never contain credentials
- **Auditability** — every operation is logged

---

# 3. Threat Model

## Assets

| Asset | Description | Sensitivity |
|-------|-------------|-------------|
| LLM API keys | Credentials for AI model access | Critical |
| Source materials | Original educational content | Variable |
| Generated courses | Framework output | Low |
| Plugin files | Third-party code | Medium |
| Configuration | Project settings, plugin prefs | Medium |
| Cache | Intermediate artifacts | Low |

## Attack vectors

| Vector | Description | Severity |
|--------|-------------|----------|
| Malicious plugin | Plugin with harmful code | Critical |
| Prompt injection | LLM prompt manipulation | High |
| Path traversal | Reading/writing outside project | High |
| Credential theft | API key extraction | Critical |
| Supply chain | Compromised plugin dependency | High |
| Denial of service | Resource exhaustion | Medium |

---

# 4. Plugin Security

## Plugin verification

```yaml
# coursesmith.yaml
security:
  verify_plugins: true
  allowed_sources:
    - registry.coursesmith.dev
    - github.com/coursesmith
  deny_list:
    - untrusted-plugin
```

## Capability scoping

Plugins declare required permissions:

```yaml
# plugin.yaml
security:
  permissions:
    - filesystem: read      # Read course files
    - network: none         # No network access
    - env: none             # No environment variable access
    - exec: none            # No subprocess execution
```

Runtime enforces permissions:

| Permission | Scope | Default |
|-----------|-------|---------|
| `filesystem: read` | Read project files | Deny |
| `filesystem: write` | Write to output dir | Deny |
| `network` | Make HTTP requests | Deny |
| `env` | Read environment vars | Deny |
| `exec` | Execute subprocesses | Deny |

## Plugin sandboxing

Future versions may execute plugins in isolated environments:

- **Docker containers** — each plugin runs in a container
- **WebAssembly** — WASM-based sandbox for lightweight execution
- **Subprocess** — separate OS process with limited permissions

---

# 5. API Key Management

## Environment variables

```bash
# .env (never committed)
COURSESMITH_API_KEY=sk-...
```

```yaml
# coursesmith.yaml
runtime:
  apiKey: ${COURSESMITH_API_KEY}   # Referenced, not inlined
```

## .gitignore

```gitignore
# .gitignore
.env
.coursesmith/secrets/
.coursesmith/cache/
output/
```

## Key rotation

```yaml
# coursesmith.yaml
runtime:
  apiKey: ${COURSESMITH_API_KEY}
  apiKeyFile: .coursesmith/secrets/key.txt  # Alternative: file-based
```

---

# 6. Input Validation

## Artifact validation

All artifacts are validated against schemas before processing:

```yaml
Validation:
  - Schema compliance
  - Field type checking
  - Size limits
  - Character encoding
  - No embedded scripts
  - No path traversal (../)
```

## Pipeline validation

Pipeline YAML is validated against schema:

```yaml
Validation:
  - YAML parsing safety
  - No embedded expressions
  - Capability existence check
  - Plugin existence check
  - Cyclic dependency detection
```

---

# 7. Output Security

## No secrets in output

```yaml
# Publisher filter
security:
  output_filter:
    - pattern: "sk-*"           # OpenAI API key pattern
      action: redact
    - pattern: "AKIA*"          # AWS access key pattern
      action: redact
    - pattern: "-----BEGIN.*PRIVATE KEY-----"
      action: block
```

## No sensitive content

Generated courses should never contain:

- API keys or tokens
- Internal system paths
- Credentials or passwords
- Proprietary code without license
- Personal identifiable information (PII)

---

# 8. Prompt Injection Defense

## Input sanitization

User-provided content that enters prompts should be sanitized:

```yaml
prompt_sanitization:
  enabled: true
  rules:
    - strip_html: true
    - strip_control_chars: true
    - max_input_length: 100000
    - block_system_overrides:
        - "ignore previous instructions"
        - "system:"
        - "you are now"
```

## Output validation

LLM outputs should be validated before use:

```yaml
output_validation:
  enabled: true
  rules:
    - no_markdown_injection: true
    - schema_compliance: true
    - length_within_bounds: true
```

---

# 9. File System Security

## Restricted paths

Plugins operate within restricted paths:

```text
Allowed:
  project-root/
    content/          # Read source materials
    output/           # Write generated artifacts
    .coursesmith/     # Read/write cache and config

Denied:
  /etc/
  /usr/
  C:\Windows\
  ~/.ssh/
  ~/.aws/
```

## Path traversal protection

```yaml
security:
  path_traversal:
    blocked_patterns:
      - "../"
      - "..\\"
      - "%2e%2e"
```

---

# 10. Logging and Auditing

## Security events

```yaml
# Logged security events
events:
  - plugin.loaded
  - plugin.permission_denied
  - plugin.error
  - input.validation_failed
  - output.filter_triggered
  - auth.failure
  - path_traversal_blocked
```

## Audit log

```yaml
timestamp: 2026-01-15T10:30:00Z
level: warn
component: security
event: plugin.permission_denied
details:
  plugin: @coursesmith/unknown-plugin
  permission: network
  attempted: GET https://malicious-site.com
```

---

# 11. Pre-Release Security Checklist

Before releasing CourseSmith:

- [ ] Plugin sandboxing reviewed
- [ ] API key handling reviewed
- [ ] Path traversal tests pass
- [ ] Prompt injection mitigation tested
- [ ] Output filter tested with known patterns
- [ ] Dependency audit clean (no known CVEs)
- [ ] Permission enforcement tested
- [ ] Logging covers all security events
- [ ] `.gitignore` prevents secret leakage
- [ ] All build artifacts scanned

---

# 12. Incident Response

In case of security incident:

1. **Identify** — determine affected components and versions
2. **Contain** — disable affected plugins or features
3. **Patch** — release fix with CVE identifier
4. **Verify** — confirm fix resolves the issue
5. **Report** — document and disclose responsibly

---

# 13. Future Extensions

- **Plugin signing** — cryptographic signatures for plugin integrity
- **Vulnerability scanning** — automated scanning of plugin dependencies
- **SBOM generation** — software bill of materials for every release
- **Runtime sandboxing** — full sandboxed execution for plugins
- **Compliance mode** — GDPR, SOC2, and HIPAA-compatible configuration
- **Security audit CLI** — `coursesmith security audit` command

---

# 14. Cross References

- `docs/10-plugin-api.md` — plugin manifest security fields
- `docs/11-runtime.md` — Runtime security enforcement
- `docs/13-configuration.md` — security configuration options
- `docs/14-testing.md` — security test cases
- `docs/16-governance.md` — governance policies related to security
