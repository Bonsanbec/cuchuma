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
  <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
</svelte:head>

<div class:admin-shell={isAdmin} class="shell">
  <header class:admin-topbar={isAdmin} class="topbar">
    <a class="brand" href="/" aria-label={$t('navigation.goToCover')}>
      <img src="/identity/kuchumá.png" alt="" />
      <span>{$t('navigation.brandName')}</span>
    </a>
    {#if isAdmin}
      <nav aria-label={$t('navigation.adminNav', { defaultValue: 'Navegación administrativa' })}>
        <a href="/"><i class="bx bx-home" style="vertical-align: middle; font-size: 1.1rem;"></i> {$t('navigation.publicSite')}</a>
        <a href="/admin"><i class="bx bx-cog" style="vertical-align: middle; font-size: 1.1rem;"></i> {$t('navigation.adminPanel')}</a>
        {#if data.user}
          <form method="POST" action="/logout" style="margin: 0; display: inline-flex;">
            <input type="hidden" name="csrf" value={data.csrf} />
            <button type="submit" style="min-height: auto; padding: 0.38rem 0.75rem; font-size: 0.86rem; background: transparent; border-color: var(--line); color: var(--soil); font-weight: 700; border-radius: 999px;">
              <i class="bx bx-log-out" style="vertical-align: middle; font-size: 1.1rem;"></i> {$t('navigation.logout')}
            </button>
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

        <div style="border-left: 1px solid var(--line); height: 1.25rem; margin-inline: 0.50rem; align-self: center; display: inline-block;"></div>

        {#if data.user}
          <a href="/admin" class="nav-action" style="font-weight: 700;">
            <i class="bx bx-cog" style="font-size: 1.1rem; vertical-align: middle;"></i> {$t('navigation.adminPanel')}
          </a>
          <form method="POST" action="/logout" style="margin: 0; display: inline-flex;">
            <input type="hidden" name="csrf" value={data.csrf} />
            <button type="submit" style="min-height: auto; padding: 0.38rem 0.75rem; font-size: 0.86rem; background: transparent; border-color: var(--line); color: var(--soil); font-weight: 700; border-radius: 999px;">
              <i class="bx bx-log-out" style="font-size: 1.1rem; vertical-align: middle;"></i> {$t('navigation.logout')}
            </button>
          </form>
        {:else}
          <a href="/request-access" class="nav-action" style="font-weight: 700;">
            <i class="bx bx-user-plus" style="font-size: 1.1rem; vertical-align: middle;"></i> {$t('auth.requestAccessLink')}
          </a>
          <a href="/login" class="nav-action" style="background: var(--soil); color: var(--paper); font-weight: 700;">
            <i class="bx bx-log-in" style="font-size: 1.1rem; vertical-align: middle;"></i> {$t('navigation.login')}
          </a>
        {/if}
      </nav>
    {/if}
  </header>
  {@render children()}
  {#if !isAdmin}
    <footer class="section" style="margin-top: 4rem; border-top: 1px solid var(--line); padding-block: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
      <p class="meta">{$t('navigation.brandName')} · {$t('hero.eyebrow')}</p>
      <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
        <a class="meta" href="/login" style="display: inline-flex; align-items: center; gap: 0.25rem;">
          <i class="bx bx-lock-alt"></i> {$t('navigation.login')}
        </a>
        <a class="meta" href="/request-access" style="display: inline-flex; align-items: center; gap: 0.25rem;">
          <i class="bx bx-user-plus"></i> {$t('auth.requestAccessLink')}
        </a>
      </div>
    </footer>
  {/if}
</div>

