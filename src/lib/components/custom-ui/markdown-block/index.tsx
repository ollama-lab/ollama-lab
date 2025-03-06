import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { SolidMarkdown } from "solid-markdown";
import { cn } from "~/lib/utils/class-names";
import { CodeBlock } from "../code-block";
import { Show } from "solid-js";
import { language } from "../code-block/node-detection";

export interface MarkdownBlockProps {
  markdown?: string;
  class?: string;
}

export function MarkdownBlock(props: MarkdownBlockProps) {
  const markdown = () => props.markdown;

  return (
    <SolidMarkdown
      children={markdown()}
      class={cn("markdown-block", props.class)}
      renderingStrategy="reconcile"
      skipHtml
      remarkPlugins={[
        remarkGfm,
        remarkMath,
      ]}
      rehypePlugins={[
        rehypeKatex,
      ]}
      components={{
        pre: (props) => {
          return (
            <Show when={props.node.children.at(0)} fallback={<pre>{props.children}</pre>}>
              {(element) => {
                const el = element();

                const lang = el.type === "element" ? language(el) : undefined;

                return el.type === "text" ? (
                  <pre>{el.value}</pre>
                ) : el.type === "element" && el.tagName === "code" && (
                  <Show when={el.children.at(0)}>
                    {(textElement) => {
                      const t = textElement();

                      return t.type === "text" && (
                        <CodeBlock
                          code={t.value}
                          collapsible
                          stickyToolbar
                          lang={lang}
                          stickyOffset={-10}
                        />
                      );
                    }}
                  </Show>
                );
              }}
            </Show>
          )
        },
      }}
    />
  );
}
