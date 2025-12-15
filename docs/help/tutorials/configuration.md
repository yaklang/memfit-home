---
sidebar_position: 1
title: Configuration
---

# Configuration Guide

Configure Memfit AI to suit your needs.

## AI Provider Settings

### Supported Providers

| Provider | Models | Features |
|----------|--------|----------|
| OpenAI | GPT-4, GPT-3.5-turbo | Best reasoning |
| Anthropic | Claude 3, Claude 2 | Long context |
| Local | Ollama, LMStudio | Privacy |
| Custom | Any OpenAI-compatible | Flexibility |

### Configuration

```yaml
ai:
  provider: openai
  model: gpt-4
  api_key: sk-xxxxx
  base_url: https://api.openai.com/v1  # Optional
  temperature: 0.7
  max_tokens: 4096
```

### Using Proxy

For network restrictions:

```yaml
ai:
  provider: openai
  model: gpt-4
  proxy: http://127.0.0.1:7890
```

## Execution Settings

### ReAct Loop

```yaml
react:
  max_steps: 20          # Maximum iterations
  spin_threshold: 3       # Steps before spin detection
  reflection_on_error: true
  timeout: 300            # Seconds
```

### Plan Engine

```yaml
plan:
  max_depth: 5            # Maximum task tree depth
  parallel_execution: true
  require_approval: true   # Human review required
```

## Memory Configuration

### Short-term Memory

```yaml
memory:
  short_term:
    max_messages: 50
    include_system: true
```

### Long-term Memory

```yaml
memory:
  long_term:
    enabled: true
    score_threshold: 0.6
    max_entries: 10000
    vector_db: sqlite       # or postgres, qdrant
```

## RAG Configuration

```yaml
rag:
  enabled: true
  top_k: 5
  min_similarity: 0.7
  sources:
    - type: local
      path: /path/to/docs
    - type: web
      url: https://docs.example.com
```

## Tool Configuration

### Enabling Tools

```yaml
tools:
  file_system:
    enabled: true
    allowed_paths:
      - /home/user/projects
      - /tmp
    
  shell:
    enabled: true
    require_confirmation: true
    
  network:
    enabled: true
    allowed_hosts:
      - "*.example.com"
      - "192.168.1.*"
```

### Tool Permissions

```yaml
permissions:
  read: true
  write: true        # Requires confirmation
  execute: true      # Requires confirmation
  network: true
  sensitive: confirm  # always, never, confirm
```

## Forge Configuration

### Loading Forges

```yaml
forges:
  - name: java-audit
    enabled: true
    priority: high
    
  - name: web-security
    enabled: true
    
  - name: custom-forge
    path: /path/to/forge
```

## Yakit Integration

### Engine Connection

```yaml
yakit:
  engine_port: 8087
  auto_start: true
  log_level: info
```

### UI Preferences

```yaml
yakit:
  ui:
    theme: dark
    language: en       # or zh-Hans
    show_traces: true
    auto_scroll: true
```

## Environment Variables

Override configuration with environment variables:

```bash
export MEMFIT_AI_PROVIDER=openai
export MEMFIT_AI_MODEL=gpt-4
export MEMFIT_AI_API_KEY=sk-xxxxx
export MEMFIT_MAX_STEPS=30
```

## Configuration File Location

Default locations:

| Platform | Path |
|----------|------|
| macOS | `~/.config/memfit/config.yaml` |
| Linux | `~/.config/memfit/config.yaml` |
| Windows | `%APPDATA%\memfit\config.yaml` |

## Example Complete Configuration

```yaml
ai:
  provider: openai
  model: gpt-4
  api_key: ${OPENAI_API_KEY}
  temperature: 0.7

react:
  max_steps: 25
  spin_threshold: 3

plan:
  max_depth: 5
  require_approval: true

memory:
  long_term:
    enabled: true
    score_threshold: 0.65

tools:
  file_system:
    enabled: true
  shell:
    enabled: true
    require_confirmation: true
  network:
    enabled: true

forges:
  - name: web-security
    enabled: true
```

