<script lang="ts">
  let { data, form } = $props();
</script>

<main>
  {#if data.form}
    <h1>{data.form.title}</h1>
    <p class="lead">{data.form.description}</p>
    {#if form?.message}<p class="notice">{form.message}</p>{/if}
    <form class="form-stack" method="POST" enctype="multipart/form-data">
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
    <h1>Formulario no disponible</h1>
  {/if}
</main>
