<script lang="ts">
  import { getParserImpl } from "../parsers";

  type Props = {
    code: string;
    key: string;
    swap: [left: null | (() => void), right: null | (() => void)];
    remove: () => void;
    id: number;
  };
  let { code, key, swap, remove, id }: Props = $props();

  // NOTE: Break reactivity to use as default value
  const keySnapshot = $state.snapshot(key);
  const { parse, defaultOptions, notes } = getParserImpl(keySnapshot);

  let options = $state(JSON.stringify(defaultOptions(), null, 2));
  let resultsPromise = $derived.by(() => {
    console.count(`[${id}] ${keySnapshot}.parse()`);
    return parse(code, options);
  });
</script>

<div
  class="h-full grid gap-2 content-start grid-rows-[max-content_max-content_max-content_max-content_minmax(0,_1fr)] overflow-hidden"
>
  <!-- 1. Header -->
  <header class="flex justify-between items-center flex-wrap">
    <div class="flex gap-2 items-baseline">
      <h2 class="text-lg font-bold">{key}</h2>
      <button popovertarget={key} title="Show notes" class="px-1 cursor-pointer bg-zinc-400"
        >!</button
      >
    </div>
    <nav class="flex gap-2">
      <div class="flex gap-1">
        <button
          {...swap[0] === null
            ? {
                disabled: true,
                class: "cursor-not-allowed",
              }
            : {
                onclick: swap[0],
                title: "Swap left",
                class: "cursor-pointer bg-zinc-400 px-1",
              }}>←</button
        >
        <button
          {...swap[1] === null
            ? {
                disabled: true,
                class: "cursor-not-allowed",
              }
            : {
                onclick: swap[1],
                title: "Swap right",
                class: "cursor-pointer bg-zinc-400 px-1",
              }}>→</button
        >
      </div>
      <button onclick={remove} class="px-2 cursor-pointer bg-pink-800">Remove</button>
    </nav>
  </header>
  <!-- 2. Options -->
  <details open>
    <summary>Options</summary>
    <textarea bind:value={options} class="w-full p-1 resize-none" rows={8} spellcheck="false"
    ></textarea>
  </details>
  <!-- 3. Errors -->
  <!-- 4. Comments -->
  <!-- 5. Program(scrollable) -->
  {#await resultsPromise}
    <p>...</p>
  {:then { errors, comments, program }}
    {#if errors !== null}
      <details open={errors.length !== 0}>
        <summary>Errors({errors.length})</summary>
        <pre class="whitespace-pre-wrap text-pink-400">{JSON.stringify(errors, null, 2)}</pre>
      </details>
    {:else}
      <p class="text-zinc-300">(Errors are not returned, they are just thrown as exceptions.)</p>
    {/if}
    <details>
      <summary>Comments({comments.length})</summary>
      <pre class="whitespace-pre-wrap">{JSON.stringify(comments, null, 2)}</pre>
    </details>
    <details open class="overflow-y-auto">
      <summary>Program</summary>
      <!-- TODO: View for regex, bigint -->
      <pre>{JSON.stringify(program, null, 2)}</pre>
    </details>
  {:catch error}
    {console.error(error)}
    <div>
      <p>Parser throws!</p>
      <pre class="whitespace-pre-wrap text-pink-400">{error}</pre>
    </div>
  {/await}
</div>

<dialog
  popover
  id={key}
  class="w-1/2 mx-auto mt-16 p-8 open:grid open:gap-4 backdrop:backdrop-blur-xs"
>
  <h3 class="text-lg font-bold">Notes about `{key}`</h3>
  <ul class="list-disc list-inside">
    {#each notes as note}
      <li>{note}</li>
    {/each}
  </ul>
</dialog>
