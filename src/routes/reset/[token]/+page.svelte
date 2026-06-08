<script lang="ts">
  let { data, form } = $props();
</script>

<main>
  <h1>Nueva contraseña</h1>
  {#if form?.message}<p class="notice error">{form.message}</p>{/if}
  <form class="form-stack" method="POST">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>Contraseña <input type="password" name="password" minlength="12" required /></label>
    <button type="submit">Guardar contraseña</button>
  </form>
</main>
