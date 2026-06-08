<script lang="ts">
  let { data } = $props();
</script>

<main>
  <section class="story-hero" aria-labelledby="home-title">
    <div>
      <p class="eyebrow">Tecate · territorio vivo · memoria colectiva</p>
      <h1 id="home-title">El Cuchumá está siendo documentado.</h1>
      <p class="lead">{data.home.problemSummary}</p>
      <div class="hero-actions">
        <a class="button" href="#ayudar">Cómo ayudar</a>
        <a class="button secondary" href="/archive">Ver lo documentado</a>
      </div>
    </div>
    <div>
      <img class="hero-mark" src="/identity/kuchumá.png" alt="Silueta de El Cuchumá" loading="eager" />
      <div class="first-read" aria-label="Resumen esencial">
        <p class="field-note"><strong>Qué es.</strong><br />Montaña, referencia cultural y paisaje compartido de Tecate.</p>
        <p class="field-note"><strong>Qué pasa.</strong><br />La comunidad reúne pruebas, relatos y documentos sobre su situación actual.</p>
        <p class="field-note"><strong>Qué hacer.</strong><br />Leer, compartir, aportar memoria o sumarse a una acción abierta.</p>
      </div>
    </div>
  </section>

  <section class="section" id="que-pasa" aria-labelledby="what-title">
    <p class="eyebrow">Qué está pasando</p>
    <h2 id="what-title">Un lugar no se defiende si primero no se entiende.</h2>
    <p class="section-intro">Este portal reúne material verificable y memoria pública para que cualquier persona pueda comprender la situación de El Cuchumá sin conocer la estructura interna del archivo.</p>
    <div class="story-grid">
      <article class="story-panel urgent">
        <p class="meta">Situación actual</p>
        <h3>Documentar antes de que se pierda.</h3>
        <p>Fotografías, testimonios, notas y documentos se integran con moderación para sostener una memoria pública consultable.</p>
      </article>
      <article class="story-panel">
        <p class="meta">Archivo vivo</p>
        <h3>{data.counts.documented} registros publicados</h3>
        <p>Contenido revisado y organizado para lectura pública, no como una base de datos expuesta.</p>
      </article>
      <article class="story-panel">
        <p class="meta">Material resguardado</p>
        <h3>{data.counts.media} archivos multimedia</h3>
        <p>Imágenes, audio, video y documentos aportados o cargados por personas autorizadas.</p>
      </article>
    </div>
  </section>

  <section class="section" id="por-que-importa" aria-labelledby="why-title">
    <p class="eyebrow">Por qué importa</p>
    <h2 id="why-title">La montaña también es memoria.</h2>
    <div class="memory-grid">
      {#each data.reflections as reflection}
        <article class="memory-panel">
          <h3>{reflection.title}</h3>
          <p>{@html reflection.body}</p>
        </article>
      {:else}
        <article class="memory-panel">
          <h3>Territorio, identidad y permanencia</h3>
          <p>El Cuchumá forma parte de la vida regional: orienta el paisaje, sostiene recuerdos familiares y aparece en la conversación pública de Tecate.</p>
        </article>
        <article class="memory-panel">
          <h3>Documentar es cuidar</h3>
          <p>Registrar lo que ocurre permite que la historia no dependa de rumores, capturas sueltas o archivos perdidos.</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="section" id="documentado" aria-labelledby="doc-title">
    <p class="eyebrow">Qué se ha documentado</p>
    <h2 id="doc-title">Piezas recientes del archivo.</h2>
    <div class="story-grid">
      {#each data.latest as item}
        <article class="document-panel">
          <p class="meta">{item.category?.name ?? 'Registro público'}</p>
          <h3>{item.title}</h3>
          <p>{@html item.body}</p>
        </article>
      {:else}
        <p class="notice">El archivo público aparecerá aquí conforme se aprueben registros.</p>
      {/each}
    </div>
    <p><a class="button secondary" href="/archive">Entrar al archivo narrativo</a></p>
  </section>

  <section class="section" id="memoria" aria-labelledby="memory-title">
    <p class="eyebrow">Qué recuerdan las personas</p>
    <h2 id="memory-title">La defensa también se escribe en primera persona.</h2>
    <div class="memory-grid">
      {#each data.memories as memory}
        <article class="memory-panel">
          <h3>{memory.title}</h3>
          <p>{@html memory.body}</p>
        </article>
      {:else}
        <p class="notice">Los recuerdos aprobados por moderación se leerán aquí.</p>
      {/each}
    </div>
  </section>

  <section class="section" aria-labelledby="collections-title">
    <p class="eyebrow">Recorridos sugeridos</p>
    <h2 id="collections-title">Leer por historias, no por tablas.</h2>
    <div class="story-grid">
      {#each data.collections as collection}
        <a class="document-panel" href={`/collections/${collection.slug}`}>
          <h3>{collection.title}</h3>
          <p>{collection.description}</p>
        </a>
      {:else}
        <p class="notice">Pronto aparecerán recorridos temáticos publicados.</p>
      {/each}
    </div>
  </section>

  <section class="section" id="ayudar" aria-labelledby="help-title">
    <p class="eyebrow">Cómo puedo ayudar</p>
    <h2 id="help-title">Participar sin perderse en el sistema.</h2>
    <div class="story-grid">
      {#each data.forms as form}
        <a class="story-panel urgent" href={`/forms/${form.slug}`}>
          <p class="meta">Acción abierta</p>
          <h3>{form.title}</h3>
          <p>{form.description}</p>
        </a>
      {:else}
        <article class="story-panel urgent">
          <p class="meta">Participación</p>
          <h3>Comparte el portal.</h3>
          <p>Cuando no haya acciones abiertas, la forma más directa de ayudar es circular la información y resguardar memoria.</p>
        </article>
      {/each}
      {#each data.surveys as survey}
        <a class="story-panel" href={`/surveys/${survey.slug}`}>
          <p class="meta">Pregunta comunitaria</p>
          <h3>{survey.title}</h3>
          <p>{survey.question}</p>
        </a>
      {/each}
    </div>
  </section>
</main>
