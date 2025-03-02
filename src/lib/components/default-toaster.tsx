import { Toaster } from "solid-sonner";
import { useColorMode } from "../contexts/color-mode";

export function DefaultToaster() {
  const colorModeContext = useColorMode();
  const colorMode = colorModeContext?.preferredColorMode;

  return (
    <Toaster
      closeButton
      richColors
      class="font-sans-inter!"
      theme={colorMode?.()}
    />
  )
}
