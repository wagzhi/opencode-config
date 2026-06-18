# OpenCode 配置仓库

个人 [OpenCode](https://opencode.ai) 全局配置方案，包含自定义 agent、skill、MCP 集成和行为指令。支持一键迁移到新机器。

> [!NOTE]
> **模型与渠道说明：** 本配置默认按以下使用习惯设计：
> - **主力模型**：Codex Plus 提供的 GPT-5 系列模型，用于日常开发、复杂推理和主会话工作流
> - **子代理模型**：OpenCode Go 提供的 deepseek、glm 等国产模型，用于 `@git-agent`、`@api-docs`、`explore` 等低成本、高频调用场景
> - **补充渠道**：aicodemirror，用于部分更适合 Claude 的任务场景
>
> 使用者请根据自己的订阅情况调整 `opencode.jsonc` 中的 `provider` 配置，以及各 agent 的 `model` 字段。模型格式为 `provider/model-id`，例如 `openai/gpt-5`、`opencode-go/deepseek-v4-flash`、`anthropic/claude-sonnet-*`。

## 目录结构

```
~/.config/opencode/
├── opencode.jsonc          # 主配置（provider、MCP、agent、permission）
├── tui.json                # TUI 界面配置
├── AGENTS.md               # 全局 agent 行为指令
├── .env.example            # 环境变量模板
├── agents/                 # 自定义 subagent
│   ├── api-docs.md          #   API/技术文档查询（context7 MCP）
│   ├── git-agent.md         #   Git 操作自动化
│   └── gitee-agent.md       #   Gitee 平台集成（issue、PR）
└── skills/                 # 专业技能
    ├── plan-spec/           #   计划模式 — 需求拆解、spec 落盘、gitee 同步
    └── playwright-skill/    #   浏览器自动化测试
```

## Agent 说明

| Agent | 类型 | 功能 |
|-------|------|------|
| `@git-agent` | subagent | Git 操作（status、diff、commit、push 等），禁止破坏性命令 |
| `@gitee-agent` | subagent | Gitee issue 创建/更新/评论、PR 创建/审查/合并 |
| `@api-docs` | subagent | 通过 context7 MCP 查询第三方库/API 文档，辅助 webfetch |
| `explore` | 内置 subagent | 代码库探索（文件搜索、关键词检索），使用 deepseek-v4-flash |

## Skill 说明

| Skill | 用途 |
|-------|------|
| `plan-spec` | 需求分析 → 任务拆解 → spec 落盘 → gitee issue 同步 → 执行回填 |
| `playwright-skill` | 浏览器自动化：截图、表单测试、登录流、响应式检查、链接验证 |

## 可选插件

| 插件 | 状态 | 说明 |
|------|:----:|------|
| [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) | ❌ 默认关闭 | 多模型 agent 路由，按任务类型自动切换模型和变体 |

配置文件 `oh-my-openagent.json` 已包含在内，项目如需启用，在 `opencode.jsonc` 中取消注释 `"oh-my-openagent@latest"` 即可。

## MCP 集成

| MCP 服务 | 状态 | 用途 |
|----------|:----:|------|
| context7 | ✅ 启用 | 第三方库/API 文档查询，仅 `@api-docs` 可用 |
| gitee | ✅ 启用 | Gitee issue/PR 管理，`@gitee-agent` 使用 |
| chrome_devtools | ✅ 启用 | 浏览器 DevTools 控制，playwright-skill 使用 |
| stitch | ❌ 禁用 | Google Stitch（待启用） |
| figma | ❌ 禁用 | Figma MCP（待启用） |

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

### 4. 安装 skill 依赖（可选）

```bash
cd ~/.config/opencode/skills/playwright-skill
npm run setup
```

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
