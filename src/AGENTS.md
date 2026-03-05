# AGENTS.md

## Non-obvious learnings

- `reloadChatHistory()` failures in `src/lib/contexts/globals/chat-history.ts` can be caused by backend SQL view/schema drift (`get_current_branch` -> `v_complete_chats`), even when the frontend error points only to a TS callsite.
- `done` stream payload changes must be synchronized across `src/lib/schemas/events/text-streams.ts`, `src/lib/commands/chats.ts`, and `src/lib/utils/chat-streams.ts`; missing any one causes event parsing/state update breakage.
