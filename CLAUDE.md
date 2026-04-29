# minesweeper

이 폴더는 cc-bot 이 관리하는 독립 프로젝트입니다.

## 봇 동작 가이드 (Claude 에게)

- **MCP 서버, permissions, hooks 등 설정은 반드시 `.claude/settings.json`
  (이 프로젝트 폴더 안)에 추가**. user-level `~/.claude/settings.json`
  은 봇 SDK 가 읽지 않으므로 거기 추가하면 무시됩니다.
- 새 MCP 추가 형식 예:
  ```json
  {
    "permissions": { ... },
    "mcpServers": {
      "fetch": {"command": "uvx", "args": ["mcp-server-fetch"]}
    }
  }
  ```
- `git push --force` / `-f` 는 차단. 일반 `git push` 는 텔레그램 ✅/❌ 승인 후 실행.
