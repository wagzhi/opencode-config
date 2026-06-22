---
name: plan-spec
description: 当需求包含计划模式、先写计划再执行、落盘 spec/feats 计划文件、执行后回填结果、同步 gitee issue 状态，或需要将 gitee 需求 issue 拆解为可执行任务 issue 时使用本技能。
---

# 计划规范

## 概览

将项目内的计划管理规范标准化执行，确保计划先落盘、执行可追溯、结果可回填、issue 可同步。

## 适用场景

- 用户明确要求“先计划再执行”
- 需求要求计划文档写入 `spec/feats/`
- 需求涉及计划冲突检查或历史计划复用
- 需求要求功能完成后同步 gitee issue 状态
- 需求来自 gitee issue，且 issue 类型为“需求”
- 用户要求先分析需求、拆解任务，或为需求创建对应任务 issue
- 项目 git remote 指向 gitee，且当前任务未指定对应 issue

## Git 操作规范

当任务涉及本地 Git 操作（如 status、diff、log、branch、commit、push、pull、merge）时，按当前模式处理：

- **构建模式**：调用 `@git-agent` 执行本地 Git 操作。
- **计划模式**：不得调用 `@git-agent` 执行 Git 操作。仅允许为了分析执行只读 Git 命令，如 `git status`、`git diff`、`git log`、`git remote -v`。

计划模式绝对不得执行 Git 写操作，包括 `git init`、`git add`、`git commit`、`git push`、`git remote add`、`git remote set-url`、`git branch`、`git merge` 或 `git rebase`。

若用户在计划模式要求进行 Git 变更，应给出具体步骤和命令，提示切换到构建模式后再执行。

## Gitee 操作规范

### 前置条件

仅当当前项目同时满足以下条件时，才执行 Gitee 相关操作：

- 当前目录属于 git 仓库。
- `origin` remote 指向 Gitee 仓库，例如 URL 包含 `gitee.com`、`e.gitee.com` 或等效 Gitee 企业域名。

如果无法确认当前项目使用 git，或无法确认 `origin` 指向 Gitee 仓库，不得自动创建、更新、评论 Gitee issue 或 pull request。

### 调用方式

当任务涉及 Gitee 平台操作（如创建/更新 issue、评论进展、同步任务进度、创建/管理/审查/合并 pull request）时，调用 `@gitee-agent` 处理。

对于同时涉及 Git 和 Gitee 的任务，先通过 `@git-agent` 执行本地 Git 操作，再通过 `@gitee-agent` 进行 Gitee issue 或 pull request 更新。

### 操作规则

- 处理 gitee issue 读取、评论、创建任务 issue、更新状态时，必须通过 `@gitee-agent` 调用 Gitee MCP，不得直接调用 gitee MCP 工具。
- 创建 gitee issue 时必须指定 `issue_type` 参数：创建“需求” issue 时传 `issue_type="需求"`，创建“任务” issue 时传 `issue_type="任务"`；不得用 `labels` 代替 issue 工作项类型。
- 不要猜测仓库 owner、repo、issue number 或 issue 类型；这些信息应来自用户输入、当前上下文或 `@gitee-agent` 返回的 Gitee MCP 查询结果。
- 若无法通过 `@gitee-agent` 确认 issue 类型为“需求”，不得自动进入需求拆解创建任务流程。
- 判定“remote 指向 gitee”时，应基于 `git remote -v` 结果中 `origin` URL 包含 `gitee.com` 或等效 gitee 域名，不得凭经验假定。
- 在自动创建需求/任务 issue 前，应先通过 `@gitee-agent` 进行查重；若已存在可复用 issue，则优先复用并建立关联，避免重复创建。
- 如果当前环境未配置 Gitee MCP、无权限或 `@gitee-agent` 调用失败，应停止对应的 gitee 同步步骤，并向用户说明缺失的能力和需要补齐的信息。

## 工作流程

### 未指定 Issue 的自动创建与闭环

当项目使用 git、`origin` 指向 gitee，且当前任务未指定对应的 gitee issue 时：

1. 通过 `@gitee-agent` 在对应仓库先创建“需求” issue（`issue_type="需求"`），再基于该需求拆解并创建一个或多个“任务” issue（`issue_type="任务"`）。
2. 在需求与任务 issue 内容中写明关联关系（需求来源、任务归属、验收标准与依赖）。
3. 执行任务时，为对应任务 issue 设置开始时间；若 Gitee 无原生开始时间字段，则以 issue 评论或 issue 正文结构化字段记录（例如 `start_time`）。
4. 任务完成后，为对应任务 issue 设置结束时间；若 Gitee 无原生结束时间字段，则以 issue 评论或 issue 正文结构化字段记录（例如 `end_time`），并将任务 issue 状态更新为 `closed`。
5. 当该需求下所有任务已完成时，将对应需求 issue 状态更新为 `closed`。
6. 若任一步骤因 Gitee MCP 权限、配置或接口错误失败，停止自动同步流程并向用户说明原因。

### Gitee 需求拆解

当关联的 gitee issue 类型为“需求”时，先进入需求拆解流程，不直接改代码：

1. 通过 `@gitee-agent` 读取需求 issue 的标题、正文、标签、评论和当前状态。
2. 分析需求目标、用户价值、范围边界、关键约束、验收标准和主要风险。
3. 将需求拆解为一个或多个可独立执行、可验证的任务。
4. 通过 `@gitee-agent` 为每个任务创建对应的任务 issue（`issue_type="任务"`）；任务正文应包含来源需求 issue、任务目标、实现范围、验收标准、测试建议和依赖关系。
5. 在原需求 issue 下评论任务拆解结果，并列出创建的任务 issue。
6. 停止在需求 issue 上继续执行实现；只有当用户明确指定某个任务 issue 为执行对象时，才进入执行计划流程。

### 执行计划

当用户指定的对象是可执行任务 issue，或需求本身不是 gitee “需求”类型时：

1. 先生成本次执行计划，在实际改代码前写入计划文件。
2. 文件路径与命名规则固定为：`spec/feats/NNN-brief-YYYYMMDD.md`。
3. 写入后，先查看既有计划文件，检查是否冲突或重复；不确定时先向用户确认，再继续执行。
4. 执行完成后，回到同一计划文件补充“执行结果总结”和“后续跟进事项”。
5. 若关联 gitee 任务 issue，完成后按流程更新 issue 状态并同步计划文件关键内容：常规流程更新为“已提测”；当命中“未指定 Issue 的自动创建与闭环”规则时，应记录结束时间并更新为 `closed`。

## 文件命名规则

- `NNN`：三位递增数字，例如 `001`、`002`
- `brief`：英文简要描述，使用短横线连接
- `YYYYMMDD`：当天日期，例如 `20260421`

## 计划文件结构

- 一级标题：功能中文摘要
- 副标题：当前日期和时间
- 正文至少包含：
  - 变更点
  - 测试计划
  - 假设与风险
  - （执行后补充）结果总结
  - （执行后补充）后续跟进


