<script lang="ts">
  import { getParserImpl } from "../parsers";

  let {
    code,
    key,
    swap,
    remove,
    id,
  }: {
    code: string;
    key: string;
    swap: [left: null | (() => void), right: null | (() => void)];
    remove: () => void;
    id: number;
  } = $props();

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
</div>

<div
  class="h-full grid gap-2 content-start grid-rows-[max-content_max-content_max-content_max-content_minmax(0,_1fr)] overflow-hidden"
>
  <!-- 1. Header -->
  <div class="flex justify-between items-center">
    <div class="flex gap-2">
      <h2 class="text-lg font-bold">{key}</h2>
      <button class="cursor-pointer" popovertarget={key}>(?)</button>
    </div>
    <div>
      <button
        {...swap[0] === null ? { disabled: true } : { onclick: swap[0] }}
        class="py-0 px-1 cursor-pointer">SwapLeft</button
      >
      <button
        {...swap[1] === null ? { disabled: true } : { onclick: swap[1] }}
        class="py-0 px-1 cursor-pointer">SwapRight</button
      >
      <button onclick={remove} class="py-0 px-1 cursor-pointer text-white bg-orange-400"
        >Remove</button
      >
    </div>
  </div>
  <!-- 2. Options -->
  <details open>
    <summary>Options</summary>
    <textarea bind:value={options} class="w-full p-1 bg-white resize-none" rows={8}></textarea>
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
        <pre class="whitespace-pre-wrap text-pink-600">{JSON.stringify(errors, null, 2)}</pre>
      </details>
    {:else}
      <p>(Errors are not returned, they are just thrown as exceptions.)</p>
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
      <p class="text-red-500">Parser throws!</p>
      <pre class="text-red-500">{error}</pre>
    </div>
  {/await}
</div>
