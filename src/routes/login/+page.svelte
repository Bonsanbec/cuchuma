<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<main>
  <section class="story-hero" aria-labelledby="login-title">
    <div>
      <p class="eyebrow">{$t('auth.loginEyebrow')}</p>
      <h1 id="login-title">{$t('auth.loginTitle')}</h1>
      <p class="lead">{$t('auth.loginLead')}</p>
    </div>
    <img class="hero-mark" src="/identity/kuchumá.png" alt={$t('cms.heroImageAlt')} />
  </section>
  {#if form?.message}<p class="notice error">{form.message.startsWith('auth.') || form.message.startsWith('errors.') ? $t(form.message) : form.message}</p>{/if}
  <form class="form-stack document-panel" method="POST">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>{$t('auth.email')} <input type="email" name="email" autocomplete="email" required /></label>
    <label>{$t('auth.password')} <input type="password" name="password" autocomplete="current-password" required /></label>
    <button type="submit">{$t('auth.enter')}</button>
    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-top: 0.5rem;">
      <a href="/recover" class="meta">{$t('auth.recoverAccess')}</a>
      <a href="/request-access" class="meta">{$t('auth.requestAccessLink')}</a>
    </div>
  </form>
</main>

