import { Toaster } from "solid-sonner";
import { preferredColorMode } from "../contexts/globals/color-mode";

export function DefaultToaster() {
  return <Toaster closeButton richColors class="font-sans-inter!" theme={preferredColorMode()} />;
}
