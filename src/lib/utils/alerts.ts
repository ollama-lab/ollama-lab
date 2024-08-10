import { getToastStore } from "@skeletonlabs/skeleton"

export function alertNoConnection() {
  getToastStore().trigger({
    message: "Failed to connect to Ollama. Please check if Ollama is running.",
  })
}
