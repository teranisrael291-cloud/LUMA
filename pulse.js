(() => {
  const data = window.LUMA_PULSE_DATA;
  if (!data) return;
  const esc = (v = '') => String(v).replace(/[&<>'\"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const safeUrl = (v = '') => { try { const u = new URL(v, location.origin); return ['http:','https:'].includes(u.protocol) ? u.href : '#'; } catch { return '#'; } };

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: .1 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelector('#issue-week').textContent = data.meta.week;
  document.querySelector('#updated-date').textContent = data.meta.updated;
  const issueBadge = document.querySelector('#issue-badge');
  if (issueBadge) issueBadge.textContent = `ISSUE ${String(data.meta.issue || '').replace(/^W/i,'') || '—'}`;
  const readtime = document.querySelector('#issue-readtime');
  if (readtime) readtime.textContent = `${Math.max(5, Math.min(12, Math.round((data.trends?.length || 6) * .85)))} min read`;
  const footerIssue = document.querySelector('#footer-issue');
  if (footerIssue) footerIssue.textContent = `Pulse ${data.meta.issue || ''} · ${data.meta.updated || ''}`;
  if (data.editorial) {
    const eyebrow = document.querySelector('#pulse-eyebrow');
    const headline = document.querySelector('#pulse-headline');
    const deck = document.querySelector('#pulse-deck');
    if (eyebrow && data.editorial.eyebrow) eyebrow.textContent = data.editorial.eyebrow;
    if (headline && data.editorial.headline) headline.textContent = data.editorial.headline;
    if (deck && data.editorial.deck) deck.textContent = data.editorial.deck;
  }
  const editorialNote = document.querySelector('#editorial-note-copy');
  if (editorialNote && data.trends?.length) {
    const top = [...data.trends].sort((a,b) => (b.score||0) - (a.score||0)).slice(0,3);
    const cats = [...new Set(top.map(t => t.segment).filter(Boolean))];
    editorialNote.textContent = `Esta edición concentra señales en ${cats.slice(0,3).join(', ')}. Priorizamos evidencia reciente y cruces entre fuentes; una tendencia con mucho ruido pero poca corroboración pierde peso frente a una señal más pequeña y consistente.`;
  }

  let region = 'ALL';
  let segment = 'All';
  let audience = 'All';
  let selectedTrend = data.trends[0];

  const leadGrid = document.querySelector('#lead-grid');
  const monthList = document.querySelector('#month-list');
  const radarGrid = document.querySelector('#radar-grid');
  const chartTitle = document.querySelector('#chart-title');
  const chartScore = document.querySelector('#chart-score');
  const chart = document.querySelector('#month-chart');
  const campaignCta = document.querySelector('#campaign-cta');
  const signalMap = document.querySelector('#signal-map');
  const signalMapRead = document.querySelector('#signal-map-read');
  const horizonGrid = document.querySelector('#horizon-grid');

  const regionMatch = (trend) => region === 'ALL' || trend.region === region || (region === 'LATAM' && trend.region === 'MX');
  const segmentMatch = (trend) => {
    if (segment === 'All') return true;
    const hay = `${trend.segment || ''} ${(trend.segments || []).join(' ')}`.toLowerCase();
    const map = { Beauty:['beauty'], Food:['food','beverage'], Retail:['retail','commerce'], Tech:['tech','productivity'], Travel:['travel','experience'], Finance:['finance','value'], Culture:['culture','entertainment','music','gaming','sports'] };
    return (map[segment] || [segment.toLowerCase()]).some((needle) => hay.includes(needle));
  };
  const audienceMatch = (trend) => audience === 'All' || trend.audience === 'Both' || trend.audience === audience;
  const filteredTrends = () => data.trends.filter((trend) => regionMatch(trend) && segmentMatch(trend) && audienceMatch(trend));
  const confidenceOf = (trend) => {
    if (Number.isFinite(Number(trend.confidence))) return Math.round(Number(trend.confidence));
    if (trend.model) {
      const evidence = Number(trend.model.evidence || 0);
      const authority = Number(trend.model.authority || 0);
      const age = Math.max(0, Number(trend.model.ageDays || 0));
      return Math.round(Math.max(25, Math.min(96, 100 * (.48 * evidence + .38 * authority + .14 * Math.exp(-age / 24)))));
    }
    const evidenceCount = trend.evidence?.length || 1;
    return Math.round(Math.max(48, Math.min(86, 54 + evidenceCount * 6 + (trend.region === 'MX' ? 6 : 0))));
  };
  const evidenceCountOf = (trend) => trend.evidence?.length || 1;
  const lifecycleIndex = (stage = '') => ({Spark:0,Building:1,Rising:1,Accelerating:2,Mainstream:3,Cooling:4,Shift:2}[stage] ?? 1);
  const lifecycle = (trend) => `<div class="lifecycle" aria-label="Trend lifecycle: ${esc(trend.stage)}">${[0,1,2,3,4].map((i) => `<i class="${i <= lifecycleIndex(trend.stage) ? 'on' : ''}"></i>`).join('')}</div>`;

  function trendCard(trend, lead = false) {
    const confidence = confidenceOf(trend);
    const evidenceCount = evidenceCountOf(trend);
    return `<article class="trend-card ${lead ? 'lead' : ''}" data-trend="${esc(trend.id)}" tabindex="0" role="button" aria-label="Abrir insight ${esc(trend.title)}">
      <div class="trend-meta"><span>${esc(trend.regionLabel)}</span><span>${esc(trend.segment)}</span><span>${esc(trend.audience || 'Both')}</span><span class="stage">${esc(trend.stage)}</span></div>
      <div class="trend-kicker">${esc(trend.kicker)}</div>
      <h3>${esc(trend.title)}</h3>
      ${lead ? `<p>${esc(trend.summary)}</p>` : ''}
      <div class="trend-proof"><span><i></i>${confidence}% confidence</span><span>${evidenceCount} evidence ${evidenceCount === 1 ? 'source' : 'sources'}</span><span>${esc(trend.platform || trend.source)}</span></div>
      <div class="confidence-bar" style="--confidence:${confidence}%"><i></i></div>
      ${lifecycle(trend)}
      <div class="trend-bottom">
        <div class="trend-metric"><b>${esc(trend.metric)}</b><span>${esc(trend.metricLabel)}</span></div>
        <div class="trend-score"><b>${Number(trend.score) || 0}</b><span>/100<br>LUMA</span></div>
      </div>
    </article>`;
  }

  function renderLeads() {
    const items = filteredTrends();
    if (!items.length) {
      leadGrid.innerHTML = '<div class="trend-empty">No hay señales en esta combinación todavía. Prueba otro segmento o región.</div>';
      return;
    }
    const lead = items[0];
    const rest = items.slice(1, 3);
    leadGrid.innerHTML = trendCard(lead, true) + `<div class="secondary-stack">${rest.map((t) => trendCard(t)).join('')}</div>`;
    leadGrid.querySelectorAll('.trend-card').forEach((card) => {
      const open = () => openTrend(card.dataset.trend);
      card.addEventListener('click', open);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
  }


  function renderSignalMap() {
    if (!signalMap || !signalMapRead) return;
    const items = filteredTrends().slice(0, 12);
    const width = 900, height = 470, left = 70, right = 28, top = 28, bottom = 54;
    const x = (confidence) => left + (Math.max(25, Math.min(100, confidence)) - 25) / 75 * (width - left - right);
    const y = (momentum) => height - bottom - Math.max(0, Math.min(1, momentum)) * (height - top - bottom);
    const grid = [25,50,75,100].map(v => `<g><line x1="${x(v)}" y1="${top}" x2="${x(v)}" y2="${height-bottom}" class="map-grid"/><text x="${x(v)}" y="${height-24}" text-anchor="middle" class="map-tick">${v}</text></g>`).join('') + [0,.25,.5,.75,1].map(v => `<g><line x1="${left}" y1="${y(v)}" x2="${width-right}" y2="${y(v)}" class="map-grid"/><text x="${left-18}" y="${y(v)+4}" text-anchor="end" class="map-tick">${Math.round(v*100)}</text></g>`).join('');
    const marks = items.map((t,i) => {
      const confidence = confidenceOf(t);
      const momentum = Number(t.model?.momentum ?? (t.score||50)/100);
      const r = i === 0 ? 10 : 7;
      return `<g class="map-point" data-trend="${esc(t.id)}" tabindex="0" role="button" aria-label="${esc(t.title)}"><circle cx="${x(confidence)}" cy="${y(momentum)}" r="${r}"/><text x="${x(confidence)+13}" y="${y(momentum)+4}" class="map-label">${esc(t.title.length>25?t.title.slice(0,24)+'…':t.title)}</text></g>`;
    }).join('');
    signalMap.innerHTML = `${grid}<line x1="${x(70)}" y1="${top}" x2="${x(70)}" y2="${height-bottom}" class="map-threshold"/><line x1="${left}" y1="${y(.62)}" x2="${width-right}" y2="${y(.62)}" class="map-threshold"/>${marks}`;
    signalMap.querySelectorAll('.map-point').forEach(node => {
      const open = () => openTrend(node.dataset.trend);
      node.addEventListener('click', open);
      node.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    const topTrend = [...items].sort((a,b) => ((b.model?.momentum||0)*confidenceOf(b))-((a.model?.momentum||0)*confidenceOf(a)))[0] || items[0];
    if (topTrend) signalMapRead.innerHTML = `<span class="map-read-kicker">HIGH-CONVICTION SIGNAL</span><h3>${esc(topTrend.title)}</h3><p>${esc(topTrend.summary)}</p><div class="map-read-stats"><span><b>${Math.round((topTrend.model?.momentum||0)*100)}</b> momentum</span><span><b>${confidenceOf(topTrend)}</b> confidence</span><span><b>${Number(topTrend.score)||0}</b> LUMA</span></div><button class="text-action" type="button" data-map-open="${esc(topTrend.id)}">Open signal</button>`;
    signalMapRead.querySelector('[data-map-open]')?.addEventListener('click', e => openTrend(e.currentTarget.dataset.mapOpen));
  }

  function renderHorizons() {
    if (!horizonGrid) return;
    const groups = [
      {key:'Cultural moment', label:'01 / MOMENTS', desc:'Fast-moving participation. Useful when timing matters more than longevity.'},
      {key:'Emerging trend', label:'02 / EMERGING', desc:'Cross-source patterns that are gaining shape and still have room to interpret.'},
      {key:'Structural shift', label:'03 / SHIFTS', desc:'Persistent changes supported by research, repeated evidence or prior editions.'}
    ];
    const items = filteredTrends();
    horizonGrid.innerHTML = groups.map(group => {
      const trends = items.filter(t => (t.archetype || 'Emerging trend') === group.key).slice(0,4);
      return `<article class="horizon-column"><div class="horizon-head"><span>${group.label}</span><b>${trends.length}</b></div><p>${group.desc}</p><div class="horizon-items">${trends.length?trends.map(t=>`<button type="button" data-horizon="${esc(t.id)}"><span>${esc(t.region)} / ${esc(t.stage)}</span><b>${esc(t.title)}</b><i style="--score:${Number(t.score)||0}%"></i></button>`).join(''):'<div class="horizon-empty">No signal selected in this horizon.</div>'}</div></article>`;
    }).join('');
    horizonGrid.querySelectorAll('[data-horizon]').forEach(btn => btn.addEventListener('click', () => openTrend(btn.dataset.horizon)));
  }

  function renderEvidenceArchitecture() {
    const mix = document.querySelector('#evidence-mix');
    const directory = document.querySelector('#source-directory-grid');
    const count = document.querySelector('#source-count');
    const sources = data.sources || [];
    if (count) count.textContent = `${sources.length} sources`;
    const roleLabels = {signal:'Behavior signals',evidence:'Market evidence',foresight:'Foresight',trade:'Marketing trade',culture:'Culture desk'};
    const sourceRole = (s) => s.role || (['search-signal','platform-editorial','platform-signal'].includes(s.type)?'signal':(['market-research'].includes(s.type)?'evidence':(['trend-research','trend-data'].includes(s.type)?'foresight':(['marketing-editorial','business-editorial'].includes(s.type)?'trade':'culture'))));
    const roles = ['signal','evidence','foresight','trade','culture'].map(role => ({role, count:sources.filter(s=>sourceRole(s)===role).length})).filter(x=>x.count);
    const total = roles.reduce((sum,x)=>sum+x.count,0)||1;
    if (mix) mix.innerHTML = `<div class="evidence-mix-head"><span>SOURCE ARCHITECTURE</span><b>${sources.length} curated inputs</b></div><div class="evidence-mix-bar">${roles.map(x=>`<i style="--share:${x.count/total*100}%" title="${esc(roleLabels[x.role]||x.role)}: ${x.count}"></i>`).join('')}</div><div class="evidence-mix-legend">${roles.map(x=>`<span><i></i><b>${esc(roleLabels[x.role]||x.role)}</b> ${x.count}</span>`).join('')}</div>`;
    if (directory) directory.innerHTML = sources.map(s=>`<a href="${safeUrl(s.url)}" target="_blank" rel="noreferrer"><span>${esc(s.region)} / ${esc(sourceRole(s))}</span><b>${esc(s.name)}</b></a>`).join('');
  }

  function drawChart(trend) {
    selectedTrend = trend;
    chartTitle.textContent = trend.title;
    chartScore.textContent = Number(trend.score) || 0;
    const vals = (trend.series || [0,0,0,0,0,0]).map((v) => Math.max(0, Math.min(100, Number(v) || 0)));
    const width = 800, height = 300, padX = 22, padY = 26;
    const min = Math.max(0, Math.min(...vals) - 10);
    const max = Math.min(100, Math.max(...vals) + 8);
    const x = (i) => padX + (i * (width - padX * 2) / (vals.length - 1));
    const y = (v) => height - padY - ((v - min) / Math.max(1, max - min)) * (height - padY * 2);
    const points = vals.map((v, i) => `${x(i)},${y(v)}`).join(' ');
    const area = `${padX},${height-padY} ${points} ${width-padX},${height-padY}`;
    const circles = vals.map((v,i) => `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="#FF7A3D"><title>W${34+i}: ${v}</title></circle>`).join('');
    const grid = [0,1,2,3].map((i) => { const gy = padY + i*(height-padY*2)/3; return `<line x1="${padX}" y1="${gy}" x2="${width-padX}" y2="${gy}" stroke="rgba(255,255,255,.08)"/>`; }).join('');
    chart.innerHTML = `<defs><linearGradient id="pulseMonthFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#FF7A3D" stop-opacity=".32"/><stop offset="100%" stop-color="#FF7A3D" stop-opacity="0"/></linearGradient></defs>${grid}<polygon points="${area}" fill="url(#pulseMonthFill)"/><polyline points="${points}" fill="none" stroke="#FF7A3D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${circles}`;
    monthList.querySelectorAll('.month-row').forEach((row) => row.classList.toggle('active', row.dataset.trend === trend.id));
    renderRadar(trend);
    campaignCta.href = `index.html?trend=${encodeURIComponent(trend.title)}#start`;
  }

  function renderMonthList() {
    const items = filteredTrends().slice(0, 6);
    monthList.innerHTML = items.map((trend) => `<button class="month-row ${trend.id === selectedTrend.id ? 'active' : ''}" data-trend="${esc(trend.id)}" type="button"><div><small>${esc(trend.regionLabel)} · ${esc(trend.stage)}</small><b>${esc(trend.title)}</b></div><span>${Number(trend.score)||0}</span></button>`).join('');
    monthList.querySelectorAll('.month-row').forEach((row) => row.addEventListener('click', () => {
      const trend = data.trends.find((t) => t.id === row.dataset.trend);
      if (trend) drawChart(trend);
    }));
    const first = items.find((t) => t.id === selectedTrend.id) || items[0] || data.trends[0];
    drawChart(first);
  }

  function renderRadar(trend) {
    const copy = {
      TikTok: ['Language & velocity', 'Formats, hashtags and fast-moving participation.'],
      Google: ['Intent & curiosity', 'Search helps reveal when interest moves beyond the feed.'],
      YouTube: ['Depth & durability', 'Longer-form viewing shows which formats can sustain attention.'],
      Pinterest: ['Planning & aesthetics', 'Useful for visual directions and forward-looking discovery.'],
      Instagram: ['Aesthetics & sharing', 'Useful for creator formats, visual language and brand participation when public evidence is available.']
    };
    radarGrid.innerHTML = Object.entries(trend.networks || {}).map(([name, raw]) => { const value = Math.max(0, Math.min(100, Number(raw)||0)); const c = copy[name] || ['Context signal','Used as supporting context when evidence is available.']; return `<article class="radar-card"><div class="network"><b>${esc(name)}</b><span>LUMA READ</span></div><strong>${value}</strong><p><b>${esc(c[0])}.</b> ${esc(c[1])}</p><div class="radar-bar" style="--w:${value}%"><i></i></div></article>`; }).join('');
    document.querySelector('#radar-reading').innerHTML = `<b>${esc(trend.platform)} is the strongest observed signal for “${esc(trend.title)}”.</b> LUMA uses the other channels as context instead of pretending their metrics are directly comparable.`;
  }

  function openTrend(id) {
    const trend = data.trends.find((t) => t.id === id);
    if (!trend) return;
    selectedTrend = trend;
    const modal = document.querySelector('#trend-modal');
    const confidence = confidenceOf(trend);
    const evidenceItems = (trend.evidence || []).slice(0,5);
    const evidenceHtml = evidenceItems.length ? evidenceItems.map((item) => `<div class="evidence-item"><a class="external-link" href="${safeUrl(item.url)}" target="_blank" rel="noreferrer"><b>${esc(item.title)}</b></a><span>${esc(item.source)}</span></div>`).join('') : `<div class="evidence-item"><a href="${safeUrl(trend.sourceUrl)}" target="_blank" rel="noreferrer"><b>${esc(trend.source)}</b></a><span>Primary source</span></div>`;
    document.querySelector('#modal-content').innerHTML = `<div class="modal-content">
      <div class="modal-eyebrow">${esc(trend.regionLabel)} · ${esc(trend.segment)} · ${esc(trend.stage)}</div>
      <h2 id="modal-title">${esc(trend.title)}</h2>
      <p class="modal-summary">${esc(trend.summary)}</p>
      <div class="modal-metric"><div><small>OBSERVED SIGNAL</small><b>${esc(trend.metric)}</b></div><div><small>LUMA SIGNAL</small><b>${Number(trend.score)||0} / 100</b></div></div>
      <div class="modal-confidence"><div><small>CONFIDENCE</small><b>${confidence}%</b></div><div><small>EVIDENCE</small><b>${evidenceCountOf(trend)} source${evidenceCountOf(trend)===1?'':'s'}</b></div><div><small>HORIZON</small><b>${esc(trend.archetype || trend.stage)}</b></div></div>
      <div class="modal-section signal-anatomy"><small>SIGNAL ANATOMY</small><div class="anatomy-grid">${[['Momentum',trend.model?.momentum],['Evidence',trend.model?.evidence],['Agreement',trend.model?.agreement],['Persistence',trend.model?.persistence],['Novelty',trend.model?.novelty],['Whitespace',trend.model?.whitespace]].map(([label,val])=>{const pct=Math.round(Math.max(0,Math.min(1,Number(val)||0))*100);return `<div><span><b>${label}</b><em>${pct}</em></span><i style="--value:${pct}%"></i></div>`;}).join('')}</div></div>
      <div class="modal-section"><small>AUDIENCE LENS / ${esc(trend.audience || 'Both')} / ${Number(trend.audienceConfidence)||'—'} CONFIDENCE</small><p>${esc(trend.audienceWhy || 'Relevant to Gen Z and Millennial audiences.')}</p></div>
      <div class="modal-section"><small>WHY NOW</small><p>${esc(trend.summary)}</p></div>
      <div class="modal-section action-section"><small>WHAT BRANDS CAN DO</small><p>${esc(trend.impact)}</p></div>
      <div class="modal-section"><small>CREATOR TERRITORY</small><p>${esc(trend.creator)}</p></div>
      <div class="modal-section"><small>WATCH-OUT</small><p>${esc(trend.watchout)}</p></div>
      <div class="modal-section"><small>EVIDENCE DESK</small><div class="evidence-list">${evidenceHtml}</div></div>
      <div class="modal-source"><div><span>PRIMARY SOURCE</span><br><b>${esc(trend.source)}</b></div><a class="external-link" href="${safeUrl(trend.sourceUrl)}" target="_blank" rel="noreferrer">Open source</a></div>
      <div class="modal-actions"><a class="btn btn-orange with-arrow" href="index.html?trend=${encodeURIComponent(trend.title)}#start">Build around this signal</a><button class="btn btn-ghost" type="button" data-close-modal>Close</button></div>
    </div>`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
  }

  function closeModal() {
    const modal = document.querySelector('#trend-modal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('#region-filter button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('#region-filter button').forEach((b) => b.classList.remove('active'));
    button.classList.add('active'); region = button.dataset.region; renderLeads(); renderMonthList(); renderSignalMap(); renderHorizons();
  }));
  document.querySelectorAll('#segment-filter button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('#segment-filter button').forEach((b) => b.classList.remove('active'));
    button.classList.add('active'); segment = button.dataset.segment; renderLeads(); renderMonthList(); renderSignalMap(); renderHorizons();
  }));
  document.querySelectorAll('#audience-filter button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('#audience-filter button').forEach((b) => b.classList.remove('active'));
    button.classList.add('active'); audience = button.dataset.audience; renderLeads(); renderMonthList(); renderSignalMap(); renderHorizons();
  }));

  const industryTabs = document.querySelector('#industry-tabs');
  const industryDetail = document.querySelector('#industry-detail');
  function renderIndustry(industry) {
    industryDetail.innerHTML = `<div class="industry-top"><div><h3>${esc(industry.name)}</h3><div class="mood">${esc(industry.mood)}</div></div><div class="industry-score"><b>${Number(industry.score)||0}</b><span>/100<br>LUMA</span></div></div><p class="industry-fact">${esc(industry.fact)}</p><div class="industry-signals">${(industry.signals||[]).map((s) => `<span>${esc(s)}</span>`).join('')}</div><div class="industry-action"><small>WHAT BRANDS CAN DO</small><p>${esc(industry.action)}</p></div><p style="font-size:9px;color:#a19a95;margin-top:18px">Source context: ${esc(industry.source)}</p>`;
    industryTabs.querySelectorAll('.industry-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.industry === industry.id));
  }
  industryTabs.innerHTML = (data.industries||[]).map((i, idx) => `<button class="industry-tab ${idx===0?'active':''}" type="button" data-industry="${esc(i.id)}"><b>${esc(i.name)}</b><span>${Number(i.score)||0}</span></button>`).join('');
  industryTabs.querySelectorAll('.industry-tab').forEach((tab) => tab.addEventListener('click', () => renderIndustry(data.industries.find((i) => i.id === tab.dataset.industry))));
  if (data.industries?.[0]) renderIndustry(data.industries[0]);

  const featuredSources = (data.sources||[]).filter(s => ['signal','evidence','foresight'].includes(s.role)).slice(0,12);
  document.querySelector('#source-grid').innerHTML = featuredSources.map((s) => `<article class="source-card"><small>${esc((s.role||s.type).toUpperCase())}</small><h3>${esc(s.name)}</h3><p>${esc(s.note)}</p><a class="external-link" href="${safeUrl(s.url)}" target="_blank" rel="noreferrer">Open source</a></article>`).join('');
  renderEvidenceArchitecture();

  renderLeads();
  renderMonthList();
  renderSignalMap();
  renderHorizons();
})();

// Pulse language toggle: keeps source-native trend names intact and switches the editorial UI shell.
(() => {
  const dict = {
    es: {start:'Iniciar campaña'},
    en: {start:'Start a campaign'}
  };
  document.querySelectorAll('[data-pulse-lang]').forEach((button) => button.addEventListener('click', () => {
    const lang = button.dataset.pulseLang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-pulse-lang]').forEach((b) => b.classList.toggle('active', b.dataset.pulseLang === lang));
    document.querySelectorAll('[data-pulse-i18n]').forEach((el) => {
      const key = el.dataset.pulseI18n;
      if (dict[lang][key]) el.textContent = dict[lang][key];
    });
  }));
})();
