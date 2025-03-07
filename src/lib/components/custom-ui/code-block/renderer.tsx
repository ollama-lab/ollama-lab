import { Element, Root, Text } from "hast";
import { Component, For, Match, Switch } from "solid-js";
import { Dynamic } from "solid-js/web";

const ElementNode: Component<{
  node: Element;
  parent: Element | Root;
  index: number;
}> = (props) => {
  const node = () => props.node;

  return (
    <Dynamic
      component={node().tagName}
      {...node().properties}
    >
      <CodeBlockChildren node={node()} />
    </Dynamic>
  );
}

const CodeBlockChildren: Component<{
  node: Element | Root,
}> = (props) => {
  return (
    <For each={props.node.children}>
      {(child, i) => (
        <Switch>
          <Match when={child.type === "element"}>
            <ElementNode node={child as Element} index={i()} parent={props.node} />
          </Match>

          <Match when={child.type === "text"}>
            {(child as Text).value}
          </Match>
        </Switch>
      )}
    </For>
  );
}

/**
 * Influenced by [solid-markdown](https://github.com/andi23rosca/solid-markdown).
 */
export const CodeBlockRenderer: Component<{
  tree: Root,
}> = (props) => {
  return (
    <Dynamic component={CodeBlockChildren} node={props.tree} />
  );
}
