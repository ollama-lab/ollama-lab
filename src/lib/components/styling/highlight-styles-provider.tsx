import { JSX } from "solid-js";
import lightModeCSS from "highlight.js/styles/atom-one-light.min.css?raw";
import darkModeCSS from "highlight.js/styles/tokyo-night-dark.min.css?raw";
import { Style } from "@solidjs/meta";
import { preferredColorMode } from "~/lib/contexts/globals/color-mode";

export function HighlightStylesProvider(props: { children?: JSX.Element }) {
  const cssString = () => (preferredColorMode() === "light" ? lightModeCSS : darkModeCSS);

  return (
    <>
      <Style id="highlight-styles">{cssString()}</Style>
      {props.children}
    </>
  );
}
