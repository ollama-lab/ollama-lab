import { Component, createEffect, createMemo, createRenderEffect, createResource, createSignal, Match, Show, Switch } from "solid-js";
import { cn } from "~/lib/utils/class-names";
import { CodeBlockToolbar } from "./toolbar";
import { createStore, reconcile } from "solid-js/store";
import { Root } from "hast";
import { h } from "hastscript";
import "./code-block.css";
import { CodeBlockRenderer } from "./renderer";
import { placeholderProcessor } from "~/lib/highlight/placeholder-processor";
import { highlightTheme } from "~/lib/contexts/globals/highlight";

const CodeBlock: Component<{
  code: string;
  lang?: string;
  class?: string;
  stickyToolbar?: boolean;
  collapsible?: boolean;
  stickyOffset?: number;
}> = (props) => {
  const code = () => props.code;
  const lang = () => props.lang;
  const stickyToolbar = () => props.stickyToolbar;
  const collapsible = () => props.collapsible;
  const stickyOffset = () => props.stickyOffset;

  const [hastTree, setHastTree] = createStore<Root>({ type: "root", children: [] });

  const [highlighter] = createResource(async () => (await import("~/lib/highlight")).highlighter);

  const [languageEntry] = createResource(lang, async (lang) => {
    const trigger = (await import("~/lib/highlight/langs")).langs[lang]
    if (!trigger) {
      return undefined;
    }

    return await trigger();
  });

  const displayName = createMemo(() => {
    if (languageEntry.loading || !languageEntry()) {
      return undefined;
    }

    return languageEntry()![0].displayName;
  });

  const [entryLoaded, setEntryLoaded] = createSignal(false);

  const langLoaded = createMemo(() => {
    return !highlighter.loading && !languageEntry.loading && highlighter() && entryLoaded();
  });

  createEffect(() => {
    const hl = highlighter.loading || languageEntry.loading ? undefined : highlighter();

    if (hl) {
      const entry = languageEntry();
      if (entry) {
        hl.loadLanguageSync(entry);
      }

      setEntryLoaded(true);
    }
  });

  createRenderEffect(() => {
    let tree;

    const hl = highlighter.loading || languageEntry.loading ? undefined : highlighter();

    if (hl && lang()) {
      tree = hl.codeToHast(code(), {
        lang: langLoaded() ? lang()! : "text",
        theme: highlightTheme(),
      });
    } else {
      tree = h(null, ...placeholderProcessor(code()));
    }

    setHastTree(reconcile(tree));
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
      if (cur.type === "element" && cur.tagName === "pre") {
        const assumedCode = cur.children.at(0);
        if (assumedCode && assumedCode.type === "element" && assumedCode.tagName === "code") {
          acc += assumedCode.children.length;
        }
      } else if (cur.type === "text") {
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
        <div class="text-sm px-1">{displayName()}</div>
        <div class="grow" />
        <Show when={!stickyToolbar()}>
          <ToolbarTemplate />
        </Show>
      </div>

      <div
        class={cn(
          "code-container relative text-sm rounded-b overflow-hidden",
          wrapText() && "wrap-code",
        )}
      >
        <Switch fallback={<div class="bg-muted text-muted-foreground px-2 py-1">{lineCount()} lines hidden</div>}>
          <Match when={!collapsible() || !collapsed()}>
            <CodeBlockRenderer tree={hastTree} />
          </Match>
        </Switch>
      </div>
    </div>
  );
}

export default CodeBlock;
