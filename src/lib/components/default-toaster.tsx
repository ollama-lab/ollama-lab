import { Toaster } from "solid-sonner";
import { useColorMode } from "../contexts/color-mode";

export function DefaultToaster() {
  const [colorMode,] = useColorMode();

  return (
    <Toaster
      closeButton
      richColors
      class="font-sans-inter!"
      theme={colorMode}
    />
  )
}
