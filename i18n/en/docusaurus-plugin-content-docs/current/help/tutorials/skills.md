---
sidebar_position: 3
title: Loading and Using SKILLS
---

# Loading and Using SKILLS

Skills are scenario-based capability packages. A Skill usually combines prompts, tools, parameter forms, and execution strategy so Agent can handle a specific class of tasks more consistently.

【Image: Skills resource area, labeling skill list, import, export, and create actions】

## Skills vs Tools

| Type | Purpose | Example |
| --- | --- | --- |
| **Tool** | Performs one concrete action | Read a file, check a certificate, run a scan |
| **Skill** | Guides Agent through a task class | Web audit, code review, report generation |
| **Knowledge base** | Provides reference material | Team standards, vulnerability data, product docs |

## View Loaded Skills

Open the resource area in Agent and switch to **Skills**:

1. Browse available Skills.
2. Read name, description, and tags.
3. Decide whether the Skill matches the current task.

【Image: Skill list and details】

## Use a Skill

1. Select the target Skill.
2. Fill in parameters if a form appears.
3. Review the Skill name, description, and parameters.
4. Confirm execution.

【Image: Skill parameter confirmation panel】

You can also mention a Skill in natural language:

```text
Use the code review Skill to inspect the auth.ts file I added, focusing on authorization bypass.
```

【Image: Mentioning a Skill in the input box】

## Import Skills

1. Open the Skills resource area.
2. Click **Import**.
3. Select the Skill file.
4. Inspect name, description, parameters, and tool dependencies.
5. Test with a low-risk task first.

【Image: Importing a Skill file】

## Export Skills

When a workflow becomes stable, export it for team reuse:

1. Select the Skill.
2. Click **Export**.
3. Save it with notes about scenario, dependencies, and recommended models.

【Image: Exporting one or multiple Skills】

## Skill Review

Some Skills require parameters such as target, file path, language, or output format. Before execution, check:

| Item | Check |
| --- | --- |
| Skill name | Is it the intended Skill? |
| Description | Does it match the scenario? |
| Parameters | Are target, path, scope, and output correct? |
| Tool dependencies | Will it call high-risk tools? |

【Image: Skill Review panel】

## Combine Skills with Knowledge Bases

Skills define how to work; knowledge bases define what to reference.

```text
Use the security audit Skill and the mounted “Java Security Standard” knowledge base.
Review authentication and authorization logic under src/main.
```

## When to Customize a Skill

Create a Skill when the same task flow repeats:

- Same prompt pattern.
- Same tool combination.
- Same output format.
- Reused by multiple teammates.
- Needs fixed parameters before execution.

Custom Skill editing is covered in [Advanced Usage](/docs/help/tutorials/advanced).

## Next Steps

- [Agent Tutorial](/docs/help/tutorials/ai-agent)
- [Knowledge Base Tutorial](/docs/help/tutorials/knowledge-base)
- [Advanced Usage](/docs/help/tutorials/advanced)
