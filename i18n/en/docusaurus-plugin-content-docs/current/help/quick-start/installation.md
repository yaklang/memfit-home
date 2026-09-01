---
sidebar_position: 1
title: Getting Started with Memfit AI
description: Quick start with Memfit AI — environment setup, installation on macOS/Linux/Windows, and first run. Get going with Yaklang's official AI Agent framework in minutes.
keywords: [install Memfit AI, quick start, macOS, Linux, Windows, Yaklang]
---

import Head from '@docusaurus/Head';

# Getting Started with Memfit AI

## What is Memfit AI

Memfit AI is the open-source cybersecurity AI Agent orchestration framework of the Yaklang ecosystem, built on a recursive dual-engine (ReAct + Plan) architecture that gives AI visible execution power. It goes beyond conversation -- it understands tasks, creates plans, invokes tools, and delivers results as an intelligent agent system.

Memfit AI is deeply optimized for professional industrial scenarios such as cybersecurity and code auditing, while maintaining the flexibility of a general-purpose Agent capable of adapting to various complex tasks.

### Three Core Systems

| System | Description |
|--------|-------------|
| **AI Agent Execution Engine** | The core driving force of Memfit AI. Through ReAct loops and task planning, it enables AI to think autonomously, invoke tools, and execute multi-step tasks |
| **Knowledge Base System** | Provides domain expertise to the AI. Supports importing custom knowledge data, giving AI expert-level understanding in specific domains |
| **Memory System** | Long-term memory capability for AI. Records interaction history and learning outcomes, making AI smarter over time and increasingly understanding of your needs |

### Use Cases

Memfit AI excels in the following scenarios:

- **Cybersecurity**: Vulnerability scanning, penetration testing, security auditing
- **Code Auditing**: Code quality analysis, security defect detection
- **Data Analysis**: Structured data processing, report generation
- **Automated Operations**: System inspection, configuration management
- **General Tasks**: Any complex work requiring AI understanding, planning, and execution

## Open Source and Product Updates

Memfit AI is built on the [Yaklang](https://github.com/yaklang/yaklang) open-source engine. Yaklang is an actively maintained open-source project providing a powerful security toolchain and DSL capabilities.

- **Engine Open Source**: The Yaklang engine is fully open source and community-driven
- **Continuous Updates**: Both the Memfit AI client and Yaklang engine maintain active updates with ongoing new features and optimizations
- **Rich Ecosystem**: Built-in security tools, protocol support, and analysis capabilities

## Download and Install Memfit AI

### Get Memfit AI

Go to the official [downloads page](https://memfit.ai/en/downloads/) and pick the installer matching your OS and CPU architecture. The page always shows the current version, and all installers are free.

![image-20260316123157042](/img/help/image-20260316123157042.png)

### Platform Support

| Platform | Architecture | Package Format |
|----------|--------------|----------------|
| macOS (Apple Silicon) | `arm64` | `.dmg` |
| macOS (Intel) | `x64` | `.dmg` |
| Windows | `amd64` | `.exe` |
| Linux | `amd64` / `arm64` | `.AppImage` |

Users on older operating systems can find Legacy builds on the [downloads page](https://memfit.ai/en/downloads/).

### Installation Steps

1. Download the installer for your platform from the [downloads page](https://memfit.ai/en/downloads/)
2. Run the installer and follow the prompts to complete installation
3. Launch Memfit AI

### Platform Notes

- **macOS**: If macOS blocks the app with "cannot verify developer", open *System Settings → Privacy & Security* and click "Open Anyway"; or right-click the package and choose "Open".
- **Windows**: Run the `.exe` installer. If SmartScreen appears, click "More info → Run anyway".
- **Linux**: The `.AppImage` needs no installation — make it executable and run it: `chmod +x Memfit-*.AppImage && ./Memfit-*.AppImage`.

### Installation FAQ

**Is Memfit AI free to install?**

Yes. The Memfit AI client is free, and the underlying Yaklang engine is open source under Apache-2.0.

**Which operating systems are supported?**

macOS (Apple Silicon / Intel), Windows, and Linux (AMD64 / ARM64). Installers for all of them are available on the [downloads page](https://memfit.ai/en/downloads/).

**Does it work on older operating systems?**

Yes. Legacy builds for macOS, Windows, and Linux are provided on the downloads page for older OS versions.

<Head>
  <script type="application/ld+json">{`
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Memfit AI free to install?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The Memfit AI client is free, and the underlying Yaklang engine is open source under Apache-2.0."
      }
    },
    {
      "@type": "Question",
      "name": "Which operating systems does Memfit AI support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "macOS (Apple Silicon / Intel), Windows, and Linux (AMD64 / ARM64). Installers for all of them are available on the official downloads page."
      }
    },
    {
      "@type": "Question",
      "name": "Does Memfit AI work on older operating systems?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Legacy builds for macOS, Windows, and Linux are provided on the downloads page for older OS versions."
      }
    }
  ]
}
  `}</script>
</Head>

### First Launch

When launching Memfit AI for the first time, the system will automatically initialize, including checking the runtime environment and configuring basic settings.

![image-20260316123236292](/img/help/image-20260316123236292.png)

## Yaklang Engine

Memfit AI uses the Yaklang engine as its underlying runtime, responsible for executing tool invocations, security scans, protocol interactions, and other core operations.

### Engine Management

In Memfit AI, you can conveniently manage the Yaklang engine:

- **Auto Install**: On first launch, Memfit AI will guide you through installing the Yaklang engine
- **Version Updates**: When a new version is available, Memfit AI will prompt you to update the engine
- **Status Check**: You can view the engine's connection status and version information in the Memfit AI interface

![image-20260316123300909](/img/help/image-20260316123300909.png)

## Next Steps

After installation, continue with the following:

1. [Basic Settings and Custom AI Configuration](/docs/help/quick-start/tier-ai) - Configure permissions, task settings, and AI models
2. [Hello, Memfit AI!](/docs/help/quick-start/hello-memfit) - Start your first AI Agent experience
