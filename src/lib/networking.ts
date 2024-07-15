import { invoke } from "@tauri-apps/api/core"

let addr: string | null = null

export async function getAPIAddress(): Promise<string> {
  if (!addr) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if ((window as any).__TAURI__) {
      addr = (await invoke("get_attr")) as string
    } else {
      addr = window.location.hostname
    }
  }

  return addr
}
