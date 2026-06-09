<script lang="ts">
  import { t } from '$lib/i18n';
  import { canModerate, canAdmin } from '$lib/auth/permissions';
  let { data, children } = $props();
</script>

<main>
  <nav class="quicklinks" aria-label={$t('admin.title')}>
    <a href="/admin">{$t('admin.sidebar.dashboard')}</a>
    
    {#if canModerate(data.user?.role.level)}
      <a href="/admin/content">{$t('admin.sidebar.content')}</a>
    {/if}
    
    {#if data.user?.role.level === 'CONTRIBUTOR'}
      <a href="/admin/my-content">{$t('admin.sidebar.myContent')}</a>
    {/if}
    
    <a href="/admin/media">{$t('admin.sidebar.media')}</a>
    
    {#if canModerate(data.user?.role.level)}
      <a href="/admin/forms">{$t('admin.sidebar.forms')}</a>
      <a href="/admin/surveys">{$t('admin.sidebar.surveys')}</a>
      <a href="/admin/collections">{$t('admin.sidebar.collections')}</a>
    {/if}

    <a href="/admin/profile">{$t('admin.sidebar.profile')}</a>
    
    {#if canAdmin(data.user?.role.level)}
      <a href="/admin/settings">{$t('admin.sidebar.settings')}</a>
      <a href="/admin/users">{$t('admin.sidebar.users')}</a>
      <a href="/admin/stats">{$t('admin.sidebar.stats')}</a>
    {/if}
  </nav>
  {@render children()}
</main>

