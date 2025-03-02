import { JSX } from "solid-js/jsx-runtime";
import "./app.css";
import "@fontsource-variable/inter/wght.css";
import { AppBar } from "./lib/components/app-bar";
import { createSignal, Match, onMount, Suspense, Switch } from "solid-js";
import Providers from "./lib/components/providers";
import { Toaster } from "solid-sonner";
import "~/lib/utils/dayjs-init";
import { LoadingScreen } from "./lib/components/custom-ui/loading-screen";
import { initialize } from "./lib/commands/init";

export function Layout(props: { children?: JSX.Element }) {
  const [initResult, setInitResult] = createSignal<Error | boolean>(false);

  onMount(() => {
    initialize()
      .then(() => setInitResult(true))
      .catch((err) => setInitResult(err));
  });

  return (
    <Providers>
      <Toaster closeButton richColors class="font-sans" />

      <Switch>
        <Match when={typeof initResult() !== "boolean"}>
          <span>Error occurred: {String(initResult())}</span>
        </Match>
        <Match when={initResult() === false}>
          <LoadingScreen text="Initializing..." />
        </Match>
        <Match when={initResult() === true}>
          <div class="flex flex-row w-dvw h-dvh">
            <AppBar />

            <div class="grow">
              <Suspense fallback={<LoadingScreen text="Loading page..." />}>{props.children}</Suspense>
            </div>
          </div>
        </Match>
      </Switch>
    </Providers>
  );
}
