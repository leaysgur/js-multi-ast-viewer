<script lang="ts">
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { parserKeys } from "./parsers";
  import ParserColumn from "./components/parser-column.svelte";

  // Parsers to compare
  let parsers = $state<{ id: number; key: string }[]>([]);
  // Temporary selected parser key
  let selectedDraft = $state<string>(parserKeys[0]);
  let id = 0;
  const addParser = () =>
    parsers.push({
      id: id++,
      key: $state.snapshot(selectedDraft),
    });
  const removeParser = (idx: number) => parsers.splice(idx, 1);
  const swapParser = (from: number, to: number) =>
    (parsers = parsers.map((_, idx) =>
      idx === from ? parsers[to] : idx === to ? parsers[from] : parsers[idx],
    ));

  const DEFAULT_CODE = `
// Code to compare...
import { parse } from "my-parser";
await parse("let a = 1");
`.trim();
  // Code string to be parsed
  let code = $state(DEFAULT_CODE);
  // Code string as draft, it will update `code` later
  let codeDraft = $state(DEFAULT_CODE);
  let timer: ReturnType<typeof setTimeout> | null = null;
  $effect(() => {
    if (timer) clearTimeout(timer);
    const v = $state.snapshot(codeDraft);
    timer = setTimeout(() => (code = v), 320);
  });

  onMount(() => addParser());
</script>

<main class="h-full grid grid-cols-[20%_minmax(0,_1fr)]">
  <!-- Left column -->
  <section class="h-full grid overflow-y-auto">
    <textarea bind:value={codeDraft} class="h-full p-1 resize-none" spellcheck="false"></textarea>
  </section>
  <!-- Right column -->
  <section class="h-full grid grid-rows-[max-content_minmax(0,_1fr)] overflow-y-hidden">
    <!-- Header -->
    <div class="flex justify-between items-center py-2 px-4 bg-zinc-600">
      <div class="flex">
        <select bind:value={selectedDraft} class="h-full py-2 px-2">
          {#each parserKeys as key}
            <option value={key}>{key}</option>
          {/each}
        </select>
        <button class="px-4 cursor-pointer bg-teal-800" onclick={addParser}>Add</button>
      </div>
      <a href="https://github.com/leaysgur/js-multi-ast-viewer" target="_blank">GitHub</a>
    </div>
    <!-- Parser columns -->
    <ul
      class="grid gap-x-2 grid-cols-[repeat(auto-fit,_minmax(0,_1fr))] px-4 py-2 overflow-y-hidden"
    >
      {#each parsers as { id, key }, idx (id)}
        <li animate:flip={{ duration: 160 }} class="overflow-y-hidden">
          <ParserColumn
            {code}
            {key}
            swap={[
              idx === 0 ? null : () => swapParser(idx, idx - 1),
              idx === parsers.length - 1 ? null : () => swapParser(idx, idx + 1),
            ]}
            remove={() => removeParser(idx)}
            {id}
          />
        </li>
      {/each}
    </ul>
  </section>
</main>
