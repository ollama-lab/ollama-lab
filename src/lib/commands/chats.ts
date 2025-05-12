import { chatGenerationReturnSchema, type ChatGenerationReturn, type IncomingUserPrompt } from "~/lib/schemas/chat";
import { streamingResponseEventSchema } from "~/lib/schemas/events/text-streams";
import { Channel, invoke } from "@tauri-apps/api/core";
import { SessionMode } from "../schemas/session";

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
}: PromptResponseEvents): Channel {
  const channel = new Channel();

  channel.onmessage = (rawEv) => {
    const ev = streamingResponseEventSchema.parse(rawEv);

    switch (ev.type) {
      case "userPrompt":
        afterUserPromptSubmitted?.(ev.id, ev.timestamp);
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
  mode: SessionMode,
  events: PromptResponseEvents = {},
  reuseSiblingImages: boolean = false,
): Promise<ChatGenerationReturn> {
  return await chatGenerationReturnSchema.parseAsync(await invoke("submit_user_prompt", {
    sessionId,
    prompt,
    onStream: newTextStreamChannel(events),
    parentId,
    reuseSiblingImages,
    mode,
  }));
}

export async function regenerateResponse(
  sessionId: number,
  chatId: number,
  model?: string,
  events: PromptResponseEvents = {},
): Promise<ChatGenerationReturn> {
  return await chatGenerationReturnSchema.parseAsync(await invoke("regenerate_response", {
    sessionId,
    chatId,
    model,
    onStream: newTextStreamChannel(events),
  }));
}
