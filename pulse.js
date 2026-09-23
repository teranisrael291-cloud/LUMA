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

  const regionMatch = (trend) => region === 'ALL' || trend.region === region || (region === 'LATAM' && trend.region === 'MX');
  const segmentMatch = (trend) => {
    if (segment === 'All') return true;
    const hay = `${trend.segment || ''} ${(trend.segments || []).join(' ')}`.toLowerCase();
    const map = { Beauty:['beauty'], Food:['food','beverage'], Retail:['retail','commerce'], Tech:['tech','productivity'], Travel:['travel','experience'], Finance:['finance','value'], Culture:['culture','entertainment','music','gaming','sports'] };
    return (map[segment] || [segment.toLowerCase()]).some((needle) => hay.includes(needle));
  };
  const audienceMatch = (trend) => audience === 'All' || trend.audience === 'Both' || trend.audience === audience;
  const filteredTrends = () => data.trends.filter((trend) => regionMatch(trend) && segmentMatch(trend) && audienceMatch(trend));

  function trendCard(trend, lead = false) {
    return `<article class="trend-card ${lead ? 'lead' : ''}" data-trend="${esc(trend.id)}" tabindex="0" role="button" aria-label="Abrir insight ${esc(trend.title)}">
      <div class="trend-meta"><span>${esc(trend.regionLabel)}</span><span>${esc(trend.segment)}</span><span>${esc(trend.audience || 'Both')}</span><span class="stage">${esc(trend.stage)}</span></div>
      <div class="trend-kicker">${esc(trend.kicker)}</div>
      <h3>${esc(trend.title)}</h3>
      ${lead ? `<p>${esc(trend.summary)}</p>` : ''}
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
    document.querySelector('#modal-content').innerHTML = `<div class="modal-content">
      <div class="modal-eyebrow">${esc(trend.regionLabel)} · ${esc(trend.segment)} · ${esc(trend.stage)}</div>
      <h2 id="modal-title">${esc(trend.title)}</h2>
      <p class="modal-summary">${esc(trend.summary)}</p>
      <div class="modal-metric"><div><small>OBSERVED SIGNAL</small><b>${esc(trend.metric)}</b></div><div><small>LUMA SIGNAL</small><b>${Number(trend.score)||0} / 100</b></div></div>
      <div class="modal-section"><small>AUDIENCE LENS · ${esc(trend.audience || 'Both')}</small><p>${esc(trend.audienceWhy || 'Relevant to Gen Z and Millennial audiences.')}</p></div>
      <div class="modal-section"><small>WHY IT MATTERS</small><p>${esc(trend.impact)}</p></div>
      <div class="modal-section"><small>CREATOR TERRITORY</small><p>${esc(trend.creator)}</p></div>
      <div class="modal-section"><small>WATCH-OUT</small><p>${esc(trend.watchout)}</p></div>
      <div class="modal-source"><div><span>SOURCE</span><br><b>${esc(trend.source)}</b></div><a href="${safeUrl(trend.sourceUrl)}" target="_blank" rel="noreferrer">Open source ↗</a></div>
      <div class="modal-actions"><a class="btn btn-orange" href="index.html?trend=${encodeURIComponent(trend.title)}#start">Build around this signal →</a><button class="btn btn-ghost" type="button" data-close-modal>Close</button></div>
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
    button.classList.add('active'); region = button.dataset.region; renderLeads(); renderMonthList();
  }));
  document.querySelectorAll('#segment-filter button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('#segment-filter button').forEach((b) => b.classList.remove('active'));
    button.classList.add('active'); segment = button.dataset.segment; renderLeads(); renderMonthList();
  }));
  document.querySelectorAll('#audience-filter button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('#audience-filter button').forEach((b) => b.classList.remove('active'));
    button.classList.add('active'); audience = button.dataset.audience; renderLeads(); renderMonthList();
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

  document.querySelector('#source-grid').innerHTML = (data.sources||[]).map((s) => `<article class="source-card"><small>${esc(s.type)}</small><h3>${esc(s.name)}</h3><p>${esc(s.note)}</p><a href="${safeUrl(s.url)}" target="_blank" rel="noreferrer">Open source ↗</a></article>`).join('');

  renderLeads();
  renderMonthList();
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
