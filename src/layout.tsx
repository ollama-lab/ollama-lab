import { JSX } from "solid-js/jsx-runtime";
import "./app.css";
import "@fontsource-variable/inter/wght.css";
import { AppBar } from "./lib/components/app-bar";
import { children } from "solid-js";

export function Layout(props: { children?: JSX.Element }) {
  const childrenComp = children(() => props.children);

  return (
    <div class="flex flex-row w-dvw h-dvh">
      <AppBar />

      <div class="grow">
        {childrenComp()}
      </div>
    </div>
  );
}
