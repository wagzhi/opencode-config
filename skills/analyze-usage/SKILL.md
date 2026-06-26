---
name: analyze-usage
description: Interpret OpenCode model and agent usage analysis to recommend cost-saving agent configurations
---

## What I do

I help you understand and act on the output of the OpenCode Log Analyzer (`opencode-agent-optimizer`). This tool parses OpenCode's log files to reveal which models and agents are actually being used, flag mismatches from config, and recommend cost-saving configurations.

## Core philosophy

The user deliberately uses **expensive models (opus) for primary/orchestrator agents** (build, plan) and **cheaper models (sonnet/haiku) for subagents** (coder, explore, review, browser, docs-lookup). Recommendations must **never suggest downgrading primary agents**. The goal is to optimize subagent costs while preserving orchestration quality.

## How to run the analyzer

Execute via bash:

```bash
# Full analysis with suggestions
opencode-agent-optimizer suggest --all

# Recent usage only (e.g., last 7 days)
opencode-agent-optimizer suggest --all --since 2026-02-20

# Summary overview
opencode-agent-optimizer summary --all

# Compare configured vs actual models
opencode-agent-optimizer compare --all

# Suggest from scratch (ignore existing configs)
opencode-agent-optimizer suggest --all --no-config
```

Dates in `--since` and `--until` are interpreted as **local time** (AEST, UTC+10). Log timestamps are stored in UTC.

## How to interpret the output

### Cost profile section

Shows the current distribution of calls across cost tiers:
- **$$$ expensive** (opus): Should only appear for primary agents (build, plan). If subagents show up here, that's the main optimization opportunity.
- **$$ moderate** (sonnet): Good default for subagents doing complex work (multi-step coding, detailed reviews).
- **$ cheap** (haiku): Ideal for simple, focused tasks (file search, quick lookups, simple docs queries).

### Recommendations

Each recommendation has a confidence tag:
- **[HIGH]**: Strong evidence from many sessions. Act on these.
- **[MEDIUM]**: Reasonable evidence. Worth trying.
- **[LOW]**: Limited data. Monitor before committing.

Key recommendation types:
- **Downgrade suggestions**: A subagent is using a more expensive model than needed for its typical workload. The analyzer considers task nature (read-only vs code-generation) and complexity (median calls per session).
- **Pin config**: An agent is working but has no explicit model in its config. Pinning prevents drift.
- **Config mismatch**: The model in config differs from what's actually being used. Usually means the config was recently changed.
- **New agent ideas**: Suggests splitting an agent's workload by creating a specialized cheaper agent (e.g., a "search" agent on haiku for simple lookups).

### Delegation analysis

Shows how well primary agents delegate to subagents vs doing work directly:
- **Delegation ratio**: Higher is better for primary agents. A low ratio means the orchestrator is doing too much work itself.
- **Longest non-delegated streak**: If a primary agent makes many consecutive direct LLM calls without spawning subagents, it may not be leveraging the multi-agent setup effectively.
- **Heavy sessions**: Sessions where a primary agent made 10+ direct calls. These are opportunities to improve delegation patterns.

### Estimated impact

The before/after comparison shows projected savings. Focus on the **percentage reduction in expensive-tier calls** as the key metric.

## When to use me

- After noticing high API costs or wanting to optimize agent configurations
- When setting up a new project and wanting to establish good agent model assignments
- Periodically (e.g., weekly) to check if usage patterns have shifted
- After adding new agents to verify they're using appropriate models

## Acting on recommendations

The user **cannot copy config snippets** from the analyzer's ANSI terminal output when it runs inside OpenCode. When there are actionable config changes:

1. **Check first** whether the recommendation is already reflected in the current config at `~/.config/opencode/agents/`. If a config was recently changed, log data may lag behind — note this and skip.
2. **For new recommendations**, offer to write the config files directly to `~/.config/opencode/agents/`. Always show the user what you plan to write and ask before overwriting existing files.
3. **For new agent ideas** (e.g., a "search" agent), show the full proposed config and explain what it does before writing.

You can read existing configs from `~/.config/opencode/agents/*.md` and write new/updated ones there directly using your file tools. This is the preferred workflow — do not tell the user to copy snippets from the output.

## What I cannot do

- I do not have access to actual dollar costs — recommendations are based on relative cost tiers
- I cannot predict future usage — recommendations are based on historical log data
