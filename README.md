# OpenCode 配置仓库

个人 [OpenCode](https://opencode.ai) 全局配置方案，包含自定义 agent、skill、plugin、MCP 集成和行为指令。支持同步到新机器后快速恢复使用。

> [!NOTE]
> **模型与渠道说明：** 本配置默认按以下使用习惯设计：
> - **主力模型**：Codex Plus 提供的 GPT-5 系列模型，用于日常开发、复杂推理和主会话工作流
> - **子代理模型**：OpenCode Go 提供的 deepseek、glm 等国产模型，用于 `@git-agent`、`@doc-agent`、`@ask-agent`、`explore` 等低成本、高频调用场景
> - **补充渠道**：aicodemirror，用于部分更适合 Claude 的任务场景
>
> 使用者请根据自己的订阅情况调整 `opencode.jsonc` 中的 `provider` 配置，以及各 agent 的 `model` 字段。模型格式为 `provider/model-id`，例如 `openai/gpt-5`、`opencode-go/deepseek-v4-flash`、`anthropic/claude-sonnet-*`。

## 可移植范围

本仓库用于迁移 OpenCode 的全局配置和可复用能力，不迁移某台电脑上的认证、缓存和安装产物。

纳入仓库：

- `opencode.jsonc`：全局 provider、MCP、plugin、agent 覆盖和权限配置
- `AGENTS.md`：全局 agent 行为指令
- `tui.json`：TUI 界面配置
- `.env.example`：环境变量模板，不包含真实密钥
- `agents/*.md`：自定义 subagent
- `skills/*/SKILL.md` 及 skill 需要的引用文件、模板、内部 agent
- `oh-my-openagent.json`：可选插件配置
- 本仓库以后新增的本地 plugin 源码，例如 `plugins/` 或 `.opencode/plugins/`

不纳入仓库：

- 通过 `/connect` 生成的 provider 认证信息
- `~/.local/share/opencode/auth.json`
- 真实 `.env` 文件和任何 API key/token
- `node_modules/`、`package-lock.json`、`bun.lock` 等本机安装产物
- 具体项目自己的 `.opencode/` 项目配置
- 临时缓存和检查文件，例如 `opencode-skill-creator-update-check.json`

## 目录结构

```
~/.config/opencode/
├── opencode.jsonc          # 主配置（provider、MCP、agent、permission）
├── tui.json                # TUI 界面配置
├── AGENTS.md               # 全局 agent 行为指令
├── .env.example            # 环境变量模板
├── agents/                 # 自定义 subagent
│   ├── doc-agent.md         #   第三方文档/API 查询（context7 MCP）
│   ├── ask-agent.md         #   文档查询 + 本项目探索的综合问答
│   ├── git-agent.md         #   Git 操作自动化
│   └── gitee-agent.md       #   Gitee 平台集成（issue、PR）
└── skills/                 # 专业技能
    ├── plan-spec/           #   计划模式 — 需求拆解、spec 落盘、gitee 同步
    ├── opencode-config-audit/ # OpenCode 配置审计与迁移优化
    └── opencode-skill-creator/ # OpenCode skill 创建、评估、优化
```

## Agent 说明

| Agent | 类型 | 功能 |
|-------|------|------|
| `@git-agent` | subagent | Git 操作（status、diff、commit、push 等），禁止破坏性命令 |
| `@gitee-agent` | subagent | Gitee issue 创建/更新/评论、PR 创建/审查/合并 |
| `@doc-agent` | subagent | 通过 context7 MCP 查询第三方库/API 文档，辅助 webfetch |
| `@ask-agent` | subagent | 结合第三方文档查询与本项目代码/文档/配置探索进行综合问答 |
| `explore` | 内置 subagent | 代码库探索（文件搜索、关键词检索），使用 deepseek-v4-flash |

## Skill 说明

| Skill | 用途 |
|-------|------|
| `plan-spec` | 需求分析 → 任务拆解 → spec 落盘 → gitee issue 同步 → 执行回填 |
| `opencode-config-audit` | 审计和优化 OpenCode 全局/项目配置、agent、skill、plugin、MCP、权限和模型分配 |
| `opencode-skill-creator` | 创建、测试、评估、优化和打包 OpenCode skill |

## Agent 模型清单

新机器没有对应 provider 或订阅时，需要修改这些模型配置。

| 位置 | 当前模型 | 用途 | 迁移时说明 |
|------|----------|------|------------|
| `opencode.jsonc` 的 `agent.explore.model` | `opencode-go/deepseek-v4-flash` | 内置 explore 子代理 | 没有 OpenCode Go 时改成可用模型 |
| `agents/git-agent.md` | `opencode-go/deepseek-v4-flash` | Git 操作代理 | 没有 OpenCode Go 时改成可用模型 |
| `agents/gitee-agent.md` | `opencode-go/deepseek-v4-flash` | Gitee 操作代理 | 没有 OpenCode Go 时改成可用模型 |
| `agents/doc-agent.md` | `opencode-go/deepseek-v4-pro` | 第三方文档查询 | 没有 OpenCode Go 时改成可用模型 |
| `agents/ask-agent.md` | `opencode-go/deepseek-v4-pro` | 文档 + 项目综合问答 | 没有 OpenCode Go 时改成可用模型 |
| `oh-my-openagent.json` | `openai/*`、`github-copilot/*` | 可选多模型路由 | 仅启用 `oh-my-openagent` 时需要调整 |

## Plugin 迁移

插件声明可移植，插件安装产物不移植。同步到新电脑后，保留 `opencode.jsonc` 中的 `plugin` 配置即可；`node_modules/` 和锁文件由每台电脑本地生成或由 OpenCode 按插件名加载。

已启用插件：

| 插件 | 配置位置 | 安装/加载方式 | 说明 |
|------|----------|----------------|------|
| `opencode-skill-creator` | `opencode.jsonc` 的 `plugin` 字段 | 首次通过 `npx opencode-skill-creator` 安装后，OpenCode 启动时按插件名自动加载 | 提供 skill 创建、评估、优化工具 |

### opencode-skill-creator 安装

首次使用需手动执行一次：

```bash
npx opencode-skill-creator
```

这会自动更新 `opencode.jsonc` 的 `plugin` 字段，并在 OpenCode 重启后将 skill 文件安装到 `skills/opencode-skill-creator/`。

本仓库已包含安装后的 skill 文件，新机器克隆后无需再次执行 `npx opencode-skill-creator`；只需确保 Node.js 和 npm 已安装，OpenCode 启动时会自动识别该插件。

可选插件：

| 插件 | 状态 | 说明 |
|------|:----:|------|
| [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) | ❌ 默认关闭 | 多模型 agent 路由，按任务类型自动切换模型和变体 |

配置文件 `oh-my-openagent.json` 已包含在内，项目如需启用，在 `opencode.jsonc` 中取消注释 `"oh-my-openagent@latest"` 即可。

新机器同步后：

1. 确保已安装 Node.js 和 npm。
2. 克隆本仓库到 `~/.config/opencode`。
3. 设置 `.env.example` 中需要的环境变量。
4. 如需使用 `/connect` 支持的 provider，在 OpenCode 中重新执行 `/connect`。
5. 重启 OpenCode，让 plugin、agent、skill 和 MCP 配置生效。

## MCP 集成

| MCP 服务 | 状态 | 用途 |
|----------|:----:|------|
| context7 | ✅ 启用 | 第三方库/API 文档查询，`@doc-agent` 和 `@ask-agent` 可用 |
| gitee | ✅ 启用 | Gitee issue/PR 管理，`@gitee-agent` 使用 |
| chrome_devtools | ✅ 启用 | 浏览器 DevTools 控制 |
| stitch | ❌ 禁用 | Google Stitch（待启用） |
| figma | ❌ 禁用 | Figma MCP（待启用） |

## 分析工具

### opencode-agent-optimizer

用于分析 OpenCode 日志，查看模型使用分布、成本层级和 agent 委托效率。

安装：

```bash
npm i -g opencode-agent-optimizer
```

常用命令：

```bash
# 完整分析与建议
opencode-agent-optimizer suggest --all

# 最近 7 天使用情况
opencode-agent-optimizer suggest --all --since $(date -v-7d +%Y-%m-%d)

# 配置与实际模型对比
opencode-agent-optimizer compare --all
```

该工具仅读取日志，不修改配置。分析结果中的建议可通过 `opencode-config-audit` skill 评估和落地。

## 快速开始（新机器）

### 1. 克隆仓库

```bash
git clone <this-repo-url> ~/.config/opencode
```

### 2. 设置环境变量

```bash
# 参考 .env.example，在 ~/.zshrc 或 ~/.bash_profile 中添加：
export ANTHROPIC_API_KEY="sk-ant-api03-..."
export ANTHROPIC_BASE_URL="https://api.aicodemirror.com/api/claudecode/v1"
export CONTEXT7_API_KEY="ctx7sk-..."
export GITEE_ACCESS_TOKEN="..."
```

### 3. 配置 provider 凭据

通过 `/connect` 命令在 opencode TUI 中登录其他 provider：

```bash
opencode
/connect
```

凭据保存在 `~/.local/share/opencode/auth.json`（不纳入此仓库）。

### 4. 重启 OpenCode

OpenCode 启动时加载配置。同步 agent、skill、plugin、MCP 或 `opencode.jsonc` 后，需要退出并重新启动 OpenCode。

## 自定义

- **添加 agent**：在 `agents/` 目录创建 markdown 文件，参考现有 agent 的 frontmatter 格式
- **添加 MCP**：编辑 `opencode.jsonc` 的 `mcp` 字段，API key 使用 `{env:VAR}` 引用
- **修改行为指令**：编辑 `AGENTS.md`，所有 agent 会读取
- **添加 skill**：在 `skills/` 目录添加 SKILL.md

## 贡献

1. Fork 本仓库
2. 创建 feature 分支
3. 提交变更
4. 发起 Pull Request

## License

MIT
