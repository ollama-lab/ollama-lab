import { Show, createMemo, createSignal } from "solid-js";
import autosize from "autosize";
import { toast } from "solid-sonner";
import { MarkdownBlock } from "~/lib/components/custom-ui/markdown-block";
import { Progress } from "~/lib/components/ui/progress";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "~/lib/components/ui/context-menu";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { cn } from "~/lib/utils/class-names";
import { getInputPrompt, setInputPrompt } from "~/lib/contexts/globals/prompt-input";

export function Bubble() {
  const chat = useChatEntry();
  const role = () => chat?.().role;
  const content = createMemo(() => chat?.().content);
  const status = () => chat?.().status;
  const [selectedText, setSelectedText] = createSignal<string>();
  const [bubbleRef, setBubbleRef] = createSignal<HTMLDivElement>();

  const isNotEmpty = createMemo(() => {
    const text = content();
    return text && text.length > 1;
  });

  const isAssistantStreaming = createMemo(() => role() === "assistant" && status() === "sending");
  const showStreamingMotion = createMemo(
    () => role() === "assistant" && (status() === "preparing" || status() === "sending"),
  );

  const containsNode = (node: Node | null) => {
    const container = bubbleRef();
    if (!container || !node) {
      return false;
    }
    return container.contains(node);
  };

  const updateSelection = () => {
    if (role() !== "assistant") {
      setSelectedText(undefined);
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectedText(undefined);
      return;
    }

    const raw = selection.toString();
    const normalized = raw.trim();
    if (!normalized) {
      setSelectedText(undefined);
      return;
    }

    if (!containsNode(selection.anchorNode) || !containsNode(selection.focusNode)) {
      setSelectedText(undefined);
      return;
    }

    setSelectedText(normalized);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedText(undefined);
      window.getSelection()?.removeAllRanges();
    }
  };

  const formatBlockquote = (text: string) => {
    return text
      .split(/\r?\n/)
      .map((line) => `> ${line}`)
      .join("\n");
  };

  const appendQuoteToPrompt = (quote: string) => {
    const current = getInputPrompt().text;

    if (!current) {
      return `${quote}\n\n`;
    }

    let prefix = current;
    if (!current.endsWith("\n\n")) {
      prefix += current.endsWith("\n") ? "\n" : "\n\n";
    }

    return `${prefix}${quote}\n\n`;
  };

  const focusPromptInput = () => {
    queueMicrotask(() => {
      const promptField = document.querySelector<HTMLTextAreaElement>('textarea[name="prompt"]');
      if (!promptField) {
        return;
      }
      autosize.update(promptField);
      promptField.focus();
      const length = promptField.value.length;
      promptField.setSelectionRange(length, length);
    });
  };

  const handleAddFollowUp = () => {
    const text = selectedText();
    if (!text) {
      return;
    }

    const blockquote = formatBlockquote(text);
    setInputPrompt("text", appendQuoteToPrompt(blockquote));
    toast.success("Quoted text added to prompt.");
    focusPromptInput();
    setSelectedText(undefined);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <Show when={isNotEmpty() || status() !== "sent"}>
      <ContextMenu onOpenChange={handleOpenChange}>
        <ContextMenuTrigger
          ref={setBubbleRef}
          class={cn(
            "py-2",
            role() === "user" && "bg-secondary/50 text-secondary-foreground px-5 rounded-xl",
            showStreamingMotion() && "assistant-streaming-bubble",
          )}
          disabled={!selectedText()}
          onMouseUp={updateSelection}
          onKeyUp={updateSelection}
        >
          <MarkdownBlock markdown={content()} />
          <Show when={isAssistantStreaming()}>
            <span class="streaming-caret" aria-hidden="true" />
          </Show>
          <Show when={status() === "preparing"}>
            <Progress value={null} class="w-full max-w-md" />
          </Show>
        </ContextMenuTrigger>
        <ContextMenuContent class="text-sm">
          <ContextMenuItem onSelect={handleAddFollowUp} disabled={!selectedText()}>
            Add follow-up
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </Show>
  );
}
