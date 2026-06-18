Always respond in Chinese-simplified

## Git operations
When the task involves local Git operations (e.g., status, diff, log, branch, commit, push, pull, merge), invoke `@git-agent` to handle them.

## Gitee operations
When the task involves Gitee platform operations (e.g., creating/updating issues, commenting progress, syncing task progress, creating/managing/reviewing/merging pull requests), invoke `@gitee-agent` to handle them.

For tasks that involve both Git and Gitee, use `@git-agent` for local repository Git operations first, then use `@gitee-agent` for Gitee issue or pull request updates.

## Documentation / API lookup
When the task involves looking up third-party library documentation, SDK/API references, framework docs, usage examples, or technical specs, invoke `@api-docs`. This agent uses context7 MCP to retrieve up-to-date official documentation.
