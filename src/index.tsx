/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

import("~/lib/utils/init");

render(
  () => (
    <Router root={lazy(() => import("./layout"))}>
      <Route path="/" component={lazy(() => import("./routes/index"))} />
      <Route path="/models" component={lazy(() => import("./routes/models"))} />
      <Route path="/settings" component={lazy(() => import("./routes/settings"))} />
      <Route path="/agent-templates" component={lazy(() => import("./routes/agent-templates"))} />
      <Route path="/h2h" component={lazy(() => import("./routes/h2h"))} />
    </Router>
  ),
  document.getElementById("root")!,
);
