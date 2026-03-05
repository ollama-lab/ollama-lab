# AGENTS.md

## Non-obvious learnings

- `v_complete_chats` is a hard contract for `src-tauri/src/responses/tree.rs` recursive selects; when recreating the view in migrations, preserve expected column names (notably `image_count` and `agent_id`) or chat history loading fails.
- For chat metrics, update these together: migration/view (`v_complete_chats`), `src-tauri/src/models/chat.rs` fields, and `src-tauri/src/responses/tree.rs` CTE column list. Any mismatch can surface as misleading SQLite "no such column" errors in the frontend.
