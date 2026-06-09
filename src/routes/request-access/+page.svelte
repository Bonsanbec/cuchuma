<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<main>
  <section class="story-hero" aria-labelledby="request-title">
    <div>
      <p class="eyebrow">{$t('auth.loginEyebrow')}</p>
      <h1 id="request-title">{$t('auth.requestAccessTitle')}</h1>
      <p class="lead">{$t('auth.requestAccessLead')}</p>
    </div>
    <img class="hero-mark" src="/identity/kuchumá.png" alt={$t('cms.heroImageAlt')} />
  </section>

  {#if form?.message}
    <p class="notice" class:error={form.message.startsWith('errors.') || form.message.startsWith('validation.')}>
      {$t(form.message)}
    </p>
  {/if}

  {#if form?.message !== 'auth.requestAccessSuccess'}
    <form class="form-stack document-panel" method="POST">
      <input type="hidden" name="csrf" value={data.csrf} />
      <label>
        {$t('admin.profile.name')}
        <input name="name" required />
      </label>
      <label>
        {$t('admin.profile.email')}
        <input type="email" name="email" required />
      </label>
      <label>
        {$t('auth.requestAccessMotivation')}
        <textarea name="motivation" required></textarea>
      </label>
      <button type="submit">{$t('auth.requestAccessButton')}</button>
      <a href="/login">{$t('auth.backToLogin')}</a>
    </form>
  {:else}
    <div class="document-panel">
      <p><a class="button" href="/login">{$t('auth.backToLogin')}</a></p>
    </div>
  {/if}
</main>
