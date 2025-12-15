---
sidebar_position: 1
title: 安装指南
---

# 安装指南

通过安装必需的组件开始使用 Memfit AI。

## 前置条件

安装 Memfit AI 之前，请确保您具备：

- **操作系统**: macOS、Linux 或 Windows
- **Yaklang 引擎**: Memfit AI 的底层运行时
- **Yakit**（可选）: 用于可视化交互的 GUI 界面

## 安装 Yaklang

Memfit AI 由 Yaklang 驱动。首先安装 Yaklang 引擎。

### macOS / Linux

打开终端并运行：

```bash
bash <(curl -sS -L http://oss.yaklang.io/install-latest-yak.sh)
```

### Windows

打开 PowerShell 并运行：

```powershell
powershell (new-object System.Net.WebClient).DownloadFile('https://yaklang.oss-cn-beijing.aliyuncs.com/yak/latest/yak_windows_amd64.exe','yak_windows_amd64.exe') && yak_windows_amd64.exe install && del /f yak_windows_amd64.exe
```

## 验证安装

安装后，验证 Yaklang 是否正常工作：

```bash
yak version
```

您应该看到版本信息显示。

## 安装 Yakit（推荐）

Yakit 为 Memfit AI 提供图形界面。

### 下载 Yakit

访问 [https://github.com/yaklang/yakit/releases](https://github.com/yaklang/yakit/releases) 并下载适合您操作系统的版本。

### 平台支持

| 平台 | 下载文件 |
|------|----------|
| macOS (Intel) | `Yakit-darwin-x64.dmg` |
| macOS (Apple Silicon) | `Yakit-darwin-arm64.dmg` |
| Windows | `Yakit-win32-x64.exe` |
| Linux | `Yakit-linux-x64.AppImage` |

## 配置

### 首次设置

1. 启动 Yakit
2. 配置 Yaklang 引擎路径（通常自动检测）
3. 设置您偏好的 AI 提供商
4. 如需要配置代理设置

### AI 提供商配置

Memfit AI 支持多个 AI 提供商：

- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- 本地模型
- 自定义 API 端点

在 设置 → AI 配置 中进行配置。

## 下一步

安装完成后：

1. [第一个任务](/docs/help/quick-start/first-task) - 运行您的第一个 AI 辅助任务
2. [基础概念](/docs/help/quick-start/basic-concepts) - 理解核心概念
3. [配置指南](/docs/help/tutorials/configuration) - 高级设置选项

