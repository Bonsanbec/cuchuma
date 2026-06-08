<script lang="ts">
  let { data, form } = $props();
</script>

<main>
  <h1>Inicio de sesión</h1>
  {#if form?.message}<p class="notice error">{form.message}</p>{/if}
  <form class="form-stack" method="POST">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>Correo electrónico <input type="email" name="email" autocomplete="email" required /></label>
    <label>Contraseña <input type="password" name="password" autocomplete="current-password" required /></label>
    <button type="submit">Entrar</button>
    <a href="/recover">Recuperar contraseña</a>
  </form>
</main>
