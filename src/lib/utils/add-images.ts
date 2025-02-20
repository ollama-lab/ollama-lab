import { inputPrompt } from "$lib/stores/prompt-input"
import { open as openDialog } from "@tauri-apps/plugin-dialog"

export async function launchPromptImageSelector() {
  const files = await openDialog({
    multiple: true,
    directory: false,
    canCreateDirectories: true,
    title: "Select images",
    filters: [
      {
        name: "Image format",
        extensions: ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "svg", "heif", "ico"],
      },
    ],
  })

  if (files && files.length > 0) {
    inputPrompt.update((item) => {
      if (!item.imagePaths) {
        item.imagePaths = files
      } else {
        item.imagePaths.push(...files)
      }

      return item
    })
  }
}
