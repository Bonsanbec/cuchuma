<script lang="ts">
  let { data, form } = $props();
</script>

<main>
  {#if data.form}
    <section class="story-hero" aria-labelledby="form-title">
      <div>
        <p class="eyebrow">Acción abierta</p>
        <h1 id="form-title">{data.form.title}</h1>
        <p class="lead">{data.form.description}</p>
      </div>
      <img class="hero-mark" src="/identity/kuchumá.png" alt="Silueta de El Cuchumá" />
    </section>
    {#if form?.message}<p class="notice">{form.message}</p>{/if}
    <form class="form-stack document-panel" method="POST" enctype="multipart/form-data">
      <input type="hidden" name="csrf" value={data.csrf} />
      {#each data.form.fields as field}
        <label>{field.label}
          {#if field.type === 'LONG_TEXT'}
            <textarea name={field.id} required={field.required}></textarea>
          {:else if field.type === 'SINGLE_CHOICE'}
            <select name={field.id} required={field.required}>
              <option value="">Selecciona una opción</option>
              {#each field.options as option}<option value={option}>{option}</option>{/each}
            </select>
          {:else if field.type === 'MULTIPLE_CHOICE'}
            {#each field.options as option}
              <span><input type="checkbox" name={field.id} value={option} /> {option}</span>
            {/each}
          {:else if field.type === 'EMAIL'}
            <input type="email" name={field.id} required={field.required} />
          {:else if field.type === 'ATTACHMENT'}
            <input type="file" name={field.id} required={field.required} />
          {:else}
            <input name={field.id} required={field.required} />
          {/if}
        </label>
      {/each}
      <button type="submit">Enviar</button>
    </form>
  {:else}
    <h1>Acción no disponible</h1>
  {/if}
</main>
