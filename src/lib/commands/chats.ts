import type { ChatGenerationReturn, IncomingUserPrompt } from "~/lib/models/chat";
import type { StreamingResponseEvent } from "~/lib/models/events/text-streams";
import { Channel, invoke } from "@tauri-apps/api/core";

interface InternalChatGenerationReturn {
  id: number;
  dateCreated: string;
}

export interface PromptResponseEvents {
  afterUserPromptSubmitted?: (id: number, date: Date) => void;
  afterResponseCreated?: (id: number) => void;
  afterSystemPromptCreated?: (id: number, text: string) => void;
  onStreamText?: (chunk: string) => void;
  onCompleteTextStreaming?: () => void;
  onFail?: (msg: string | null) => void;
  onCancel?: (msg: string | null) => void;
  onThoughtBegin?: () => void;
  onThoughtEnd?: (thoughtFor: number | null) => void;
}

function newTextStreamChannel({
  afterUserPromptSubmitted,
  afterResponseCreated,
  afterSystemPromptCreated,
  onStreamText,
  onCompleteTextStreaming,
  onFail,
  onCancel,
  onThoughtBegin,
  onThoughtEnd,
}: PromptResponseEvents): Channel<StreamingResponseEvent> {
  const channel = new Channel<StreamingResponseEvent>();

  channel.onmessage = (ev) => {
    switch (ev.type) {
      case "userPrompt":
        afterUserPromptSubmitted?.(ev.id, new Date(ev.timestamp * 1000));
        break;

      case "responseInfo":
        afterResponseCreated?.(ev.id);
        break;

      case "systemPrompt":
        afterSystemPromptCreated?.(ev.id, ev.text);
        break;

      case "text":
        onStreamText?.(ev.chunk);
        break;

      case "done":
        onCompleteTextStreaming?.();
        break;

      case "failure":
        onFail?.(ev.message);
        break;

      case "canceled":
        onCancel?.(ev.message);
        break;

      case "thoughtBegin":
        onThoughtBegin?.();
        break;

      case "thoughtEnd":
        onThoughtEnd?.(ev.thoughtFor);
        break;

      default:
        break;
    }
  };

  return channel;
}

export async function submitUserPrompt(
  sessionId: number,
  prompt: IncomingUserPrompt,
  parentId: number | null,
  events: PromptResponseEvents = {},
  reuseSiblingImages: boolean = false,
): Promise<ChatGenerationReturn> {
  return await invoke<InternalChatGenerationReturn>("submit_user_prompt", {
    sessionId,
    prompt,
    onStream: newTextStreamChannel(events),
    parentId,
    reuseSiblingImages,
  }).then(({ id, dateCreated }) => ({
    id,
    dateCreated: new Date(dateCreated),
  }));
}

export async function regenerateResponse(
  sessionId: number,
  chatId: number,
  model?: string,
  events: PromptResponseEvents = {},
): Promise<ChatGenerationReturn> {
  return await invoke<InternalChatGenerationReturn>("regenerate_response", {
    sessionId,
    chatId,
    model,
    onStream: newTextStreamChannel(events),
  }).then(({ id, dateCreated }) => ({
    id,
    dateCreated: new Date(dateCreated),
  }));
}
