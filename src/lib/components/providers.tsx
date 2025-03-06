import { JSX } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { HighlightStylesProvider } from "./styling/highlight-styles-provider";

export default function Providers(props: { children?: JSX.Element }) {
  return (
    <MetaProvider>
      <HighlightStylesProvider>
        {props.children}
      </HighlightStylesProvider>
    </MetaProvider>
  );
}
