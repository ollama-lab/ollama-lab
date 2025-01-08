<script lang="ts">
  let { date }: {
    date: Date
  } = $props()
</script>

<span>{date.toLocaleString()}</span>
