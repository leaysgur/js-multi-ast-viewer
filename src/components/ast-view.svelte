<script lang="ts">
  type Props = { root: any };
  let { root }: Props = $props();
</script>

<div>{@render view(root)}</div>

{#snippet view(node: any)}
  {#if Object.prototype.toString.call(node) === "[object Object]"}
    <span>{"{"}</span>
    {#each Object.entries(node) as [key, value]}
      <div class="pl-4">
        {@render nodeKey(key)}<span>:</span>
        {#if key === "type"}
          {@render typeLeaf(value)}<span>,</span>
        {:else if key === "range" && Array.isArray(value)}
          <span>[</span>
          {@render leaf(value[0])}<span>,</span>
          {@render leaf(value[1])}
          <span>]</span>
        {:else if Array.isArray(value)}
          {#if value.length === 0}
            <span>[</span><span>]</span><span>,</span>
          {:else}
            <span>[</span>
            {@render view(value)}
            <span>]</span><span>,</span>
          {/if}
        {:else}
          {@render view(value)}
        {/if}
      </div>
    {/each}
    <span>{"}"}</span><span>,</span>
  {:else if Array.isArray(node)}
    {#each node as item}
      <div class="pl-4">{@render view(item)}</div>
    {/each}
  {:else}
    {@render leaf(node)}<span>,</span>
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
    {console.error("Unknown type:", v)}
  {/if}
{/snippet}
