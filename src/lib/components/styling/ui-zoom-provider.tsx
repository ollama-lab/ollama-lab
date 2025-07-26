import { createMemo, JSX, Suspense } from "solid-js";
import { Style } from "@solidjs/meta";
import { getCurrentSettings } from "~/lib/contexts/globals/settings";

export function UIZoomProvider(props: { children?: JSX.Element }) {
  const zoomFactor = () => getCurrentSettings().appearance.zoom;

  const cssString = createMemo(() => {
    const zoom = zoomFactor();
    if (zoom === null) {
      return "";
    }

    return `body { zoom: ${zoom} }`;
  });

  return (
    <>
      <Suspense>
        <Style id="ui-zoom">{cssString()}</Style>
      </Suspense>
      {props.children}
    </>
  );
}
