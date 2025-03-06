import { JSX } from "solid-js/jsx-runtime";
import "./app.css";
import "@fontsource-variable/inter/wght.css";
import { AppBar } from "./lib/components/app-bar";
import { Show, Suspense } from "solid-js";
import Providers from "./lib/components/providers";
import "~/lib/utils/dayjs-init";
import { LoadingScreen } from "./lib/components/custom-ui/loading-screen";
import { DefaultToaster } from "./lib/components/default-toaster";
import { Portal } from "solid-js/web";
import { FloatEntry } from "./lib/components/dev-tools/float-entry";
import { devModeEnabled } from "./lib/contexts/globals/dev-tools/dev-mode";

export function Layout(props: { children?: JSX.Element }) {
  return (
    <Providers>
      <DefaultToaster />

      <div class="flex flex-row w-dvw h-dvh">
        <AppBar />

        <div class="grow">
          <Suspense fallback={<LoadingScreen text="Loading page..." />}>{props.children}</Suspense>
        </div>

        <Show when={devModeEnabled()}>
          <Portal>
            <FloatEntry />
          </Portal>
        </Show>
      </div>
    </Providers>
  );
}
