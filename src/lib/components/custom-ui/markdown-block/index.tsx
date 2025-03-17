import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { SolidMarkdown } from "solid-markdown";
import { cn } from "~/lib/utils/class-names";
import { type Component, createMemo, lazy, Show } from "solid-js";
import { language } from "../code-block/node-detection";
import { getDevOptions } from "~/lib/contexts/globals/dev-tools/dev-mode";
import { Element, Text } from "hast";
import "./markdown-block.css";
import { Dynamic } from "solid-js/web";

export const MarkdownBlock: Component<{
  markdown?: string;
  class?: string;
}> = (props) => {
  const markdown = () => props.markdown;

  return (
    <SolidMarkdown
      children={markdown()}
      class={cn(
        "markdown-block",
        getDevOptions("rerenderFlash") && "__dev-flash",
        props.class,
      )}
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
                const lang = createMemo(() => {
                  const el = element();
                  return el.type === "element" ? language(el) : undefined;
                });

                return element().type === "text" ? (
                  <pre>{(element() as Text).value}</pre>
                ) : element().type === "element" && (element() as Element).tagName === "code" && (
                  <Show when={(element() as Element).children.at(0)}>
                    {(textElement) => (
                      <Show when={textElement().type === "text"}>
                        <Dynamic
                          component={lazy(() => import("../code-block"))}
                          code={(textElement() as NonNullable<Text>).value}
                          collapsible
                          stickyToolbar
                          lang={lang()}
                          stickyOffset={-10}
                        />
                      </Show>
                    )}
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
