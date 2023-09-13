<script lang="ts">
  import { tests } from './tests.js'

  let results = tests.map(() => false)

  const passed = (index: number) => {
    results = [...results.slice(0, index), true, ...results.slice(index + 1)]
  }
</script>

{#each tests as test, index}
  {@const id = index.toString()}
  <button
    on:click={() => {
      if (test(id)) {
        passed(index)
      }
    }}
    data-test-id={id}
  >
    {id}
  </button>
  {#if results[index]}
    <div>Passed: {id}</div>
  {/if}
{/each}
