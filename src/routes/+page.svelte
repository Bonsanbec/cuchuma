<script lang="ts">
  let { data } = $props();
</script>

<main>
  <section class="hero" aria-labelledby="home-title">
    <img src={data.home.heroImageUrl} alt={data.home.heroImageAlt} loading="eager" />
    <div class="actions">
      <h1 id="home-title">{data.home.causeName}</h1>
      <p class="lead">{data.home.problemSummary}</p>
      <p>{data.home.callToAction}</p>
      <div class="quicklinks" aria-label="Accesos principales">
        <a href="/archive?type=EVIDENCE">Evidencias</a>
        <a href="/archive?type=MEMORY">Recuerdos</a>
        <a href="/archive">Archivo documental</a>
        <a href="#forms">Formularios activos</a>
        <a href="#surveys">Encuestas activas</a>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="latest-title">
    <h2 id="latest-title">Archivo reciente</h2>
    <div class="grid">
      {#each data.latest as item}
        <article class="card">
          <h3>{item.title}</h3>
          <p class="meta">{item.type === 'EVIDENCE' ? 'Evidencia' : 'Recuerdo'} · {item.category?.name ?? 'Sin categoría'}</p>
          <p>{@html item.body}</p>
        </article>
      {:else}
        <p class="notice">El archivo público mostrará aquí los contenidos aprobados por moderación.</p>
      {/each}
    </div>
  </section>

  <section class="section" id="forms" aria-labelledby="forms-title">
    <h2 id="forms-title">Formularios activos</h2>
    <div class="grid">
      {#each data.forms as form}
        <a class="card" href={`/forms/${form.slug}`}>
          <h3>{form.title}</h3>
          <p>{form.description}</p>
        </a>
      {:else}
        <p class="notice">No hay formularios activos en este momento.</p>
      {/each}
    </div>
  </section>

  <section class="section" id="surveys" aria-labelledby="surveys-title">
    <h2 id="surveys-title">Encuestas activas</h2>
    <div class="grid">
      {#each data.surveys as survey}
        <a class="card" href={`/surveys/${survey.slug}`}>
          <h3>{survey.title}</h3>
          <p>{survey.question}</p>
        </a>
      {:else}
        <p class="notice">No hay encuestas activas en este momento.</p>
      {/each}
    </div>
  </section>

  <section class="section" aria-labelledby="collections-title">
    <h2 id="collections-title">Colecciones temáticas</h2>
    <div class="grid">
      {#each data.collections as collection}
        <a class="card" href={`/collections/${collection.slug}`}>
          <h3>{collection.title}</h3>
          <p>{collection.description}</p>
        </a>
      {:else}
        <p class="notice">Las colecciones publicadas aparecerán aquí.</p>
      {/each}
    </div>
  </section>
</main>
