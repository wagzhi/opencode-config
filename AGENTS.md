Always respond in Chinese-simplified

## Routing

Use specialized agents or skills when the task matches their scope:

| Task | Delegate To |
|---|---|
| Local Git write operations | `@git-agent` |
| Gitee issues, PRs, reviews, merges, or comments | `@gitee-agent` |
| Third-party docs, SDK/API references, framework docs | `@doc-agent` |
| Third-party docs combined with local project code/config/docs | `@ask-agent` |
| OpenCode config review, migration, agents, skills, plugins, MCP, permissions, model routing | `opencode-config-audit` skill |

## Git Operations

- Read-only Git inspection may be done directly by the main agent: `git status`, `git diff`, `git log`, `git show`, `git remote -v`, `git rev-parse`, `git ls-files`.
- Git operations that modify repository state must be delegated to `@git-agent`: `git add`, `git commit`, `git push`, `git pull`, `git branch`, `git merge`, `git rebase`, `git tag`, remote changes, and similar operations.
- In Plan Mode, do not perform Git write operations. Inspect only and provide the exact commands to run later.

## Gitee Operations

- Use `@gitee-agent` for Gitee platform operations, including issue creation/update/commenting, PR creation/review/merge, and syncing task progress.
- If a task needs both local Git changes and Gitee updates, complete local Git work through `@git-agent` first, then use `@gitee-agent` for Gitee updates.

## Documentation And Research

- Use `@doc-agent` for pure third-party documentation lookup.
- Use `@ask-agent` when the answer requires both external documentation and local project context.

## OpenCode Config Maintenance

Use the `opencode-config-audit` skill when reviewing or improving OpenCode configuration under `~/.config/opencode` or `.opencode`.
