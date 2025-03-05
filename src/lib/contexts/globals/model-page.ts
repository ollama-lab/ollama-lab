import { createSignal } from "solid-js";

const [currentModelPageModel, setCurrentModelPageModel] = createSignal<string | null>(null);

export { currentModelPageModel, setCurrentModelPageModel };
