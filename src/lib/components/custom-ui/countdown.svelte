<script lang="ts">
  let { seconds = $bindable(), expireAt, onExpire }: {
    seconds: number
    expireAt: Date
    onExpire?: () => void
  } = $props()

  let expireTimerId: number | undefined = undefined

  function countdown() {
    seconds = Math.floor((expireAt.getTime() - Date.now()) / 1000)
  }

  $effect(() => {
    if (!expireTimerId) {
      countdown()
      expireTimerId = setInterval(() => {
        if (seconds <= 0) {
          onExpire?.()
          clearInterval(expireTimerId)
          expireTimerId = undefined
        }

        countdown()
      })
    }

    return () => {
      clearInterval(expireTimerId)
      expireTimerId = undefined
    }
  })
</script>

<span>{seconds}</span>
