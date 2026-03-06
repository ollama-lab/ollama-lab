# AGENTS.md

## Non-obvious learnings

- `reloadChatHistory()` failures in `src/lib/contexts/globals/chat-history.ts` can be caused by backend SQL view/schema drift (`get_current_branch` -> `v_complete_chats`), even when the frontend error points only to a TS callsite.
- `done` stream payload changes must be synchronized across `src/lib/schemas/events/text-streams.ts`, `src/lib/commands/chats.ts`, and `src/lib/utils/chat-streams.ts`; missing any one causes event parsing/state update breakage.
- In chat UI, the scroll container is the parent wrapper in `src/lib/components/chat-sessions/chat-panel/index.tsx` (`overflow-y-auto`), not `ChatFeeds` itself; auto-follow logic in `chat-feeds.tsx` must target `root.parentElement`.
- Smooth streaming requires split behavior: smooth-scroll only when a new assistant reply starts (`preparing`), then follow token updates with `requestAnimationFrame` + `behavior: "auto"`; smoothing every chunk causes visible stutter.
- If stream chunks are buffered in `src/lib/utils/chat-streams.ts`, force-flush at stream boundaries (`onCompleteTextStreaming`, `onFail`, `onCancel`, `onThoughtBegin`, `onThoughtEnd`) to prevent dropping tail tokens or mixing `thoughts`/`content`.
