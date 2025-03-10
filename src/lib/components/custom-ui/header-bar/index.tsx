import { Component, JSX } from "solid-js";

export const HeaderBar: Component<{
  title?: string;
  children?: JSX.Element;
}> = (props) => {
  return (
    <div class="sticky py-4 px-3 flex-shrink-0 flex place-items-center bg-background/50 backdrop-blur-lg">
      <h2 class="text-lg font-bold select-none flex-grow">{props.title}</h2>
      <div class="shrink-0 flex gap-1">
        {props.children}
      </div>
    </div>
  );
};
