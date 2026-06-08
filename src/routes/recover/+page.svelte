<script lang="ts">
  let { data, form } = $props();
</script>

<main>
  <h1>Recuperar contraseña</h1>
  {#if form?.message}<p class="notice">{form.message}</p>{/if}
  <form class="form-stack" method="POST">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>Correo electrónico <input type="email" name="email" required /></label>
    <button type="submit">Generar recuperación</button>
  </form>
</main>
