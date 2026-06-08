<script lang="ts">
  let { data, form } = $props();
</script>

<main>
  <section class="story-hero" aria-labelledby="login-title">
    <div>
      <p class="eyebrow">Equipo del archivo</p>
      <h1 id="login-title">Acceso privado.</h1>
      <p class="lead">Este espacio es solo para quienes cuidan, revisan y publican el material del portal.</p>
    </div>
    <img class="hero-mark" src="/identity/kuchumá.png" alt="Silueta de El Cuchumá" />
  </section>
  {#if form?.message}<p class="notice error">{form.message}</p>{/if}
  <form class="form-stack document-panel" method="POST">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>Correo electrónico <input type="email" name="email" autocomplete="email" required /></label>
    <label>Contraseña <input type="password" name="password" autocomplete="current-password" required /></label>
    <button type="submit">Entrar</button>
    <a href="/recover">Recuperar acceso</a>
  </form>
</main>
