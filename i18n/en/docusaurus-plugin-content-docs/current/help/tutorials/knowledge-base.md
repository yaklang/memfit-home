---
sidebar_position: 2
title: Knowledge Base Tutorial
---

# Knowledge Base Tutorial

Knowledge bases let Memfit work from your materials instead of relying only on model training data. Use them for product docs, team standards, vulnerability data, project notes, and reusable operational experience.

【Image: Knowledge base page overview, labeling list, create, import, and diagnostics】

## What to Store

| Content | Examples | Use Case |
| --- | --- | --- |
| Product docs | API docs, deployment docs, manuals | Answer based on product facts |
| Security materials | CVEs, exploit notes, hardening baselines | Security analysis and reports |
| Team standards | Coding, testing, delivery rules | Code review and document checks |
| Project materials | Architecture, modules, changelogs | Onboarding and troubleshooting |
| Experience notes | FAQs, runbooks, incident records | Reuse team experience |

## Create a Knowledge Base

Click **New Knowledge Base** and fill in:

| Field | Recommendation |
| --- | --- |
| **Name** | Use a clear name, such as “Web Security Baseline”. |
| **Description** | State source, scope, and update time. |
| **Type / Tags** | Use for filtering and management. |
| **Length** | Controls entry length; keep default if unsure. |

【Image: Create knowledge base dialog】

## Add Materials

- Drag files into Agent or the knowledge area for quick import.
- Import documents from the knowledge base detail page.
- Add manual entries for short rules, experience, or conclusions.

```text
Scenario: Node.js dependency audit
Conclusion: Run tests and build before upgrading dependencies.
Source: Team release process 2026
```

【Image: Dragging files into a knowledge base】

## Build the Knowledge Base

After adding materials, build the knowledge base so Memfit can chunk, index, and retrieve the content.

| Parameter | Purpose |
| --- | --- |
| **chunk** | Controls chunking strategy. |
| **entrylen** | Controls knowledge entry length. |
| **concurrency** | Controls build concurrency. |
| **disableERM** | Disables entity relationship modeling when enabled. |

【Image: Build parameters panel】

## Diagnose Availability

Use **Knowledge Base Availability Diagnostics** after building:

1. Confirm retrieval works.
2. Check whether query results are relevant.
3. Check chunk length quality.
4. Verify the model can answer from retrieved materials.

```text
Based on this knowledge base, what security checks are required before launch?
```

【Image: Knowledge base diagnostics result】

## Use in Agent

1. Open the knowledge base resource area in Agent.
2. Select or mount the target knowledge base.
3. Ask Memfit to answer based on the mounted knowledge base.

```text
Based on the mounted “Web Security Baseline” knowledge base, check whether this Nginx config meets the requirements.
```

【Image: Selecting a knowledge base in Agent】

## Manage Knowledge Bases

| Operation | When to Use |
| --- | --- |
| **Update materials** | Documents or rules changed. |
| **Rebuild** | Many materials were added or removed. |
| **Clear** | Source data is wrong or needs complete rebuild. |
| **Query entries** | Check whether a fact entered the index. |
| **Inspect entities / vectors** | Debug retrieval quality. |

## Common Issues

If AI does not use knowledge base content, confirm it is built and mounted, and explicitly ask Memfit to answer based on it.

If retrieval is inaccurate, split unrelated materials into separate knowledge bases and improve titles and structure.

If new imports do not take effect, rebuild or wait for build completion.

## Next Steps

- [Agent Tutorial](/docs/help/tutorials/ai-agent)
- [Loading and Using SKILLS](/docs/help/tutorials/skills)
- [Advanced Usage](/docs/help/tutorials/advanced)
