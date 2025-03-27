import { Component, createMemo, JSX, Show } from "solid-js";

export const SectionRoot: Component<{
  title?: string;
  children?: JSX.Element;
}> = (props) => {
  const title = createMemo(() => props.title);

  return (
    <div class="flex flex-col gap-2">
      <Show when={!!title()}>
        <h2>{title()}</h2>
      </Show>
      <div class="flex flex-col gap-2">{props.children}</div>
    </div>
  );
}
