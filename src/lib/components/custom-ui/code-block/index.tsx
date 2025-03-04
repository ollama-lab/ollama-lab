import { createMemo, createSignal, Match, Show, Switch } from "solid-js";
import { all, createLowlight } from "lowlight";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { jsx, jsxs, Fragment } from "solid-js/h/jsx-runtime";
import { jsxDEV } from "solid-js/h/jsx-dev-runtime";
import hljs from "highlight.js";
import { cn } from "~/lib/utils/class-names";
import { CodeBlockToolbar } from "./toolbar";
import { isDev } from "solid-js/web";

export interface CodeBlockProps {
  code: string;
  lang?: string;
  autoGuess?: boolean;
  class?: string;
  stickyToolbar?: boolean;
  collapsible?: boolean;
}

export function CodeBlock(props: CodeBlockProps) {
  const code = () => props.code;
  const autoGuess = () => props.autoGuess ?? false;
  const lang = createMemo(() => (!props.lang ? (autoGuess() ? null : "plaintext") : props.lang));
  const stickyToolbar = () => props.stickyToolbar;
  const collapsible = () => props.collapsible;

  const lowlight = createLowlight(all);

  const hastTree = createMemo(() => {
    const detectedLang = lang();
    return detectedLang ? lowlight.highlight(detectedLang, code()) : lowlight.highlightAuto(code());
  });

  const yieldElement = createMemo(() => toJsxRuntime(hastTree(), {
    Fragment, jsx, jsxs,
    development: isDev,
    jsxDEV,
    elementAttributeNameCase: "html",
    stylePropertyNameCase: "css",
  }));

  const detectedLang = createMemo(() => hastTree().data?.language);

  const langName = createMemo(() => {
    const language = detectedLang();
    return language ? hljs.getLanguage(language)?.name : null;
  });

  const [wrapText, setWrapText] = createSignal(false);
  const [collapsed, setCollapsed] = createSignal(false);

  const ToolbarTemplate = (props: { class?: string }) => (
    <CodeBlockToolbar
      code={code}
      class={props.class}
      wrapText={wrapText}
      onToggleWrapText={() => setWrapText((cur) => !cur)}
      collapsible={collapsible()}
      collapsed={collapsed}
      onToggleCollapsed={() => setCollapsed((cur) => !cur)}
    />
  );

  const lineCount = createMemo(() => {
    return hastTree()
      .children
      .reduce((acc, cur) => {
        if (cur.type === "text" || cur.type === "comment") {
          acc += cur.value.split("\n").length;
        } else {
          acc++;
        }

        return acc;
      }, 0);
  });

  return (
    <div class={cn("relative rounded flex flex-col", props.class)}>
      <Show when={stickyToolbar()}>
        <div class="sticky -top-5 z-10">
          <ToolbarTemplate class="absolute top-0 right-0 px-3 py-0.5" />
        </div>
      </Show>
      <div class="flex py-1 items-center bg-secondary text-secondary-foreground px-2 rounded-t">
        <div class="shrink-0 text-sm">{langName()}</div>
        <div class="grow" />
        <Show when={!stickyToolbar()}>
          <ToolbarTemplate class="shrink-0" />
        </Show>
      </div>

      <div class="relative text-sm rounded-b overflow-hidden">
        <Switch fallback={(
          <div class="bg-muted text-muted-foreground px-2 py-1">
            {lineCount()} lines hidden
          </div>
        )}>
          <Match when={!collapsible() || !collapsed()}>
            <pre class="min-w-full whitespace-normal">
              <code
                class={cn(
                  "relative overflow-x-auto grid! grid-cols-1",
                  wrapText() ? "whitespace-pre-wrap" : "whitespace-pre",
                  "hljs",
                  detectedLang() ? `language-${detectedLang()!}` : ""
                )}
              >
                {yieldElement()}
              </code>
            </pre>
          </Match>
        </Switch>
      </div>
    </div>
  );
}
