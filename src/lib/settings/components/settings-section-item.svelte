<script lang="ts">
  import { settingsSchema, type TypeDetail } from "$lib/settings/schema"
  import { en } from "$lib/settings/names/en"
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label"
  import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select"
  import { Input } from "$lib/components/ui/input"
  import { cn } from "$lib/utils"
  import { restartVotes, settings } from "$lib/stores/settings"

  const t = en

  let { key, subkey }: {
    key: string
    subkey: string
  } = $props()
  
  let schema = $derived(settingsSchema?.[key]?.[subkey] as TypeDetail | undefined)
  let id = $derived(`${key}.${subkey}`)
  let title = $derived(t[id])

  function getValue<T>(): T | undefined {
    // @ts-expect-error
    const cur = $settings?.[key]?.[subkey] as T | undefined
    if (cur === undefined || cur === null) {
      return schema?.default as T | undefined
    }

    return cur
  }

  function getEnumValue(): string | undefined {
    return getValue<string>()
  }

  function getBooleanValue(): boolean | undefined {
    return getValue<boolean>()
  }

  function getStringValue(): string | undefined {
    return getValue<string>()
  }

  function hasValueChanged(key: string, subkey: string): boolean {
    // @ts-expect-error
    const value = $settings?.[key]?.[subkey]
    return value !== schema?.default && value !== null
  }

  function updateValue(key: string, subkey: string, newValue: any) {
    // @ts-expect-error
    const prevValue = $settings?.[key]?.[subkey]
    if (newValue !== prevValue) {
      settings.setItem(key, subkey, newValue)
      if (schema?.needsRestart) {
        if ($restartVotes.has(id)) {
          if ($restartVotes.get(id) === newValue) {
            restartVotes.update(item => {
              item.delete(id)
              return item
            })
          }
        } else {
          restartVotes.update(item => {
            item.set(id, prevValue)
            return item
          })
        }
      }
    }
  }
</script>

<div class={cn(
  "px-2 py-2",
  hasValueChanged(key, subkey) && "border-l border-primary",
)}>
  {#if schema?.type === "boolean"}
    <div class="flex items-center gap-2">
      <Checkbox
        {id}
        bind:checked={() => getBooleanValue(), (newValue) => updateValue(key, subkey, newValue)}
      />
      <Label for={id}>{title}</Label>
    </div>
  {:else if schema?.type === "enum"}
    <div class="flex flex-col gap-2">
      <label for={id}>{title}</label>
      {#if !schema?.multiple}
        <Select
          type="single"
          bind:value={() => getEnumValue(), (newValue) => updateValue(key, subkey, newValue)}
        >
          <SelectTrigger>{getEnumValue()}</SelectTrigger>
          <SelectContent {id}>
            {#each schema.values as value}
              <SelectItem {value}>{value}</SelectItem>
            {/each}
          </SelectContent>
        </Select>
      {/if}
    </div>
  {:else if schema?.type === "string"}
    <div class="flex flex-col gap-2">
      <label for={id}>{title}</label>
      <Input
        {id}
        defaultvalue={getStringValue()}
        onblur={(ev) => {
          const value = ev.currentTarget.value
          updateValue(key, subkey, value === schema?.default ? null : value)
        }}
        placeholder={schema.default}
      />
    </div>
  {/if}

  {#if $restartVotes.has(id) && schema?.needsRestart}
    <span class="text-red-700 dark:text-red-400 text-sm">Restart needed for applying changes</span>
  {/if}
</div>
