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

<div>{@render view(root)}</div>

{#snippet view(node: any)}
  {#if isObject(node)}
    <span>{"{"}</span>
    {#each Object.entries(node) as [key, value]}
      <div class="pl-4">
        {@render nodeKey(key)}<span>:</span>

        <!-- Special handling for specific keys -->
        {#if key === "type"}
          {@render typeLeaf(value)}<span>,</span>
        {:else if key === "range" && isRange(value)}
          <span>[</span>
          {@render leaf(value[0])}<span>,</span>
          {@render leaf(value[1])}
          <span>]</span>
        {:else if key === "loc" && isLoc(value)}
          <span>{"{"}</span>
          <div class="pl-4">
            {@render nodeKey("start")}<span>:</span>
            <span>{"{"}</span>
            {@render nodeKey("line")}<span>:</span>
            {@render leaf(value.start.line)}<span>,</span>
            {@render nodeKey("column")}<span>:</span>
            {@render leaf(value.start.column)}
            <span>{"}"}</span><span>,</span>
          </div>
          <div class="pl-4">
            {@render nodeKey("end")}<span>:</span>
            <span>{"{"}</span>
            {@render nodeKey("line")}<span>:</span>
            {@render leaf(value.end.line)}<span>,</span>
            {@render nodeKey("column")}<span>:</span>
            {@render leaf(value.end.column)}
            <span>{"}"}</span><span>,</span>
          </div>
          <span>{"}"}</span><span>,</span>
        {:else if Array.isArray(value)}
          {#if value.length === 0}
            <span>[</span><span>]</span><span>,</span>
          {:else}
            <!-- Handle brackets to NOT break between key and `[` -->
            <span>[</span>
            {#each value as item}
              <div class="pl-4">{@render view(item)}</div>
            {/each}
            <span>]</span><span>,</span>
          {/if}
        {:else if isObject(value)}
          {@render view(value)}
        {:else}
          {@render leaf(value)}<span>,</span>
        {/if}
      </div>
    {/each}
    <span>{"}"}</span><span>,</span>
  {:else}
    {console.error("Unreachable: AST root should be Object!", node)}
  {/if}
{/snippet}

{#snippet nodeKey(v: any)}
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
