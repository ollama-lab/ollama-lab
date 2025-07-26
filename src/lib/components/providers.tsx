import { JSX } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { HighlightStylesProvider } from "./styling/highlight-styles-provider";
import { UIZoomProvider } from "./styling/ui-zoom-provider";

export default function Providers(props: { children?: JSX.Element }) {
  return (
    <MetaProvider>
      <HighlightStylesProvider>
        <UIZoomProvider>
          {props.children}
        </UIZoomProvider>
      </HighlightStylesProvider>
    </MetaProvider>
  );
}
