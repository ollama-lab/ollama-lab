import { createSignal } from "solid-js";

const [selectedSessionAgent, setSelectedSessionAgent] = createSignal<number>();

export { selectedSessionAgent, setSelectedSessionAgent };
