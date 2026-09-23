(async () => {
  const grid = document.querySelector('#pulse-teaser-grid');
  const foot = document.querySelector('#pulse-teaser-foot');
  if (!grid) return;
  const esc = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  try {
    const response = await fetch('/api/pulse', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    const trends = (data.trends || []).slice(0, 3);
    if (!trends.length) return;
    grid.innerHTML = trends.map((t, i) => `<a class="pulse-teaser-card ${i===0?'lead':''}" href="pulse.html"><div class="teaser-meta"><span>${esc(t.region)} · ${esc(t.segment)}</span><span>${esc(t.audience || 'Both')} · ${esc(t.stage)}</span></div><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p><div class="teaser-bottom"><b>${esc(t.metric)}</b><span><strong>${Number(t.score)||0}</strong>/100 LUMA</span></div></a>`).join('');
    if (foot) foot.innerHTML = `<span><i></i> Updated weekly · ${esc(data.meta?.updated || '')}</span><span>Automatic research · Human edited · Gen Z + Millennials</span>`;
  } catch {}
})();
