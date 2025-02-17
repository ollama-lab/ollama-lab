import { open as openDialog } from "@tauri-apps/plugin-dialog"

export async function launchPromptImageSelector() {
  const files = await openDialog({
    multiple: true,
    directory: false,
    canCreateDirectories: true,
    title: "Select images",
    filters: [
      {
        name: "Images",
        extensions: ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "svg", "heif", "ico"],
      },
    ],
  })

  if (files && files.length > 0) {
  }
}
