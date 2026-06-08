<script lang="ts">
  import '../styles.css';
  import { dictionary, t } from '$lib/i18n';

  let { data, children } = $props();
  let isAdmin = $derived(data.pathname.startsWith('/admin'));

  // Sync server-side dictionary with client-side store
  $effect(() => {
    if (data.dictionary) {
      dictionary.set(data.dictionary);
    }
  });
</script>

<svelte:head>
  <title>{$t('cms.causeName')}</title>
  <meta name="description" content={$t('cms.problemSummary')} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class:admin-shell={isAdmin} class="shell">
  <header class:admin-topbar={isAdmin} class="topbar">
    <a class="brand" href="/" aria-label={$t('navigation.goToCover')}>
      <img src="/identity/kuchumá.png" alt="" />
      <span>{$t('navigation.brandName')}</span>
    </a>
    {#if isAdmin}
      <nav aria-label={$t('navigation.adminNav', { defaultValue: 'Navegación administrativa' })}>
        <a href="/">{$t('navigation.publicSite')}</a>
        <a href="/admin">{$t('navigation.adminPanel')}</a>
        {#if data.user}
          <form method="POST" action="/logout">
            <input type="hidden" name="csrf" value={data.csrf} />
            <button type="submit">{$t('navigation.logout')}</button>
          </form>
        {/if}
      </nav>
    {:else}
      <nav aria-label={$t('navigation.publicNav', { defaultValue: 'Navegación pública' })}>
        <a href="/#que-pasa">{$t('navigation.whatIsHappening')}</a>
        <a href="/#por-que-importa">{$t('navigation.whyItMatters')}</a>
        <a href="/archive">{$t('navigation.documented')}</a>
        <a href="/#memoria">{$t('navigation.memory')}</a>
        <a class="nav-action" href="/#ayudar">{$t('navigation.help')}</a>
      </nav>
    {/if}
  </header>
  {@render children()}
</div>

