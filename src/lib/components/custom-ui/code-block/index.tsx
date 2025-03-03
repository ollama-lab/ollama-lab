import { createMemo } from "solid-js";
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
}

export function CodeBlock(props: CodeBlockProps) {
  const code = () => props.code;
  const autoGuess = () => props.autoGuess ?? false;
  const lang = createMemo(() => !props.lang ? (autoGuess() ? null : "plaintext") : props.lang);

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
      <CodeBlockToolbar code={code} />
      <div class="flex py-1 items-center bg-secondary text-secondary-foreground px-2 rounded-t">
        <div class="shrink-0 text-sm">{langName()}</div>
      </div>

      <div class="text-sm overflow-x-auto rounded-b">
        <pre class="whitespace-pre-line!">
          <code class={cn(
            "hljs",
            detectedLang() ? `language-${detectedLang()!}` : ""
          )}>
            {yieldElement()}
          </code>
        </pre>
      </div>
    </div>
  );
}
