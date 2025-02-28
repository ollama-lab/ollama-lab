<script lang="ts">
  import dayjs from "dayjs"

  let { date }: { date: Date } = $props()

  function updateTimeDelta() {
    return Math.floor((Date.now() - date.getTime()) / 1000)
  }

  let timerId: number | undefined = undefined

  let display = $state<string>(updateRelativeTime())

  function updateRelativeTime() {
    return dayjs(date).fromNow()
  }

  function getNextUpdateInterval() {
    const delta = updateTimeDelta()

    if (delta < 60) {
      return 1_000
    }

    if (delta < 3_600) {
      return 60_000
    }

    if (delta < 86_400) {
      return 3_600_000
    }

    return 86_400_000
  }

  function setRecursiveTimer() {
    timerId = setTimeout(() => {
      display = updateRelativeTime()
      setRecursiveTimer()
    }, getNextUpdateInterval())
  }

  $effect(() => {
    if (!timerId) {
      setRecursiveTimer()
    }

    return () => {
      clearTimeout(timerId)
      timerId = undefined
    }
  })
</script>

<span
  title={date.toLocaleString()}
>
  {display}
</span>
