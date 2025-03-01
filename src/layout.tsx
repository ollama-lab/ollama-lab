import { JSX } from "solid-js/jsx-runtime";
import "./app.css";
import "@fontsource-variable/inter/wght.css";

export function Layout({ children }: { children?: JSX.Element }) {
  return (
    <div class="flex flex-row w-dvw h-dvh">

      <div class="grow">
        {children}
      </div>
    </div>
  );
}
