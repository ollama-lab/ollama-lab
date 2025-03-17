import { JSX } from "solid-js/jsx-runtime";
import "./app.css";
import "@fontsource-variable/inter/wght.css";
import { AppBar } from "./lib/components/app-bar";
import { Component, lazy, Show, Suspense } from "solid-js";
import Providers from "./lib/components/providers";
import { LoadingScreen } from "./lib/components/custom-ui/loading-screen";
import { DefaultToaster } from "./lib/components/default-toaster";
import { Portal } from "solid-js/web";
import { devModeEnabled } from "./lib/contexts/globals/dev-tools/dev-mode";

const Layout: Component<{ children?: JSX.Element }> = (props) => {
  const FloatEntry = lazy(() => import("./lib/components/dev-tools/float-entry"));

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

export default Layout;
