import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { SolidMarkdown } from "solid-markdown";
import { cn } from "~/lib/utils/class-names";
import { CodeBlock } from "../code-block";
import { JSX } from "solid-js";

export interface MarkdownBlockProps {
  markdown?: string;
  class?: string;
  /**
   * Reconcile new rendering with the previous one using Solid.js' `reconcile()`.
   *
   * Enable this when doing text streaming.
   */
  reconcile?: boolean;
}

export function MarkdownBlock(props: MarkdownBlockProps) {
  const markdown = () => props.markdown;

  const swapBlock = (props: JSX.HTMLAttributes<HTMLPreElement>) => {
    const codeNode = props.node.children.at(0);
    if (!codeNode) {
      return <pre>{props.children}</pre>;
    }
    return <CodeBlock />
  };

  return (
    <SolidMarkdown
      children={markdown()}
      class={cn(props.class)}
      renderingStrategy={props.reconcile ? "reconcile" : "memo"}
      skipHtml
      remarkPlugins={[
        remarkGfm,
        remarkMath,
      ]}
      rehypePlugins={[
        rehypeKatex,
      ]}
      components={{
        pre: swapBlock,
      }}
    />
  );
}
