---
description: Analyze OpenCode model and agent usage patterns from logs
---

Here is the current usage analysis:

!`opencode-agent-optimizer suggest --all $ARGUMENTS`

Review this analysis and provide your interpretation. Highlight the most impactful recommendations and explain the reasoning behind each one. If there are delegation efficiency concerns, explain what they mean practically.

IMPORTANT: The user cannot copy config snippets from the analyzer's terminal output above. If there are actionable config recommendations, you MUST offer to:
1. Print the raw markdown config for each recommended file so the user can review it
2. Write the configs directly to ~/.config/opencode/agents/ (ask before overwriting existing files)

If a recommendation is already reflected in the current config (e.g., a recent config change that hasn't fully taken effect in logs yet), note that no action is needed.
