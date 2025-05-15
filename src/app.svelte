<script lang="ts">
  import { flip } from "svelte/animate";
  import { parserKeys } from "./parsers";
  import ParserColumn from "./components/parser-column.svelte";

  let id = 0;

  let parsers = $state<{ id: number; key: string }[]>([]);
  let selected = $state<string>(parserKeys[0]);
  const addParser = () =>
    parsers.push({
      id: id++,
      key: $state.snapshot(selected),
    });
  const removeParser = (idx: number) => parsers.splice(idx, 1);
  const swapParser = (from: number, to: number) =>
    (parsers = parsers.map((_, idx) =>
      idx === from ? parsers[to] : idx === to ? parsers[from] : parsers[idx],
    ));

  let code = $state(
    `
// Hello
const ast = ({x});
`.trim(),
  );

  // DEBUG
  addParser();
  selected = parserKeys[1];
  addParser();
  selected = parserKeys[2];
  addParser();
</script>

<main class="h-full grid gap-x-4 grid-cols-[300px_minmax(0,_1fr)]">
  <section class="h-full grid overflow-y-auto">
    <textarea bind:value={code} class="h-full p-1 bg-white resize-none"></textarea>
  </section>

  <section class="h-full grid grid-rows-[min-content_1fr] overflow-y-hidden">
    <div class="flex py-2">
      <select bind:value={selected} class="px-2 bg-white">
        {#each parserKeys as key}
          <option value={key}>{key}</option>
        {/each}
      </select>
      <button class="py-2 px-4 cursor-pointer text-white bg-emerald-500" onclick={addParser}
        >Add</button
      >
    </div>

    <ul class="grid gap-x-2 grid-cols-[repeat(auto-fit,_minmax(0,_1fr))] overflow-y-hidden">
      {#each parsers as { id, key }, idx (id)}
        <li animate:flip={{ duration: 160 }} class="overflow-y-hidden">
          <ParserColumn
            {id}
            {key}
            {code}
            swapLeft={idx === 0 ? null : () => swapParser(idx, idx - 1)}
            swapRight={idx === parsers.length - 1 ? null : () => swapParser(idx, idx + 1)}
            remove={() => removeParser(idx)}
          />
        </li>
      {/each}
    </ul>
  </section>
</main>
