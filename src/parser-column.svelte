<script lang="ts">
  import { getParser } from "./parsers";

  let {
    id,
    key,
    code,
    swapRight,
    swapLeft,
    removeParser,
  }: {
    id: number;
    key: string;
    code: string;
    swapRight: null | (() => void);
    swapLeft: null | (() => void);
    removeParser: () => void;
  } = $props();

  // NOTE: Break reactivity to use as default value
  const keySnapshot = $state.snapshot(key);
  const { parse, defaultOptions, notes } = getParser(keySnapshot);

  let options = $state(JSON.stringify(defaultOptions(), null, 2));
  let resultsPromise = $derived.by(() => {
    console.count(`[${id}] ${keySnapshot}.parse()`);
    return parse(code, options);
  });
</script>

<div
  class="h-full grid gap-2 content-start grid-rows-[max-content_max-content_max-content_max-content_max-content_minmax(0,_1fr)] overflow-hidden"
>
  <!-- 1. Header -->
  <div class="flex justify-between">
    <h2 class="text-lg font-bold">{key}</h2>
    <div>
      <button
        {...swapLeft === null ? { disabled: true } : { onclick: swapLeft }}
        class="py-0 px-1 cursor-pointer">SwapLeft</button
      >
      <button
        {...swapRight === null ? { disabled: true } : { onclick: swapRight }}
        class="py-0 px-1 cursor-pointer">SwapRight</button
      >
      <button onclick={removeParser} class="py-0 px-1 cursor-pointer text-white bg-orange-400"
        >Remove</button
      >
    </div>
  </div>
  <!-- 2. Notes -->
  <details>
    <summary>Notes</summary>
    <pre class="whitespace-pre-wrap">{notes}</pre>
  </details>
  <!-- 3. Options -->
  <details open>
    <summary>Options</summary>
    <textarea bind:value={options} class="w-full p-1 bg-white resize-none" rows={8}></textarea>
  </details>
  <!-- 4. Errors -->
  <!-- 5. Comments -->
  <!-- 6. Program(scrollable) -->
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
