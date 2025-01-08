<script lang="ts">
  import type { Role, TransmissionStatus } from "$lib/models/session"
  import { cn } from "$lib/utils"

  let { role, status }: {
    role: Role
    status: TransmissionStatus
  } = $props()

  const text: { [role: string]: { [status: string]: string } } = {
    user: {
      sent: "sent",
      "not sent": "failed",
    },
    assistant: {
      preparing: "processing",
      sending: "generating",
      sent: "generated",
      "not sent": "not completed",
    },
  }
</script>

<span
  class={cn(
    "uppercase font-light",
  )}
>
  {text[role]?.[status]}
</span>
