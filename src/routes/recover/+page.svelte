<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<main>
  <h1>{$t('auth.recoverTitle')}</h1>
  {#if form?.message}<p class="notice">{form.message.startsWith('auth.') || form.message.startsWith('errors.') ? $t(form.message, form.params) : form.message}</p>{/if}
  <form class="form-stack document-panel" method="POST">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>{$t('auth.email')} <input type="email" name="email" required /></label>
    <button type="submit">{$t('auth.recoverButton')}</button>
  </form>
</main>

