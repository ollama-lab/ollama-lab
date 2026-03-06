import type { PromptResponseEvents } from "~/lib/commands/chats";
import type { IncomingUserPrompt } from "~/lib/schemas/chat";
import type { CompletionMetrics } from "~/lib/schemas/events/text-streams";
import { emit } from "@tauri-apps/api/event";
import { toast } from "solid-sonner";
import { Accessor } from "solid-js";
import { ChatHistory, SessionMode } from "../schemas/session";
import { reconcile, SetStoreFunction } from "solid-js/store";
import { ChatHistoryStore, PromptSubmissionEvents } from "../contexts/globals/chat-history";

export interface ConvertResponseEventsProps {
  regenerateFor?: number;
}

export function convertResponseEvents(
  chatHistory: Accessor<ChatHistory | undefined>,
  setChatHistoryStore: SetStoreFunction<ChatHistoryStore>,
  mode: SessionMode,
  model?: string,
  prompt?: IncomingUserPrompt,
  { onScrollDown, onRespond }: PromptSubmissionEvents = {},
  { regenerateFor }: ConvertResponseEventsProps = {},
): PromptResponseEvents {
  let currentChatId: number | undefined = undefined;
  let contentBuffer = "";
  let thinkingBuffer = "";
  let flushTimer: number | undefined;

  const STREAM_FLUSH_INTERVAL_MS = 33;

  function getOrCreateHistory() {
    const ch = chatHistory();
    if (!ch) {
      setChatHistoryStore("chatHistory", mode, { chats: [] });
    }

    return chatHistory()!;
  }

  function clearFlushTimer() {
    if (flushTimer !== undefined) {
      window.clearTimeout(flushTimer);
      flushTimer = undefined;
    }
  }

  function resetStreamBuffer() {
    clearFlushTimer();
    contentBuffer = "";
    thinkingBuffer = "";
  }

  function flushStreamBuffer() {
    clearFlushTimer();

    if (!contentBuffer && !thinkingBuffer) {
      return;
    }

    const ch = getOrCreateHistory();
    const index = ch.chats.length - 1;
    const chat = ch.chats[index];

    if (!chat || chat.id !== currentChatId) {
      resetStreamBuffer();
      return;
    }

    if (chat.status !== "sending") {
      setChatHistoryStore("chatHistory", mode, "chats", index, "status", reconcile("sending"));
    }

    if (thinkingBuffer) {
      const bufferedThoughts = thinkingBuffer;
      thinkingBuffer = "";
      setChatHistoryStore("chatHistory", mode, "chats", index, "thoughts", (t) => (t ?? "") + bufferedThoughts);
    }

    if (contentBuffer) {
      const bufferedContent = contentBuffer;
      contentBuffer = "";
      setChatHistoryStore("chatHistory", mode, "chats", index, "content", (t) => (t ?? "") + bufferedContent);
    }

    onScrollDown?.();
  }

  function scheduleStreamFlush() {
    if (flushTimer !== undefined) {
      return;
    }

    flushTimer = window.setTimeout(() => {
      flushStreamBuffer();
    }, STREAM_FLUSH_INTERVAL_MS);
  }

  return {
    afterUserPromptSubmitted(id: number, date: Date): void {
      resetStreamBuffer();

      const ch = getOrCreateHistory();

      if (regenerateFor !== undefined) {
        const chatIndex = ch.chats.findIndex((value) => value.id === regenerateFor);
        if (chatIndex >= 0) {
          const versions = ch.chats[chatIndex].versions;

          setChatHistoryStore(
            "chatHistory",
            mode,
            "chats",
            reconcile([
              ...ch.chats.slice(0, chatIndex),
              {
                ...ch.chats[chatIndex],
                id,
                model: model ?? ch.chats[chatIndex].model,
                status: "sent",
                content: prompt?.text ?? "",
                dateCreated: date,
                versions: versions ? [...versions, id] : [ch.chats[chatIndex].id, id],
              },
            ]),
          );
        }
        regenerateFor = undefined;
      } else {
        setChatHistoryStore("chatHistory", mode, "chats", ch.chats.length, {
          id,
          status: "sent",
          content: prompt?.text ?? "",
          role: "user",
          dateCreated: date,
          versions: [id],
          imageCount: prompt?.imagePaths?.length ?? 0,
        });
      }

      onScrollDown?.();
    },
    afterResponseCreated(id: number): void {
      resetStreamBuffer();
      currentChatId = id;

      const ch = getOrCreateHistory();

      if (regenerateFor !== undefined) {
        const i = ch.chats.findIndex((value) => value.id === regenerateFor);
        if (i < 0) {
          return;
        }

        const versions = ch.chats[i].versions;

        setChatHistoryStore(
          "chatHistory",
          mode,
          "chats",
          reconcile([
            ...ch.chats.slice(0, i),
            {
              ...ch.chats[i],
              id,
              status: "preparing",
              content: "",
              thoughts: undefined,
              model: model ?? ch.chats[i].model,
              versions: versions ? [...versions, id] : [ch.chats[i].id, id],
            },
          ]),
        );
      } else {
        const length = ch.chats.length;
        setChatHistoryStore("chatHistory", mode, "chats", length, {
          id,
          status: "preparing",
          role: "assistant",
          content: "",
          model,
          versions: [id],
          imageCount: 0,
        });
      }

      onRespond?.();
      onScrollDown?.();
    },
    afterSystemPromptCreated(id: number, text: string): void {
      const ch = getOrCreateHistory();

      setChatHistoryStore("chatHistory", mode, "chats", ch.chats.length, {
        id,
        content: text,
        role: "system",
        status: "sent",
        imageCount: 0,
      });
    },
    onStreamText(chunk: string): void {
      const ch = getOrCreateHistory();

      const chat = ch.chats.at(-1);
      if (!chat || currentChatId !== chat.id) {
        emit("cancel-gen");
        return;
      }

      if (chat.thinking) {
        thinkingBuffer += chunk;
      } else {
        contentBuffer += chunk;
      }

      scheduleStreamFlush();
    },
    onCompleteTextStreaming(metrics: CompletionMetrics): void {
      flushStreamBuffer();

      const ch = getOrCreateHistory();

      const chat = ch.chats.at(-1);
      const index = ch.chats.length - 1;
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", mode, "chats", index, {
          status: "sent",
          totalDuration: metrics.totalDuration ?? undefined,
          loadDuration: metrics.loadDuration ?? undefined,
          promptEvalCount: metrics.promptEvalCount ?? undefined,
          promptEvalDuration: metrics.promptEvalDuration ?? undefined,
          evalCount: metrics.evalCount ?? undefined,
          evalDuration: metrics.evalDuration ?? undefined,
        });
      }

      currentChatId = undefined;
      resetStreamBuffer();
    },
    onFail(msg): void {
      flushStreamBuffer();

      const ch = getOrCreateHistory();

      const chat = ch.chats.at(-1);
      const index = ch.chats.length - 1;
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", mode, "chats", index, "status", "not sent");
      }

      currentChatId = undefined;
      resetStreamBuffer();

      if (msg) {
        toast.error(msg);
      }
    },
    onCancel(): void {
      flushStreamBuffer();

      const ch = getOrCreateHistory();

      const chat = ch.chats.at(-1);
      const index = ch.chats.length - 1;
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", mode, "chats", index, "status", "not sent");
      }

      currentChatId = undefined;
      resetStreamBuffer();
    },
    onThoughtBegin(): void {
      flushStreamBuffer();

      const ch = getOrCreateHistory();

      const chat = ch.chats.at(-1);
      const index = ch.chats.length - 1;
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", mode, "chats", index, {
          thinking: true,
          status: "sending",
        });
      }
    },
    onThoughtEnd(thoughtFor: number | null): void {
      flushStreamBuffer();

      const ch = getOrCreateHistory();

      const chat = ch.chats.at(-1);
      const index = ch.chats.length - 1;
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", mode, "chats", index, {
          thinking: false,
          thoughtFor: thoughtFor ?? undefined,
        });
      }
    },
  };
}
