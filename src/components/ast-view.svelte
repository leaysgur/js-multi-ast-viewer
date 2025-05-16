<script lang="ts">
  type Props = { root: any };
  let { root }: Props = $props();

  const isObject = (value: any): value is object =>
    Object.prototype.toString.call(value) === "[object Object]";
  const isRange = (value: any): value is [number, number] =>
    Array.isArray(value) && value.length === 2 && value.every((v) => typeof v === "number");
  const isLoc = (
    value: any,
  ): value is { start: { line: number; column: number }; end: { line: number; column: number } } =>
    // prettier-ignore
    isObject(value) && "start" in value && "end" in value &&
    isObject(value.start) && "line" in value.start && "column" in value.start &&
    isObject(value.end) && "line" in value.end && "column" in value.end &&
    [value.start.line, value.start.column, value.end.line, value.end.column].every(
      (v) => typeof v === "number",
    );
</script>

<div class="pl-0">{@render view(root)}</div>

{#snippet view(node: any)}
  {#if isObject(node)}
    {@render token("{")}
    {#each Object.entries(node) as [key, value]}
      <div class="pl-4">
        {@render nodeKey(key)}{@render token(":")}

        <!-- Special handling for specific keys -->
        {#if key === "type"}
          {@render typeLeaf(value)}{@render token(",")}
        {:else if key === "range" && isRange(value)}
          {@render token("[")}
          {@render leaf(value[0])}{@render token(",")}
          {@render leaf(value[1])}
          {@render token("]")}{@render token(",")}
        {:else if key === "loc" && isLoc(value)}
          {@render token("{")}
          <div class="pl-4">
            {@render nodeKey("start")}{@render token(":")}}
            {@render token("{")}
            {@render nodeKey("line")}{@render token(":")}
            {@render leaf(value.start.line)}{@render token(",")}
            {@render nodeKey("column")}{@render token(":")}
            {@render leaf(value.start.column)}
            {@render token("}")}{@render token(",")}
          </div>
          <div class="pl-4">
            {@render nodeKey("end")}{@render token(":")}}
            {@render token("{")}
            {@render nodeKey("line")}{@render token(":")}
            {@render leaf(value.end.line)}{@render token(",")}
            {@render nodeKey("column")}{@render token(":")}
            {@render leaf(value.end.column)}
            {@render token("}")}{@render token(",")}
          </div>
          {@render token("}")}{@render token(",")}
        {:else if Array.isArray(value)}
          {#if value.length === 0}
            {@render token("[")}{@render token("]")}{@render token(",")}
          {:else}
            <!-- Handle brackets to NOT break between key and `[` -->
            {@render token("[")}
            {#each value as item}
              <div class="pl-4">{@render view(item)}</div>
            {/each}
            {@render token("]")}{@render token(",")}
          {/if}
        {:else if isObject(value)}
          {@render view(value)}
        {:else}
          {@render leaf(value)}{@render token(",")}
        {/if}
      </div>
    {/each}
    {@render token("}")}{@render token(",")}
  {:else}
    {console.error("Unreachable: AST root should be Object!", node)}
  {/if}
{/snippet}

{#snippet token(v: string)}
  <span>{v}</span>
{/snippet}
{#snippet nodeKey(v: string)}
  <span class="text-gray-300">{v}</span>
{/snippet}
{#snippet typeLeaf(v: any)}
  <span class="text-yellow-300">"{v}"</span>
{/snippet}
{#snippet leaf(v: any)}
  {#if typeof v === "string"}
    <span class="text-blue-300">{JSON.stringify(v)}</span>
  {:else if v instanceof RegExp}
    <span class="text-blue-300">{String(v)}</span>
  {:else if typeof v === "number"}
    <span class="text-green-300">{v}</span>
  {:else if typeof v === "bigint"}
    <span class="text-green-300">{v}n</span>
  {:else if typeof v === "boolean"}
    <span class="text-red-300">{String(v)}</span>
  {:else if typeof v === "undefined"}
    <span class="text-gray-400">undefined</span>
  {:else if v === null}
    <span class="text-gray-400">null</span>
  {:else}
    {console.error("Unreachable: Unknown leaf value", v)}
  {/if}
{/snippet}
