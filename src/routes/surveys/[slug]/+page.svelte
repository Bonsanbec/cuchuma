<script lang="ts">
  let { data, form } = $props();
  let total = $derived(data.survey?._count.responses ?? 0);
</script>

<main>
  {#if data.survey}
    <h1>{data.survey.title}</h1>
    <p class="lead">{data.survey.question}</p>
    {#if form?.message}<p class="notice">{form.message}</p>{/if}
    <form class="form-stack" method="POST">
      <input type="hidden" name="csrf" value={data.csrf} />
      {#each data.survey.options as option}
        <label>
          <span><input type="radio" name="optionId" value={option.id} required /> {option.label}</span>
          {#if data.survey.resultsPublic}
            <span class="meta">{total ? Math.round((option._count.responses / total) * 100) : 0}% · {option._count.responses} votos</span>
          {/if}
        </label>
      {/each}
      <button type="submit">Votar</button>
    </form>
  {:else}
    <h1>Encuesta no disponible</h1>
  {/if}
</main>
