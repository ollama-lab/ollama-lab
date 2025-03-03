import { createMemo, JSX } from "solid-js";
import { useColorMode } from "~/lib/contexts/color-mode";
import lightModeCSS from "highlight.js/styles/atom-one-light.min.css?raw";
import darkModeCSS from "highlight.js/styles/atom-one-dark-reasonable.min.css?raw";
import { Style } from "@solidjs/meta";

export function HighlightStylesProvider(props: { children?: JSX.Element }) {
  const colorModeContext = useColorMode();

  const cssString = createMemo(() => colorModeContext?.preferredColorMode() === "light" ? lightModeCSS : darkModeCSS);

  return (
    <>
      <Style id="highlight-styles">{cssString()}</Style>
      {props.children}
    </>
  )
}
