import type { SvelteComponent } from "svelte";

export interface SidebarOption {
  id: string
  name: string
  icon?: SvelteComponent
}
