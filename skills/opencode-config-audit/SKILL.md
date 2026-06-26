---
name: opencode-config-audit
description: Use when reviewing, debugging, migrating, or improving OpenCode configuration in ~/.config/opencode or .opencode, including agents, skills, plugins, MCP, permissions, model routing, portability, and usage-analysis recommendations. Trigger only for OpenCode config maintenance, not general application configuration.
license: MIT
compatibility: opencode
metadata:
  scope: global+project
  side_effect: review_first
---

# OpenCode Config Audit

Use this skill to audit and improve OpenCode global or project configuration. It is a focused, on-demand review workflow, not a background daemon. OpenCode skills do not run automatically on every session start or file change; trigger this skill when the user asks about OpenCode configuration quality, portability, agents, skills, plugins, MCP, permissions, or model usage.

## When To Use

Use this skill when the user asks to inspect, review, optimize, migrate, debug, or explain:

- `~/.config/opencode`
- `.opencode/`
- `opencode.json` or `opencode.jsonc`
- `AGENTS.md`
- `agents/*.md`
- `skills/*/SKILL.md`
- OpenCode plugin configuration
- OpenCode MCP configuration
- model assignments or usage-analysis output
- permission rules or tool access
- config portability across machines

Do not use this skill for general application configuration such as Vite, Next.js, Docker, ESLint, TypeScript, package managers, CI, or deployment config unless the task is specifically about OpenCode itself.

## Operating Rules

- Start with read-only inspection unless the user explicitly asks to apply changes.
- In Plan Mode, do not edit files; provide exact proposed changes only.
- In Build Mode, ask before overwriting existing user-authored files when the change is not already explicitly requested.
- Never edit secrets, real `.env` files, auth stores, or provider credentials.
- Preserve unrelated worktree changes. If a file has unrelated edits, read it carefully and make the smallest safe patch.
- Prefer portable config: repository files should contain declarations and templates, not machine-local caches or credentials.

## Audit Workflow

### 1. Discover Relevant Config

Inspect global config when relevant:

- `~/.config/opencode/opencode.jsonc`
- `~/.config/opencode/AGENTS.md`
- `~/.config/opencode/agents/`
- `~/.config/opencode/skills/`
- plugin files and plugin-specific config files
- `.env.example` and `.gitignore`

Inspect project config when present:

- `.opencode/opencode.json`
- `.opencode/opencode.jsonc`
- `.opencode/agents/`
- `.opencode/skills/`
- project-level `AGENTS.md` or instruction files

### 2. Check Skill Quality

Review each relevant skill for:

- valid `SKILL.md` frontmatter with `name` and `description`
- directory name matching the skill `name`
- clear trigger description with enough positive and negative scope
- over-broad trigger phrases that may cause false positives
- missing important trigger scenarios that may cause under-triggering
- excessive prompt length, vague instructions, or conflicting rules
- overlap or conflict between global and project skills
- bundled references, templates, scripts, or internal agents that should be tracked for portability

### 3. Check Agent Quality

Review each relevant agent for:

- clear responsibility and non-overlapping purpose
- appropriate model for workload complexity and cost
- least-privilege permissions for tools, MCP, edit, bash, and external directories
- missing or excessive access to `read`, `glob`, `grep`, `webfetch`, or MCP tools
- clear rules for when the primary agent should delegate to it
- stale names or documentation references after renames

### 4. Check OpenCode Config Quality

Review `opencode.json` or `opencode.jsonc` for:

- `$schema` presence
- valid top-level field shapes
- provider configuration that avoids hardcoded secrets
- MCP entries using environment variables for tokens
- plugin entries that match documented installation expectations
- permission defaults that are safe but not blocking intended agents
- model pinning for agents where drift would be surprising
- portability gaps such as local caches, generated files, or machine-specific paths

### 5. Check Plugin And Portability Boundaries

Separate portable declarations from local installation state:

- Portable: `opencode.jsonc`, `AGENTS.md`, `agents/*.md`, `skills/**`, plugin config files, `.env.example`
- Not portable: `/connect` auth data, `~/.local/share/opencode/auth.json`, real `.env`, `node_modules/`, lock files if intentionally ignored, update-check caches, and project-specific local config

For plugin-specific files such as `oh-my-openagent.json`, clearly explain whether the file is read by OpenCode itself or by a plugin.

### 6. Interpret Usage Analysis

When reviewing OpenCode usage analyzer output:

- Distinguish cost-saving recommendations from stability-only model pinning.
- Check whether a recommendation is already reflected in current config.
- Explain delegation ratio practically: low delegation means primary agents are doing work that specialized subagents might handle.
- Offer to print raw markdown config or write config files directly when actionable agent configs are recommended.
- Ask before overwriting existing `agents/*.md` files.

## Self-Improvement Loop

Use this loop only when the user asks to apply improvements or maintain an audit history:

1. Summarize observed failures, missed triggers, false triggers, model mismatch, permission friction, or portability issues.
2. Propose a small, concrete patch with before/after snippets when useful.
3. Ask for confirmation before writing unless the user has already explicitly requested implementation.
4. If the user wants persistent history, offer to append a short entry to `~/.config/opencode/config-evolve-log.md`. Do not create or update this file without explicit approval.

## Report Format

For audit responses, prioritize findings by severity and use this structure:

## Findings

| Severity | Area | File | Issue | Recommendation |
|---|---|---|---|---|

## Suggested Changes

Show concrete file paths and minimal before/after snippets when useful.

## Apply Plan

List the exact files to edit. If changes are requested in Build Mode, apply the smallest safe patch and then verify the result.

## Severity Guide

- High: broken loading, invalid schema, secrets in repo, unsafe permissions, or configuration that prevents intended tools from working.
- Medium: model mismatch, stale docs, portability gaps, duplicate responsibilities, or plugin configuration likely to confuse future setup.
- Low: naming polish, wording clarity, optional metadata, or non-blocking cleanup.
