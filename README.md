# CourseSmith

**AI-native framework for curriculum engineering.**

Transform syllabi, documentation, and source material into complete, structured courses through deterministic multi-agent orchestration with web enrichment.

```bash
npx @coursesmith/cli init meu-curso
cd meu-curso
# Edite content/syllabus.md
npx @coursesmith/cli run
```

## How it works

```
Você fornece (syllabus, PDF, ou só um tópico)
       │
       ▼
┌──────────────────────────────────────────────┐
│         Web Research Agent                    │
│  Busca na web, scaneia docs, enriquece       │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│   Pipeline Engine orquestra 5 agentes:       │
│                                              │
│   Teacher     → Escreve aulas completas      │
│   Quiz Gen    → Cria quizzes com 5 questões  │
│   Flashcards  → Cria flashcards              │
│   Publisher   → Gera saída em Markdown       │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
         Curso completo em ./output/
```

## Funcionalidades

- **Web Research Agent** — busca ativa na internet para enriquecer conteúdo
- **Plugins** — cada agente é um plugin independente e substituível
- **Pipelines declarativos** — fluxos em YAML, sem código
- **Artefatos imutáveis** — toda saída é versionada, validada e legível
- **Runtime agnóstico** — funciona com OpenAI, Claude, OpenCode, CLI
- **Git-native** — markdown, YAML, JSON — nada de formatos proprietários

## Comandos

| Comando | Descrição |
|---------|-----------|
| `coursesmith init` | Cria projeto com estrutura padrão |
| `coursesmith run` | Executa o pipeline configurado |
| `coursesmith run --dry-run` | Valida configuração sem executar |
| `coursesmith run --pipeline quick-course` | Executa pipeline específico |

## Exemplo: Docker Deep Dive

```bash
npx @coursesmith/cli init docker-curso
```

Edite `content/syllabus.md` com os tópicos do seu curso:

```markdown
# Docker Deep Dive
- Docker fundamentals
- Images and Dockerfile
- Docker Compose
- Docker in production
```

Execute:

```bash
npx @coursesmith/cli run
```

Resultado em `./output/`:

```
output/
├── course.yaml
├── manifest.json
├── module-1-docker-fundamentals/
│   ├── module.yaml
│   └── lessons/
│       ├── o-que-e-docker.md
│       ├── imagens-e-camadas.md
│       └── ...
├── quizzes/
└── flashcards/
```

## Estrutura do projeto

```
meu-curso/
├── coursesmith.yaml      # Configuração do projeto
├── content/
│   └── syllabus.md       # Material fonte (PDF, MD, TXT)
├── pipelines/            # Pipelines personalizados
├── agents/               # Agentes personalizados
├── skills/               # Skills reutilizáveis
└── .coursesmith/         # Cache e plugins instalados
```

## Arquitetura

CourseSmith é um runtime mínimo que **nunca contém lógica educacional**. Todo conhecimento pedagógico vive em plugins:

- **Runtime** — carrega config, descobre plugins, resolve capacidades, executa pipelines
- **Agentes** — plugins que geram artefatos (Teacher, Quiz Generator, Web Research)
- **Skills** — unidades de prompt reutilizáveis que os agentes orquestram
- **Capabilities** — abstração que desacopla pipelines de implementações concretas
- **Artefatos** — única forma de comunicação entre agentes (imutáveis, versionados)

## Documentação

Toda a especificação está em `docs/`, numerada de 01 a 20:

| Doc | Conteúdo |
|-----|----------|
| `01-vision.md` | Visão do produto |
| `04-architecture.md` | Arquitetura do sistema |
| `05-domain-model.md` | Modelo de domínio e artefatos |
| `06-agents.md` | Contratos e ciclo de vida dos agentes |
| `07-skills.md` | Especificação de skills |
| `08-pipelines.md` | Pipelines declarativos |
| `10-plugin-api.md` | API de plugins |
| `15-security.md` | Modelo de segurança |

## Licença

Apache License 2.0
