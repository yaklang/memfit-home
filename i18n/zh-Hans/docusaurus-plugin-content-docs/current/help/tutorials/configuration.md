---
sidebar_position: 1
title: 配置指南
---

# 配置指南

配置 Memfit AI 以满足您的需求。

## AI 提供商设置

### 支持的提供商

| 提供商 | 模型 | 特点 |
|--------|------|------|
| OpenAI | GPT-4, GPT-3.5-turbo | 最佳推理 |
| Anthropic | Claude 3, Claude 2 | 长上下文 |
| 本地 | Ollama, LMStudio | 隐私 |
| 自定义 | 任何 OpenAI 兼容 | 灵活性 |

### 配置

```yaml
ai:
  provider: openai
  model: gpt-4
  api_key: sk-xxxxx
  base_url: https://api.openai.com/v1  # 可选
  temperature: 0.7
  max_tokens: 4096
```

### 使用代理

对于网络限制：

```yaml
ai:
  provider: openai
  model: gpt-4
  proxy: http://127.0.0.1:7890
```

## 执行设置

### ReAct 循环

```yaml
react:
  max_steps: 20          # 最大迭代次数
  spin_threshold: 3       # 自旋检测前的步数
  reflection_on_error: true
  timeout: 300            # 秒
```

### Plan 引擎

```yaml
plan:
  max_depth: 5            # 最大任务树深度
  parallel_execution: true
  require_approval: true   # 需要人工审查
```

## 记忆配置

### 短期记忆

```yaml
memory:
  short_term:
    max_messages: 50
    include_system: true
```

### 长期记忆

```yaml
memory:
  long_term:
    enabled: true
    score_threshold: 0.6
    max_entries: 10000
    vector_db: sqlite       # 或 postgres, qdrant
```

## RAG 配置

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

## 工具配置

### 启用工具

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

### 工具权限

```yaml
permissions:
  read: true
  write: true        # 需要确认
  execute: true      # 需要确认
  network: true
  sensitive: confirm  # always, never, confirm
```

## Forge 配置

### 加载 Forges

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

## Yakit 集成

### 引擎连接

```yaml
yakit:
  engine_port: 8087
  auto_start: true
  log_level: info
```

### UI 偏好

```yaml
yakit:
  ui:
    theme: dark
    language: zh-Hans   # 或 en
    show_traces: true
    auto_scroll: true
```

## 环境变量

使用环境变量覆盖配置：

```bash
export MEMFIT_AI_PROVIDER=openai
export MEMFIT_AI_MODEL=gpt-4
export MEMFIT_AI_API_KEY=sk-xxxxx
export MEMFIT_MAX_STEPS=30
```

## 配置文件位置

默认位置：

| 平台 | 路径 |
|------|------|
| macOS | `~/.config/memfit/config.yaml` |
| Linux | `~/.config/memfit/config.yaml` |
| Windows | `%APPDATA%\memfit\config.yaml` |

## 完整配置示例

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

