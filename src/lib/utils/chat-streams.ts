import type { PromptResponseEvents } from "~/lib/commands/chats";
import type { IncomingUserPrompt } from "~/lib/models/chat";
import { emit } from "@tauri-apps/api/event";
import { toast } from "solid-sonner";
import { Accessor } from "solid-js";
import { ChatHistory } from "../models/session";
import { produce, reconcile, SetStoreFunction } from "solid-js/store";
import { ChatHistoryStore, PromptSubmissionEvents } from "../contexts/globals/chat-history";

export interface ResponseStreamingContext {
  responseIndex: number;
}

export interface ConvertResponseEventsProps {
  regenerateFor?: number;
}

export function convertResponseEvents(
  context: ResponseStreamingContext,
  chatHistory: Accessor<ChatHistory | null>,
  setChatHistoryStore: SetStoreFunction<ChatHistoryStore>,
  model?: string,
  prompt?: IncomingUserPrompt,
  { onScrollDown, onRespond }: PromptSubmissionEvents = {},
  { regenerateFor }: ConvertResponseEventsProps = {},
): PromptResponseEvents {
  let currentChatId: number | undefined = undefined;

  return {
    afterUserPromptSubmitted(id: number, date: Date): void {
      let ch = chatHistory();
      if (!ch) {
        ch = {
          chats: [],
        };

        setChatHistoryStore("chatHistory", ch);
      }

      if (regenerateFor !== undefined) {
        const chatIndex = ch.chats.findIndex((value) => value.id === regenerateFor);
        if (chatIndex >= 0) {
          setChatHistoryStore(
            "chatHistory",
            "chats",
            chatIndex,
            produce((cur) => {
              cur.status = "sent";
              cur.content = prompt?.text ?? "";
              cur.dateSent = date;
              if (cur.versions) {
                cur.versions.push(id);
              } else {
                cur.versions = [id];
              }
              cur.imageCount = prompt?.imagePaths?.length ?? 0;
            }),
          );
        }
        regenerateFor = undefined;
      } else {
        setChatHistoryStore("chatHistory", "chats", ch.chats.length, {
          id,
          status: "sent",
          content: prompt?.text ?? "",
          role: "user",
          dateSent: date,
          versions: null,
          imageCount: prompt?.imagePaths?.length ?? 0,
        });
      }

      onScrollDown?.();
    },
    afterResponseCreated(id: number): void {
      if (context.responseIndex >= 0) {
        return;
      }

      currentChatId = id;

      const ch = chatHistory();

      if (ch) {
        if (regenerateFor !== undefined) {
          const i = ch.chats.findIndex((value) => value.id === regenerateFor);
          if (i < 0) {
            return;
          }

          setChatHistoryStore(
            "chatHistory",
            "chats",
            i,
            produce((cur) => {
              cur.content = "";
              cur.status = "preparing";
              if (model) {
                cur.model = model;
              }

              if (cur.versions) {
                cur.versions.push(id);
              } else {
                cur.versions = [id];
              }
            }),
          );

          context.responseIndex = ch.chats.length - 1;
        } else {
          const length = ch.chats.length;
          setChatHistoryStore("chatHistory", "chats", length, {
            id,
            status: "preparing",
            role: "assistant",
            content: "",
            model,
            versions: null,
            imageCount: 0,
          });

          if (length !== undefined) {
            context.responseIndex = length;
          }
        }
      }

      onRespond?.();
      onScrollDown?.();
    },
    afterSystemPromptCreated(id: number, text: string): void {
      const ch = chatHistory();
      if (!ch) {
        return;
      }

      setChatHistoryStore("chatHistory", "chats", ch.chats.length, {
        id,
        content: text,
        role: "system",
        status: "sent",
        imageCount: 0,
      });
    },
    onStreamText(chunk: string): void {
      if (context.responseIndex < 0) {
        return;
      }

      const ch = chatHistory();
      if (!ch) {
        return;
      }

      const chat = ch.chats.at(context.responseIndex);
      if (!chat || currentChatId !== chat.id) {
        emit("cancel-gen");
        return;
      }

      setChatHistoryStore("chatHistory", "chats", context.responseIndex, "status", reconcile("sending"));

      if (chat.thinking) {
        setChatHistoryStore("chatHistory", "chats", context.responseIndex, "thoughts", (t) => (t ?? "") + chunk);
      } else {
        setChatHistoryStore("chatHistory", "chats", context.responseIndex, "content", (t) => (t ?? "") + chunk);
      }

      onScrollDown?.();
    },
    onCompleteTextStreaming(): void {
      if (context.responseIndex < 0) {
        return;
      }

      const ch = chatHistory();
      if (!ch) {
        return;
      }

      const chat = ch.chats.at(context.responseIndex);
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", "chats", context.responseIndex, "status", "sent");
      }

      currentChatId = undefined;
    },
    onFail(msg): void {
      if (context.responseIndex < 0) {
        return;
      }

      const ch = chatHistory();
      if (!ch) {
        return;
      }

      const chat = ch.chats.at(context.responseIndex);
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", "chats", context.responseIndex, "status", "not sent");
      }

      currentChatId = undefined;

      if (msg) {
        toast.error(msg);
      }
    },
    onCancel(): void {
      if (context.responseIndex < 0) {
        return;
      }

      const ch = chatHistory();
      if (!ch) {
        return;
      }

      const chat = ch.chats.at(context.responseIndex);
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", "chats", context.responseIndex, "status", "not sent");
      }

      currentChatId = undefined;
    },
    onThoughtBegin(): void {
      if (context.responseIndex < 0) {
        return;
      }

      const ch = chatHistory();
      if (!ch) {
        return;
      }

      const chat = ch.chats.at(context.responseIndex);
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", "chats", context.responseIndex, {
          thinking: true,
          status: "sending",
        });
      }
    },
    onThoughtEnd(thoughtFor: number | null): void {
      if (context.responseIndex < 0) {
        return;
      }

      const ch = chatHistory();
      if (!ch) {
        return;
      }

      const chat = ch.chats.at(context.responseIndex);
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", "chats", context.responseIndex, {
          thinking: false,
          thoughtFor: thoughtFor,
        });
      }
    },
  };
}
