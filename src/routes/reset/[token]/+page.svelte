<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<main>
  <h1>{$t('auth.resetTitle')}</h1>
  {#if form?.message}<p class="notice error">{form.message.startsWith('auth.') || form.message.startsWith('errors.') || form.message.startsWith('validation.') ? $t(form.message, (form as any)?.params) : form.message}</p>{/if}
  <form class="form-stack document-panel" method="POST">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>{$t('auth.password')} <input type="password" name="password" minlength="12" required /></label>
    <button type="submit">{$t('auth.resetButton')}</button>
  </form>
</main>

