import { createSignal } from "solid-js";
import { isDev } from "solid-js/web";

const [devModeEnabled, setDevModeEnabled] = createSignal(isDev);

export { devModeEnabled, setDevModeEnabled };
