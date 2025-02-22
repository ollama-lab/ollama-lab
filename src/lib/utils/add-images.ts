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
      const fileSet = new Set(files)

      if (!item.imagePaths) {
        item.imagePaths = Array.from(fileSet)
      } else {
        const existingFileSet = new Set(item.imagePaths)
        for (const file of fileSet) {
          existingFileSet.add(file)
        }

        item.imagePaths = Array.from(existingFileSet)
      }

      return item
    })
  }
}
