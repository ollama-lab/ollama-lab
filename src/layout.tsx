import { JSX } from "solid-js/jsx-runtime";
import "./app.css";
import "@fontsource-variable/inter/wght.css";
import { AppBar } from "./lib/components/app-bar";
import { Suspense } from "solid-js";
import { LoaderSpin } from "./lib/components/loader-spin";
import Providers from "./lib/components/providers";
import { Toaster } from "solid-sonner";

function LoadingScreen() {
  return (
    <div class="flex items-center place-content-center w-full h-full">
      <LoaderSpin text="Loading page..." />
    </div>
  );
}

export function Layout(props: { children?: JSX.Element }) {
  return (
    <Providers>
      <Toaster closeButton richColors class="font-sans" />

      <div class="flex flex-row w-dvw h-dvh">
        <AppBar />

        <div class="grow">
          <Suspense fallback={<LoadingScreen />}>{props.children}</Suspense>
        </div>
      </div>
    </Providers>
  );
}
