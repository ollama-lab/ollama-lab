import { JSX, Suspense } from "solid-js";
import { Style } from "@solidjs/meta";
import { preferredColorMode } from "~/lib/contexts/globals/color-mode";
import { createAsync } from "@solidjs/router";

export function HighlightStylesProvider(props: { children?: JSX.Element }) {
  const lightModeCSS = createAsync(async () => (await import("highlight.js/styles/atom-one-light.min.css?raw")).default);
  const darkModeCSS = createAsync(async () => (await import("highlight.js/styles/tokyo-night-dark.min.css?raw")).default);

  const cssString = () => preferredColorMode() === "light" ? lightModeCSS() : darkModeCSS();

  return (
    <>
      <Suspense>
        <Style id="highlight-styles">{cssString()}</Style>
      </Suspense>
      {props.children}
    </>
  );
}
