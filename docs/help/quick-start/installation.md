---
sidebar_position: 1
title: Installation
---

# Installation Guide

Get started with Memfit AI by installing the required components.

## Prerequisites

Before installing Memfit AI, ensure you have:

- **Operating System**: macOS, Linux, or Windows
- **Yaklang Engine**: The underlying runtime for Memfit AI
- **Yakit** (Optional): GUI interface for visual interaction

## Installing Yaklang

Memfit AI is powered by Yaklang. First, install the Yaklang engine.

### macOS / Linux

Open your terminal and run:

```bash
bash <(curl -sS -L http://oss.yaklang.io/install-latest-yak.sh)
```

### Windows

Open PowerShell and run:

```powershell
powershell (new-object System.Net.WebClient).DownloadFile('https://yaklang.oss-cn-beijing.aliyuncs.com/yak/latest/yak_windows_amd64.exe','yak_windows_amd64.exe') && yak_windows_amd64.exe install && del /f yak_windows_amd64.exe
```

## Verifying Installation

After installation, verify Yaklang is working:

```bash
yak version
```

You should see the version information displayed.

## Installing Yakit (Recommended)

Yakit provides a graphical interface for Memfit AI.

### Download Yakit

Visit [https://github.com/yaklang/yakit/releases](https://github.com/yaklang/yakit/releases) and download the appropriate version for your operating system.

### Platforms

| Platform | Download |
|----------|----------|
| macOS (Intel) | `Yakit-darwin-x64.dmg` |
| macOS (Apple Silicon) | `Yakit-darwin-arm64.dmg` |
| Windows | `Yakit-win32-x64.exe` |
| Linux | `Yakit-linux-x64.AppImage` |

## Configuration

### First-time Setup

1. Launch Yakit
2. Configure the Yaklang engine path (usually auto-detected)
3. Set up your preferred AI provider
4. Configure any proxy settings if needed

### AI Provider Configuration

Memfit AI supports multiple AI providers:

- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Local models
- Custom API endpoints

Configure in Settings → AI Configuration.

## Next Steps

After installation:

1. [Your First Task](/docs/help/quick-start/first-task) - Run your first AI-assisted task
2. [Basic Concepts](/docs/help/quick-start/basic-concepts) - Understand core concepts
3. [Configuration Guide](/docs/help/tutorials/configuration) - Advanced setup options

