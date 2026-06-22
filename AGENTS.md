Always respond in Chinese-simplified

## Git operations

When the task involves local Git operations, handle them according to the current mode:

- **Build mode**: Invoke `@git-agent` for Git operations that modify repository state, including `git add`, `git commit`, `git push`, `git pull`, `git branch`, `git merge`, `git rebase`, `git tag`, `git remote add`, `git remote set-url`, and `git remote remove`.
- **Build mode**: Read-only Git commands may be executed directly by the main agent for inspection, including `git status`, `git diff`, `git log`, `git show`, `git remote -v`, `git rev-parse`, and `git ls-files`.
- **Plan mode**: Do NOT invoke `@git-agent` to execute Git operations. Only inspect and plan. Read-only Git commands are allowed for analysis, such as `git status`, `git diff`, `git log`, and `git remote -v`.

Plan mode must NOT perform Git write operations, including `git init`, `git add`, `git commit`, `git push`, `git pull`, `git remote add`, `git remote set-url`, `git branch`, `git merge`, or `git rebase`.

Before any Git write operation, the main agent must stop and delegate the operation to `@git-agent`.

If the user asks for Git changes while in Plan mode, provide the exact steps and commands to run after switching to Build mode.

## Gitee operations
When the task involves Gitee platform operations (e.g., creating/updating issues, commenting progress, syncing task progress, creating/managing/reviewing/merging pull requests), invoke `@gitee-agent` to handle them.

For tasks that involve both Git and Gitee, use `@git-agent` for local repository Git operations first, then use `@gitee-agent` for Gitee issue or pull request updates.

## Documentation / API lookup
When the task involves looking up third-party library documentation, SDK/API references, framework docs, usage examples, or technical specs, invoke `@api-docs`. This agent uses context7 MCP to retrieve up-to-date official documentation.
