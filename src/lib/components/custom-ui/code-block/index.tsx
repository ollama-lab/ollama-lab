import { Component, createMemo, createResource, createSignal, Show } from "solid-js";
import { cn } from "~/lib/utils/class-names";
import { CodeBlockToolbar } from "./toolbar";
import { Root } from "hast";
import "./code-block.css";
import { CodeBlockRenderer } from "./renderer";
import { preferredColorMode } from "~/lib/contexts/globals/color-mode";
import {
  getCodeLanguageDisplayName,
  highlightCodeToTree,
  normalizeCodeLanguage,
  plainTextToTree,
} from "~/lib/highlight/shiki";

const CodeBlock: Component<{
  code: string;
  lang?: string;
  autoGuess?: boolean;
  class?: string;
  stickyToolbar?: boolean;
  collapsible?: boolean;
  stickyOffset?: number;
}> = (props) => {
  const code = () => props.code;
  const autoGuess = () => props.autoGuess ?? false;
  const lang = () => props.lang;
  const stickyToolbar = () => props.stickyToolbar;
  const collapsible = () => props.collapsible;
  const stickyOffset = () => props.stickyOffset;

  const [highlighted] = createResource(
    () => ({
      code: code(),
      lang: autoGuess() ? undefined : lang(),
      mode: preferredColorMode(),
    }),
    (args) => highlightCodeToTree(args),
  );

  const highlightResult = createMemo(() => {
    const cur = highlighted();
    if (cur) {
      return cur;
    }

    return {
      tree: plainTextToTree(code()),
      language: normalizeCodeLanguage(autoGuess() ? undefined : lang()),
      backgroundColor: undefined,
    };
  });

  const hastTree = createMemo<Root>(() => highlightResult().tree);

  const highlightAsLang = createMemo(() => highlightResult().language);

  const langName = createMemo(() => getCodeLanguageDisplayName(highlightAsLang() || lang()));

  const preStyle = createMemo(() => {
    const backgroundColor = highlightResult().backgroundColor;
    if (!backgroundColor) {
      return undefined;
    }

    return { "background-color": backgroundColor };
  });

  const [wrapText, setWrapText] = createSignal(false);
  const [collapsed, setCollapsed] = createSignal(false);

  const ToolbarTemplate: Component<{ class?: string }> = (props) => (
    <CodeBlockToolbar
      code={code}
      class={props.class}
      wrapText={wrapText}
      onToggleWrapText={() => setWrapText((cur) => !cur)}
      collapsible={collapsible()}
      collapsed={collapsed}
      onToggleCollapsed={() => setCollapsed((cur) => !cur)}
      stickyOffset={stickyOffset()}
    />
  );

  const lineCount = createMemo(() => {
    return hastTree().children.reduce((acc: number, cur) => {
      if (cur.type === "text" || cur.type === "comment") {
        acc += cur.value.split("\n").length;
      } else {
        acc++;
      }

      return acc;
    }, 0);
  });

  return (
    <div class={cn("code-block relative rounded flex flex-col", props.class)}>
      <Show when={stickyToolbar()}>
        <div class="sticky z-10" style={{ top: `${props.stickyOffset ?? 0}px` }}>
          <ToolbarTemplate class="absolute top-0 right-0 px-3 py-0.5" />
        </div>
      </Show>
      <div class="flex py-1 items-center bg-secondary text-secondary-foreground px-2 rounded-t">
        <div class="shrink-0 text-sm px-1">{langName()}</div>
        <div class="grow" />
        <Show when={!stickyToolbar()}>
          <ToolbarTemplate class="shrink-0" />
        </Show>
      </div>

      <div class="relative text-sm rounded-b overflow-hidden">
        <Show
          when={!collapsible() || !collapsed()}
          fallback={<div class="bg-muted text-muted-foreground px-2 py-1">{lineCount()} lines hidden</div>}
        >
          <pre class={cn("min-w-full", !preStyle() && "bg-muted")} style={preStyle()}>
            <code
              class={cn(
                "relative overflow-x-auto grid! grid-cols-1 px-3 py-2",
                wrapText() ? "whitespace-pre-wrap" : "whitespace-pre",
                highlightAsLang() ? `language-${highlightAsLang()!}` : "",
              )}
            >
              <CodeBlockRenderer tree={hastTree()} />
            </code>
          </pre>
        </Show>
      </div>
    </div>
  );
};

export default CodeBlock;
