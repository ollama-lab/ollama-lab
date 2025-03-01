/* @refresh reload */
import { render } from 'solid-js/web';
import { Route, Router } from "@solidjs/router";
import { Layout } from './layout';
import { IndexPage } from './routes';
import { ModelsPage } from './routes/models';
import { SettingsPage } from './routes/settings';

render(() => (
  <Router root={Layout}>
    <Route path="/" component={IndexPage} />
    <Route path="/models" component={ModelsPage} />
    <Route path="/settings" component={SettingsPage} />
  </Router>
), document.getElementById('root')!);
