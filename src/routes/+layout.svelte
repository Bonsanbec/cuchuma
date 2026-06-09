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
        {#if data.menu && data.menu.length > 0}
          {#each data.menu as item}
            <a href={item.href} class={item.href === '/#ayudar' || item.href === '/contribute' ? 'nav-action' : ''}>
              {$t('menu.' + item.id, { defaultValue: item.label })}
            </a>
          {/each}
        {:else}
          <a href="/#que-pasa">{$t('navigation.whatIsHappening')}</a>
          <a href="/#por-que-importa">{$t('navigation.whyItMatters')}</a>
          <a href="/archive">{$t('navigation.documented')}</a>
          <a href="/#memoria">{$t('navigation.memory')}</a>
          <a class="nav-action" href="/#ayudar">{$t('navigation.help')}</a>
        {/if}
      </nav>
    {/if}
  </header>
  {@render children()}
  {#if !isAdmin}
    <footer class="section" style="margin-top: 4rem; border-top: 1px solid var(--line); padding-block: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
      <p class="meta">{$t('navigation.brandName')} · {$t('hero.eyebrow')}</p>
      <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
        <a class="meta" href="/login">{$t('navigation.login')}</a>
        <a class="meta" href="/request-access">{$t('auth.requestAccessLink')}</a>
      </div>
    </footer>
  {/if}
</div>

