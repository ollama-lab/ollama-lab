import { createSignal } from "solid-js";

export const [currentModel, setCurrentModel] = createSignal<string | null>(null);
