import { createMemo, Show } from "solid-js";
import { all, createLowlight } from "lowlight";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { jsx, jsxs, Fragment } from "solid-js/h/jsx-runtime";
import hljs from "highlight.js";
import { cn } from "~/lib/utils/class-names";
import { CodeBlockToolbar } from "./toolbar";

export interface CodeBlockProps {
  code: string;
  lang?: string;
  autoGuess?: boolean;
  class?: string;
  stickyToolbar?: boolean;
}

export function CodeBlock(props: CodeBlockProps) {
  const code = () => props.code;
  const autoGuess = () => props.autoGuess ?? false;
  const lang = createMemo(() => (!props.lang ? (autoGuess() ? null : "plaintext") : props.lang));
  const stickyToolbar = () => props.stickyToolbar;

  const lowlight = createLowlight(all);

  const hastTree = createMemo(() => {
    const detectedLang = lang();
    if (detectedLang) {
      return lowlight.highlight(detectedLang, code());
    }

    return lowlight.highlightAuto(code());
  });
  const yieldElement = createMemo(() => toJsxRuntime(hastTree(), { Fragment, jsx, jsxs }));

  const detectedLang = createMemo(() => hastTree().data?.language);

  const langName = createMemo(() => {
    const language = detectedLang();
    return language ? hljs.getLanguage(language)?.name : null;
  });

  return (
    <div class={cn("relative rounded flex flex-col", props.class)}>
      <Show when={stickyToolbar()}>
        <div class="sticky -top-5 z-10">
          <CodeBlockToolbar code={code} class="absolute top-0 right-0 px-3 py-0.5" />
        </div>
      </Show>
      <div class="flex py-1 items-center bg-secondary text-secondary-foreground px-2 rounded-t">
        <div class="shrink-0 text-sm">{langName()}</div>
        <div class="grow" />
        <Show when={!stickyToolbar()}>
          <CodeBlockToolbar code={code} class="shrink-0" />
        </Show>
      </div>

      <div class="text-sm overflow-x-auto rounded-b">
        <pre class="whitespace-pre-line!">
          <code class={cn("hljs", detectedLang() ? `language-${detectedLang()!}` : "")}>{yieldElement()}</code>
        </pre>
      </div>
    </div>
  );
}
