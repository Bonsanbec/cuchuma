<script lang="ts">
  import { t } from '$lib/i18n';
  import { canModerate, canAdmin } from '$lib/auth/permissions';
  let { data, children } = $props();
</script>

<main>
  <nav class="quicklinks" aria-label={$t('admin.title')}>
    <a href="/admin">
      <i class="bx bx-grid-alt" style="font-size: 1.2rem; vertical-align: middle; margin-right: 0.25rem;"></i>
      {$t('admin.sidebar.dashboard')}
    </a>
    
    {#if canModerate(data.user?.role.level)}
      <a href="/admin/content" style="position: relative; display: inline-flex; align-items: center; justify-content: space-between; width: 100%;">
        <span>
          <i class="bx bx-file" style="font-size: 1.2rem; vertical-align: middle; margin-right: 0.25rem;"></i>
          {$t('admin.sidebar.content')}
        </span>
        {#if data.pendingContentCount > 0}
          <span class="notification-badge">{data.pendingContentCount}</span>
        {/if}
      </a>
    {/if}
    
    {#if data.user?.role.level === 'CONTRIBUTOR'}
      <a href="/admin/my-content">
        <i class="bx bx-detail" style="font-size: 1.2rem; vertical-align: middle; margin-right: 0.25rem;"></i>
        {$t('admin.sidebar.myContent')}
      </a>
    {/if}
    
    <a href="/admin/media">
      <i class="bx bx-images" style="font-size: 1.2rem; vertical-align: middle; margin-right: 0.25rem;"></i>
      {$t('admin.sidebar.media')}
    </a>
    
    {#if canModerate(data.user?.role.level)}
      <a href="/admin/forms">
        <i class="bx bx-list-ul" style="font-size: 1.2rem; vertical-align: middle; margin-right: 0.25rem;"></i>
        {$t('admin.sidebar.forms')}
      </a>
      <a href="/admin/surveys">
        <i class="bx bx-poll" style="font-size: 1.2rem; vertical-align: middle; margin-right: 0.25rem;"></i>
        {$t('admin.sidebar.surveys')}
      </a>
      <a href="/admin/collections">
        <i class="bx bx-folder-open" style="font-size: 1.2rem; vertical-align: middle; margin-right: 0.25rem;"></i>
        {$t('admin.sidebar.collections')}
      </a>
    {/if}

    <a href="/admin/profile">
      <i class="bx bx-user" style="font-size: 1.2rem; vertical-align: middle; margin-right: 0.25rem;"></i>
      {$t('admin.sidebar.profile')}
    </a>
    
    {#if canAdmin(data.user?.role.level)}
      <a href="/admin/settings">
        <i class="bx bx-cog" style="font-size: 1.2rem; vertical-align: middle; margin-right: 0.25rem;"></i>
        {$t('admin.sidebar.settings')}
      </a>
      <a href="/admin/users" style="position: relative; display: inline-flex; align-items: center; justify-content: space-between; width: 100%;">
        <span>
          <i class="bx bx-group" style="font-size: 1.2rem; vertical-align: middle; margin-right: 0.25rem;"></i>
          {$t('admin.sidebar.users')}
        </span>
        {#if data.pendingRequestsCount > 0}
          <span class="notification-badge">{data.pendingRequestsCount}</span>
        {/if}
      </a>
      <a href="/admin/stats">
        <i class="bx bx-bar-chart-alt-2" style="font-size: 1.2rem; vertical-align: middle; margin-right: 0.25rem;"></i>
        {$t('admin.sidebar.stats')}
      </a>
    {/if}
  </nav>
  {@render children()}
</main>

