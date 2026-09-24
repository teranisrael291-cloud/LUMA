(() => {
  const state = { token: sessionStorage.getItem('luma_admin_token') || '', candidate: null, published: null, selected: new Set(), filter: 'ALL', editingId: null };
  const $ = (s) => document.querySelector(s);
  const loginPanel = $('#login-panel'), app = $('#editor-app'), list = $('#candidate-list'), editor = $('#trend-editor');
  const status = (msg, error = false) => { const el = $('#action-status'); el.textContent = msg; el.style.color = error ? '#b5522b' : ''; };
  const esc = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  async function api(path, options = {}) {
    const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.token}`, ...(options.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    return data;
  }

  function editorialToInputs() {
    const ed = state.candidate?.editorial || {};
    $('#ed-eyebrow').value = ed.eyebrow || 'LUMA / PULSE'; $('#ed-headline').value = ed.headline || ''; $('#ed-deck').value = ed.deck || '';
  }
  function inputsToEditorial() {
    state.candidate.editorial = { eyebrow: $('#ed-eyebrow').value.trim(), headline: $('#ed-headline').value.trim(), deck: $('#ed-deck').value.trim() };
  }

  function renderPublished() {
    const p = state.published; const el = $('#published-summary');
    if (!p) { el.textContent = 'Todavía no hay una edición publicada en Blob.'; return; }
    el.innerHTML = `<div><span>${esc(p.meta?.issue || '')} · ${esc(p.meta?.updated || '')}</span><br><b>${esc(p.editorial?.headline || 'LUMA Pulse')}</b><br><span>${p.trends?.length || 0} señales publicadas</span></div><a class="external-link" href="pulse.html" target="_blank">Ver edición</a>`;
  }

  function renderEngine() {
    const p = state.candidate?.meta?.pipeline || {};
    const summary = $('#engine-summary');
    const stats = [
      ['Sources', p.sources ?? '—'], ['Healthy', p.sourcesOk ?? '—'], ['Raw items', p.rawItems ?? '—'],
      ['Normalized', p.normalizedItems ?? '—'], ['Clusters', p.clusters ?? '—'], ['Candidates', p.candidates ?? state.candidate?.trends?.length ?? '—']
    ];
    const roles = state.candidate?.meta?.roleHealth || {};
    summary.innerHTML = `<div class="engine-stats-grid">${stats.map(([label,value]) => `<div class="engine-stat"><b>${esc(value)}</b><span>${esc(label)}</span></div>`).join('')}</div><div class="engine-role-strip">${Object.entries(roles).map(([role,v])=>`<span><b>${esc(role)}</b>${esc(v.healthy)}/${esc(v.total)} healthy · ${esc(v.items)} items</span>`).join('')}</div>`;
    const health = $('#source-health'); const catalog = state.candidate?.sources || []; const byId = new Map((state.candidate?.sourceHealth || []).map(x => [x.id,x]));
    health.innerHTML = catalog.map(src => { const h=byId.get(src.id); const cls=h?.ok?'ok':h?'fail':''; return `<div class="source-row ${cls}"><span class="source-dot"></span><span>${esc(src.name)}<br><small>${esc(src.region)} · ${esc(src.type)}</small></span><small>${h ? (h.ok ? `${h.count} items · ${h.ms}ms` : esc(h.error||'failed')) : 'catalog'}</small></div>`; }).join('');
  }

  function matches(t) {
    if (state.filter === 'ALL') return true;
    if (['MX','LATAM','GLOBAL'].includes(state.filter)) return t.region === state.filter;
    return t.audience === state.filter || t.audience === 'Both';
  }

  function renderList() {
    const trends = (state.candidate?.trends || []).filter(matches);
    $('#selection-count').textContent = state.selected.size;
    list.innerHTML = trends.length ? trends.map(t => `<article class="candidate-card ${state.selected.has(t.id)?'selected':''}" data-id="${esc(t.id)}">
      <input class="candidate-check" type="checkbox" aria-label="Seleccionar ${esc(t.title)}" ${state.selected.has(t.id)?'checked':''}>
      <div class="candidate-copy"><div class="candidate-meta"><span>${esc(t.region)}</span><span>${esc(t.segment)}</span><span>${esc(t.audience || 'Both')}</span><span>${esc(t.archetype || t.stage)}</span></div><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p><div class="candidate-source">${esc(t.source)} · ${esc(t.metric)}</div></div>
      <div class="candidate-score"><b>${Number(t.score)||0}</b><small>${Number(t.confidence)||0}% conf.</small><button type="button" class="edit-trend">Editar</button></div></article>`).join('') : '<div class="empty-editor">No hay señales en este filtro.</div>';
    list.querySelectorAll('.candidate-card').forEach(card => {
      const id = card.dataset.id;
      card.querySelector('.candidate-check').addEventListener('change', e => { e.target.checked ? state.selected.add(id) : state.selected.delete(id); renderList(); });
      card.querySelector('.edit-trend').addEventListener('click', () => openEditor(id));
    });
  }

  function openEditor(id) {
    const t = state.candidate.trends.find(x => x.id === id); if (!t) return; state.editingId = id;
    editor.innerHTML = `<form class="trend-form" id="trend-form"><div class="trend-form-head"><div><span class="admin-kicker">EDIT SIGNAL</span><h3>${esc(t.title)}</h3></div><button type="button" id="close-editor" aria-label="Cerrar"><span class="close-glyph" aria-hidden="true"></span></button></div>
      <div class="trend-form-grid">
        <label class="wide">Title<input name="title" value="${esc(t.title)}"></label><label class="wide">Kicker<input name="kicker" value="${esc(t.kicker)}"></label>
        <label>Region<select name="region"><option ${t.region==='MX'?'selected':''}>MX</option><option ${t.region==='LATAM'?'selected':''}>LATAM</option><option ${t.region==='GLOBAL'?'selected':''}>GLOBAL</option></select></label>
        <label>Audience<select name="audience"><option ${t.audience==='Gen Z'?'selected':''}>Gen Z</option><option ${t.audience==='Millennials'?'selected':''}>Millennials</option><option ${t.audience==='Both'?'selected':''}>Both</option></select></label>
        <label>Stage<select name="stage">${['Spark','Rising','Accelerating','Building','Mainstream','Cooling'].map(x=>`<option ${t.stage===x?'selected':''}>${x}</option>`).join('')}</select></label>
        <label>Horizon<select name="archetype">${['Cultural moment','Emerging trend','Structural shift'].map(x=>`<option ${t.archetype===x?'selected':''}>${x}</option>`).join('')}</select></label>
        <label>LUMA score<input name="score" type="number" min="0" max="100" value="${Number(t.score)||0}"></label>
        <label class="wide">Audience rationale<textarea name="audienceWhy" rows="2">${esc(t.audienceWhy)}</textarea></label>
        <label class="wide">Summary<textarea name="summary" rows="4">${esc(t.summary)}</textarea></label>
        <label class="wide">Why it matters<textarea name="impact" rows="4">${esc(t.impact)}</textarea></label>
        <label class="wide">Creator territory<input name="creator" value="${esc(t.creator)}"></label>
        <label class="wide">Watch-out<textarea name="watchout" rows="3">${esc(t.watchout)}</textarea></label>
        <label>Observed metric<input name="metric" value="${esc(t.metric)}"></label><label>Metric label<input name="metricLabel" value="${esc(t.metricLabel)}"></label>
        <label>Source<input name="source" value="${esc(t.source)}"></label><label>Platform<input name="platform" value="${esc(t.platform)}"></label>
        <label class="wide">Source URL<input name="sourceUrl" type="url" value="${esc(t.sourceUrl)}"></label>
      </div>
      <div class="inline-note model-trace"><b>ML/NLP trace</b><span>momentum ${esc(t.model?.momentum ?? '—')}</span><span>evidence ${esc(t.model?.evidence ?? '—')}</span><span>agreement ${esc(t.model?.agreement ?? '—')}</span><span>burst ${esc(t.model?.burst ?? '—')}</span><span>persistence ${esc(t.model?.persistence ?? '—')}</span><span>novelty ${esc(t.model?.novelty ?? '—')}</span><span>whitespace ${esc(t.model?.whitespace ?? '—')}</span><span>velocity ${esc(t.model?.velocity ?? '—')}</span><span>age ${esc(t.model?.ageDays ?? '—')}d</span><span>confidence ${esc(t.confidence ?? '—')}%</span></div>
      <div class="inline-note" style="margin-top:8px"><b>Evidence:</b> ${(t.evidence||[]).slice(0,4).map(e=>`<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.source)}</a>`).join(' · ') || 'No evidence trace stored.'}</div><button class="admin-primary" style="margin-top:16px" type="submit">Aplicar cambios</button></form>`;
    $('#close-editor').addEventListener('click', () => { state.editingId = null; editor.innerHTML = '<div class="empty-editor"><span class="icon-signal" aria-hidden="true"></span><p>Selecciona “Editar” en una señal para ajustar su narrativa antes de publicar.</p></div>'; });
    $('#trend-form').addEventListener('submit', e => {
      e.preventDefault(); const f = new FormData(e.currentTarget);
      ['title','kicker','region','audience','stage','archetype','audienceWhy','summary','impact','creator','watchout','metric','metricLabel','source','platform','sourceUrl'].forEach(k => t[k] = String(f.get(k)||'').trim());
      t.score = Math.max(0, Math.min(100, Number(f.get('score')) || 0)); t.regionLabel = t.region === 'MX' ? 'México' : t.region === 'LATAM' ? 'Latinoamérica' : 'Global';
      renderList(); status(`Cambios aplicados a “${t.title}”. Guarda el borrador para persistirlos.`);
    });
  }

  async function load() {
    try {
      const data = await api('/api/admin'); state.candidate = data.candidate || data.published; state.published = data.published;
      $('#storage-status').textContent = data.storageReady ? 'Blob connected' : 'Blob not configured'; $('#storage-status').className = `status-pill ${data.storageReady?'ok':'warn'}`;
      $('#candidate-status').textContent = state.candidate ? `${state.candidate.trends.length} candidates · ${state.candidate.meta?.issue || ''}` : 'No candidate';
      if (state.candidate) { const initial = state.candidate.trends.slice(0, Math.min(6, state.candidate.trends.length)); state.selected = new Set(initial.map(x => x.id)); }
      editorialToInputs(); renderList(); renderPublished(); renderEngine(); loginPanel.hidden = true; app.hidden = false;
    } catch (error) { sessionStorage.removeItem('luma_admin_token'); state.token=''; loginPanel.hidden=false; app.hidden=true; $('#login-note').textContent = error.message; }
  }

  $('#login-form').addEventListener('submit', e => { e.preventDefault(); state.token = $('#token-input').value.trim(); sessionStorage.setItem('luma_admin_token', state.token); load(); });
  $('#logout-btn').addEventListener('click', () => { sessionStorage.removeItem('luma_admin_token'); location.reload(); });
  document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); state.filter=btn.dataset.filter; renderList(); }));

  $('#research-btn').addEventListener('click', async () => {
    const btn=$('#research-btn'); btn.disabled=true; btn.classList.add('researching'); btn.textContent='Researching + clustering…'; status('Consultando fuentes curadas, normalizando textos, agrupando señales y calculando scores. No se usa un agente de AI.');
    try { const data=await api('/api/research',{method:'POST'}); state.candidate=data.candidate; state.selected=new Set(state.candidate.trends.slice(0,6).map(x=>x.id)); editorialToInputs(); renderList(); renderEngine(); $('#candidate-status').textContent=`${state.candidate.trends.length} candidates · ${state.candidate.meta.issue}`; status('Research terminado. Revisa clusters, fuentes, copy extractivo y selecciona la edición.'); }
    catch(error){ status(error.message,true); }
    finally{ btn.disabled=false; btn.classList.remove('researching'); btn.textContent='Ejecutar research engine'; }
  });

  $('#save-btn').addEventListener('click', async () => {
    if(!state.candidate) return status('Primero genera una investigación.',true); inputsToEditorial(); status('Guardando…');
    try{ const data=await api('/api/admin',{method:'POST',body:JSON.stringify({action:'saveCandidate',candidate:state.candidate})}); state.candidate=data.candidate; status('Borrador guardado.'); }
    catch(error){ status(error.message,true); }
  });

  $('#publish-btn').addEventListener('click', async () => {
    if(!state.candidate) return status('No hay candidato para publicar.',true); if(state.selected.size<1) return status('Selecciona al menos una señal.',true); if(state.selected.size>10) return status('Máximo 10 señales por edición.',true);
    inputsToEditorial(); const edition=structuredClone(state.candidate); edition.trends=edition.trends.filter(t=>state.selected.has(t.id)); edition.meta={...edition.meta,status:'published'};
    const btn=$('#publish-btn'); btn.disabled=true; status('Publicando edición…');
    try{ const data=await api('/api/admin',{method:'POST',body:JSON.stringify({action:'publish',edition})}); state.published=data.published; renderPublished(); status(`Edición publicada con ${edition.trends.length} señales.`); }
    catch(error){ status(error.message,true); } finally{btn.disabled=false;}
  });

  if (state.token) load();
})();
