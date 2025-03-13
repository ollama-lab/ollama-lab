/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { Layout } from "./layout";
import { lazy, Suspense } from "solid-js";
import "~/lib/utils/init";
import { LoadingScreen } from "./lib/components/custom-ui/loading-screen";

render(
  () => (
    <Suspense fallback={<LoadingScreen />}>
      <Router root={Layout}>
        <Route path="/" component={lazy(() => import("./routes/index"))} />
        <Route path="/models" component={lazy(() => import("./routes/models"))} />
        <Route path="/settings" component={lazy(() => import("./routes/settings"))} />
      </Router>
    </Suspense>
  ),
  document.getElementById("root")!,
);
