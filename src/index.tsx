/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { Layout } from "./layout";
import IndexPage from "./routes";
import { lazy } from "solid-js";
import "~/lib/utils/init";

render(
  () => (
    <Router root={Layout}>
      <Route path="/" component={IndexPage} />
      <Route path="/models" component={lazy(() => import("./routes/models"))} />
      <Route path="/settings" component={lazy(() => import("./routes/settings"))} />
    </Router>
  ),
  document.getElementById("root")!,
);
