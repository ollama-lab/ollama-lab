import { Component, createMemo, createRenderEffect, createSignal, Match, Show, Switch } from "solid-js";
import { all, createLowlight } from "lowlight";
import hljs from "highlight.js";
import { cn } from "~/lib/utils/class-names";
import { CodeBlockToolbar } from "./toolbar";
import { createStore, reconcile } from "solid-js/store";
import { Root, RootContent } from "hast";
import { h } from "hastscript";
import "./code-block.css";
import { CodeBlockRenderer } from "./renderer";

export const CodeBlock: Component<{
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
  const lang = createMemo(() => (!props.lang ? (autoGuess() ? null : "plaintext") : props.lang));
  const stickyToolbar = () => props.stickyToolbar;
  const collapsible = () => props.collapsible;
  const stickyOffset = () => props.stickyOffset;

  const lowlight = createLowlight(all);

  const [hastTree, setHastTree] = createStore<Root>({ type: "root", children: [] });

  createRenderEffect(() => {
    const detectedLang = lang();
    const tree = detectedLang ? lowlight.highlight(detectedLang, code()) : lowlight.highlightAuto(code());

    tree.children = tree.children
      .reduce((acc, cur) => {
        let lastChild = acc.at(-1);
        if (cur.type === "text") {
          for (const line of cur.value.split("\n")) {
            const lineNode = h("span.code-line", line);

            if (lastChild && lastChild.type === "element") {
              lastChild.children.push(lineNode);
              lastChild = undefined;
              continue;
            }

            acc.push(lineNode);
          }
        } else if (cur.type === "element") {
          if (!lastChild || lastChild.type !== "element") {
            acc.push(h("span.code-line", {}, [cur]));
          } else {
            lastChild.children.push(cur);
          }
        }

        return acc;
      }, [] as RootContent[]);

    setHastTree(reconcile(tree));
  });

  const detectedLang = createMemo(() => hastTree.data?.language);

  const langName = createMemo(() => {
    const language = detectedLang();
    return language ? hljs.getLanguage(language)?.name : null;
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
    return hastTree.children.reduce((acc, cur) => {
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
        <div class="sticky z-10" style={{ "top": `${props.stickyOffset ?? 0}px` }}>
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
        <Switch fallback={<div class="bg-muted text-muted-foreground px-2 py-1">{lineCount()} lines hidden</div>}>
          <Match when={!collapsible() || !collapsed()}>
            <pre class="min-w-full">
              <code
                class={cn(
                  "relative overflow-x-auto grid! grid-cols-1",
                  wrapText() ? "whitespace-pre-wrap" : "whitespace-pre",
                  "hljs",
                  detectedLang() ? `language-${detectedLang()!}` : "",
                )}
              >
                <CodeBlockRenderer tree={hastTree} />
              </code>
            </pre>
          </Match>
        </Switch>
      </div>
    </div>
  );
}
