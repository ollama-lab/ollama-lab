import { frontendState } from "$lib/stores/app-state"
import { defaultModel } from "$lib/stores/models"
import { sessions } from "$lib/stores/sessions"
import { settings } from "$lib/stores/settings"
import { initialize as initializeBackend } from "$lib/commands/init"

export async function initialize() {
  await settings.reload()
  await initializeBackend()
  await sessions.reload()
  await defaultModel.reload()

  frontendState.update(value => {
    value.initialized = true
    return value
  })
}
