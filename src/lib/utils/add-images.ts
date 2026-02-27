import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { setInputPrompt } from "../contexts/globals/prompt-input";
import { produce } from "solid-js/store";

export function mergePromptImagePaths(files: string[]) {
  if (files.length < 1) {
    return;
  }

  setInputPrompt(
    produce((item) => {
      const fileSet = new Set(files);

      if (!item.imagePaths) {
        item.imagePaths = Array.from(fileSet);
      } else {
        const existingFileSet = new Set(item.imagePaths);
        for (const file of fileSet) {
          existingFileSet.add(file);
        }

        item.imagePaths = Array.from(existingFileSet);
      }
    }),
  );
}

export async function launchPromptImageSelector() {
  const files = await openDialog({
    multiple: true,
    directory: false,
    canCreateDirectories: true,
    title: "Select images",
    filters: [
      {
        name: "Supported image format",
        extensions: ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "heif", "ico"],
      },
    ],
  });

  if (files && files.length > 0) {
    mergePromptImagePaths(files);
  }
}
