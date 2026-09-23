(async () => {
  const fallback = window.LUMA_PULSE_DATA;
  try {
    const response = await fetch('/api/pulse', { cache: 'no-store' });
    if (response.ok) window.LUMA_PULSE_DATA = await response.json();
  } catch (error) {
    console.info('LUMA Pulse is using the bundled fallback edition.', error);
  }
  const data = window.LUMA_PULSE_DATA || fallback;
  if (data?.trends) {
    data.trends = data.trends.map((trend) => ({
      audience: 'Both',
      audienceWhy: 'Relevant to Gen Z and Millennial creator audiences.',
      segments: trend.segments || [trend.segment || 'Culture'],
      networks: { TikTok: 0, Instagram: 0, YouTube: 0, Google: 0, Pinterest: 0, ...(trend.networks || {}) },
      ...trend
    }));
  }
  const script = document.createElement('script');
  script.src = 'pulse.js';
  script.defer = true;
  document.body.appendChild(script);
})();
