<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<section class="section">
  <h1>{$t('admin.profile.title')}</h1>

  {#if form?.message}
    <p class="notice" class:error={form.message.startsWith('errors.') || form.message.startsWith('validation.')}>
      {form.message.startsWith('errors.') || form.message.startsWith('notifications.') || form.message.startsWith('validation.') ? $t(form.message, (form as any)?.params) : form.message}
    </p>
  {/if}

  <form class="form-stack card" method="POST">
    <input type="hidden" name="csrf" value={data.csrf} />
    
    <div class="two-col">
      <label>
        {$t('admin.profile.name')}
        <input name="name" value={data.user?.name ?? ''} required />
      </label>
      <label>
        {$t('admin.profile.email')}
        <input type="email" name="email" value={data.user?.email ?? ''} required />
      </label>
    </div>

    <hr style="border: 0; border-top: 1px solid var(--line); margin-block: 1rem;" />

    <p class="meta">
      {$t('auth.loginLead')}
    </p>

    <div class="two-col">
      <label>
        {$t('admin.profile.newPassword')}
        <input type="password" name="newPassword" minlength="12" />
      </label>
      <label>
        {$t('admin.profile.confirmPassword')}
        <input type="password" name="confirmPassword" minlength="12" />
      </label>
    </div>

    <label style="max-width: 28rem;">
      {$t('admin.profile.currentPassword')}
      <input type="password" name="currentPassword" />
    </label>

    <button type="submit" style="justify-self: start;">{$t('admin.profile.save')}</button>
  </form>
</section>
