import { Element, ElementContent, Root, RootContent, Text } from "hast";
import { Component, For, Match, Switch } from "solid-js";
import { Dynamic } from "solid-js/web";

const ElementNode: Component<{
  node: Element;
}> = (props) => {
  const node = () => props.node;

  return (
    <Dynamic
      component={node().tagName}
      {...node().properties}
    >
      <CodeBlockChildren children={node().children} />
    </Dynamic>
  );
}

const CodeBlockChildren: Component<{
  children: RootContent[] | ElementContent[];
}> = (props) => {
  return (
    <For each={props.children}>
      {(child) => (
        <Switch>
          <Match when={child.type === "element"}>
            <ElementNode node={child as Element} />
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
    <Dynamic component={CodeBlockChildren} children={props.tree.children} />
  );
}
