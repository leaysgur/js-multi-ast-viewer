<script lang="ts">
  import {
    parse as oxcParse,
    defaultOptions as oxcOptions,
    notes as oxcNotes,
  } from "./parsers/oxc";
  import {
    parse as tsestreeParse,
    defaultOptions as tsestreeOptions,
    notes as tsestreeNotes,
  } from "./parsers/typescript-estree";
  import {
    parse as acornParse,
    defaultOptions as acornOptions,
    notes as acornNotes,
  } from "./parsers//acorn";

  type Parser = {
    key: string;
    options: string;
  };

  const AVAILABLE_PARSERS: Parser[] = [
    {
      key: "oxc-parser",
      options: JSON.stringify(oxcOptions, null, 2),
    },
    {
      key: "acorn",
      options: JSON.stringify(acornOptions, null, 2),
    },
    {
      key: "typescript-estree",
      options: JSON.stringify(tsestreeOptions, null, 2),
    },
  ];

  let parsers = $state<Parser[]>([]);
  let selected = $state(structuredClone(AVAILABLE_PARSERS[0]));
  const addParser = () => parsers.push(structuredClone($state.snapshot(selected)));
  const removeParser = (idx: number) => parsers.splice(idx, 1);

  let code = $state(
    `
// Hello
const ast = ({x});
`.trim(),
  );

  const parse = ({ key, options }: Parser) => {
    console.count(key);
    if (key === "oxc-parser") return oxcParse(code, options);
    if (key === "acorn") return acornParse(code, options);
    if (key === "typescript-estree") return tsestreeParse(code, options);
    throw new Error("Unreachable!");
  };
  const getNotes = ({ key }: Parser) => {
    if (key === "oxc-parser") return oxcNotes;
    if (key === "acorn") return acornNotes;
    if (key === "typescript-estree") return tsestreeNotes;
    throw new Error("Unreachable!");
  };

  parsers = AVAILABLE_PARSERS; // DEBUG
</script>

<main class="h-full grid gap-x-4 grid-cols-[300px_minmax(0,_1fr)]">
  <section class="h-full grid overflow-y-auto">
    <textarea bind:value={code} class="h-full p-1 bg-white resize-none"></textarea>
  </section>

  <section class="h-full grid grid-rows-[min-content_1fr] overflow-y-hidden">
    <div class="flex py-2">
      <select bind:value={selected} class="px-2 bg-white">
        {#each AVAILABLE_PARSERS as item}
          <option value={item}>{item.key}</option>
        {/each}
      </select>
      <button class="py-2 px-4 cursor-pointer text-white bg-emerald-500" onclick={addParser}
        >Add</button
      >
    </div>

    <div class="grid gap-x-2 grid-cols-[repeat(auto-fit,_minmax(0,_1fr))] overflow-y-hidden">
      {#each parsers as _, idx}
        <div
          class="h-full grid gap-2 content-start grid-rows-[max-content_max-content_max-content_max-content_max-content_minmax(0,_1fr)] overflow-hidden"
        >
          <!-- 1. Header -->
          <div class="flex justify-between">
            <h2 class="text-lg font-bold">{parsers[idx].key}</h2>
            <button
              onclick={() => removeParser(idx)}
              class="py-0 px-1 cursor-pointer text-white bg-orange-400">Remove</button
            >
          </div>
          <!-- 2. Notes -->
          <details>
            <summary>Notes</summary>
            <pre class="whitespace-pre-wrap">{getNotes(parsers[idx])}</pre>
          </details>
          <!-- 3. Options -->
          <details open>
            <summary>Options</summary>
            <textarea
              bind:value={parsers[idx].options}
              class="w-full p-1 bg-white resize-none"
              rows={8}
            ></textarea>
          </details>
          <!-- 4. Errors -->
          <!-- 5. Comments -->
          <!-- 6. Program(scrollable) -->
          {#await parse(parsers[idx])}
            <p>...</p>
          {:then { errors, comments, program }}
            {#if errors !== null}
              <details open={errors.length !== 0}>
                <summary>Errors({errors.length})</summary>
                <pre class="whitespace-pre-wrap text-pink-600">{JSON.stringify(
                    errors,
                    null,
                    2,
                  )}</pre>
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
      {/each}
    </div>
  </section>
</main>
