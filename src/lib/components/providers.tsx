import { JSX } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { UIZoomProvider } from "./styling/ui-zoom-provider";

export default function Providers(props: { children?: JSX.Element }) {
  return (
    <MetaProvider>
      <UIZoomProvider>
        {props.children}
      </UIZoomProvider>
    </MetaProvider>
  );
}
