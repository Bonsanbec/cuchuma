<script lang="ts">
  import { t } from '$lib/i18n';
  let { children } = $props();
</script>

<main>
  <nav class="quicklinks" aria-label={$t('admin.title')}>
    <a href="/admin">{$t('admin.sidebar.dashboard')}</a>
    <a href="/admin/content">{$t('admin.sidebar.content')}</a>
    <a href="/admin/media">{$t('admin.sidebar.media')}</a>
    <a href="/admin/forms">{$t('admin.sidebar.forms')}</a>
    <a href="/admin/surveys">{$t('admin.sidebar.surveys')}</a>
    <a href="/admin/collections">{$t('admin.sidebar.collections')}</a>
    <a href="/admin/settings">{$t('admin.sidebar.settings')}</a>
    <a href="/admin/users">{$t('admin.sidebar.users')}</a>
    <a href="/admin/stats">{$t('admin.sidebar.stats')}</a>
  </nav>
  {@render children()}
</main>

