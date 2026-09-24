const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

const parallaxCards = [...document.querySelectorAll('.parallax-card')];
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    parallaxCards.forEach((card) => {
      const depth = Number(card.dataset.depth || 5);
      card.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
    });
  });
  heroVisual.addEventListener('mouseleave', () => parallaxCards.forEach((card) => card.style.transform = ''));
}

const pulseTabs = [...document.querySelectorAll('.pulse-tab')];
const pulseTitle = document.querySelector('#pulse-title');
const pulseGrowth = document.querySelector('#pulse-growth');
const pulseScore = document.querySelector('#pulse-score');
const pulseCopy = document.querySelector('#pulse-copy');
const pulseSupply = document.querySelector('#pulse-supply');
const pulseSaturation = document.querySelector('#pulse-saturation');
const pulseAudience = document.querySelector('#pulse-audience');

pulseTabs.forEach((button) => {
  button.addEventListener('click', () => {
    pulseTabs.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    pulseTitle.textContent = button.dataset.title;
    pulseGrowth.textContent = button.dataset.growth;
    pulseScore.textContent = button.dataset.score;
    pulseCopy.textContent = button.dataset.copy;
    pulseSupply.textContent = button.dataset.supply;
    pulseSaturation.textContent = button.dataset.saturation;
    pulseAudience.textContent = button.dataset.audience;
  });
});

const creatorFilters = [...document.querySelectorAll('.creator-filter')];
const creatorCards = [...document.querySelectorAll('.creator-card')];
creatorFilters.forEach((button) => {
  button.addEventListener('click', () => {
    creatorFilters.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    creatorCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !show);
    });
  });
});

// Campaign CTA: carry the selected Pulse signal into the brief.
const buildCampaign = document.querySelector('#build-campaign');
const briefText = document.querySelector('#brief-text');
if (buildCampaign) {
  buildCampaign.addEventListener('click', () => {
    const trend = document.querySelector('.pulse-tab.active')?.dataset.title || 'LUMA Pulse signal';
    if (briefText && !briefText.value) briefText.value = `Quiero explorar una campaña alrededor de “${trend}”. Objetivo: `;
    document.querySelector('#start')?.scrollIntoView({behavior:'smooth'});
    setTimeout(() => briefText?.focus(), 500);
  });
}

// Static-site contact flow: prepare a DM-ready brief and open the verified active Instagram path.
const briefForm = document.querySelector('#brief-form');
if (briefForm) {
  briefForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(briefForm);
    const message = `LUMA — Campaign brief\nNombre: ${data.get('name')}\nMarca: ${data.get('brand')}\nEmail: ${data.get('email')}\nPresupuesto: ${data.get('budget')}\nBrief: ${data.get('brief')}`;
    try { await navigator.clipboard.writeText(message); } catch (_) {}
    briefForm.classList.add('is-ready');
    const note = document.querySelector('#form-note');
    if (note) note.textContent = currentLang === 'en' ? 'Brief ready and copied. Instagram is opening so you can paste it into a DM to LUMA.' : 'Brief listo y copiado. Abrimos Instagram para que puedas pegarlo en un DM a LUMA.';
    window.open('https://www.instagram.com/luma_creators?stkn=eGN3Yzg4OHMwbmlp', '_blank', 'noopener,noreferrer');
  });
}

// ES / EN toggle. Core conversion and strategy copy is translated without duplicating the page.
let currentLang = 'es';
const translations = {
  es:{startCampaign:'Iniciar campaña',buildCampaign:'Construir campaña',benefitsEyebrow:'WHAT BRANDS GET',benefitsTitle:'Menos hunting.<br><em>Más campañas que conectan.</em>',benefitsIntro:'LUMA convierte señales culturales y talento emergente en decisiones de campaña más rápidas, claras y accionables para tu equipo.',b1t:'Talento antes de que se sature',b1p:'Descubre creators de nicho con comunidades reales antes de que lleguen a todos los mismos briefs.',b2t:'Shortlists con contexto',b2p:'Recibe una selección explicada por afinidad, audiencia, contenido y señales de performance; no una lista interminable de perfiles.',b3t:'Menos coordinación',b3p:'Centralizamos outreach, disponibilidad, brief, entregables y seguimiento para que marketing no persiga mensajes y hojas de cálculo.',b4t:'Mejor lectura de resultados',b4p:'Compara views, saves, shares, audiencia y performance contra el objetivo de campaña, no sólo seguidores.',b5t:'Señales para actuar antes',b5p:'Pulse ayuda a detectar conversaciones y formatos en crecimiento para encontrar un ángulo de marca mientras todavía se siente fresco.',b6t:'Cada campaña aprende',b6p:'Tus siguientes recomendaciones mejoran con lo que funcionó: creator fit, formatos, audiencias y resultados previos.',startCopy:'Cuéntanos qué quieres mover. En menos de dos minutos puedes dejarnos un brief inicial y te llevamos al canal activo de LUMA para continuar la conversación.',nameLabel:'Nombre',brandLabel:'Marca',emailLabel:'Email',budgetLabel:'Presupuesto aproximado',exploring:'Aún explorando',briefLabel:'¿Qué quieres lograr?',prepareBrief:'Preparar brief',instagramContact:'Contactar por Instagram',formNote:'Al enviar, preparamos tu brief para copiarlo y abrimos el Instagram oficial de LUMA para que puedas enviarlo por DM. No dependemos de un correo o dominio no verificado.',creatorQuestion:'¿Eres creator?',creatorDm:'Escríbenos “CREATOR” por DM'},
  en:{startCampaign:'Start a campaign',buildCampaign:'Build a campaign',benefitsEyebrow:'WHAT BRANDS GET',benefitsTitle:'Less hunting.<br><em>More campaigns that connect.</em>',benefitsIntro:'LUMA turns cultural signals and rising talent into faster, clearer and more actionable campaign decisions for your team.',b1t:'Talent before saturation',b1p:'Discover niche creators with real communities before they start receiving the same briefs as everyone else.',b2t:'Shortlists with context',b2p:'Get a curated selection explained through affinity, audience, content and performance signals — not an endless profile database.',b3t:'Less coordination',b3p:'We centralize outreach, availability, briefs, deliverables and follow-up so your marketing team does not chase messages and spreadsheets.',b4t:'Results you can read',b4p:'Compare views, saves, shares, audience and performance against the campaign objective — not follower count alone.',b5t:'Signals to move earlier',b5p:'Pulse surfaces growing conversations and formats so your brand can find an angle while it still feels fresh.',b6t:'Every campaign learns',b6p:'Future recommendations improve with what worked before: creator fit, formats, audiences and campaign results.',startCopy:'Tell us what you want to move. Leave an initial brief in under two minutes and we’ll take you to LUMA’s active channel to continue the conversation.',nameLabel:'Name',brandLabel:'Brand',emailLabel:'Email',budgetLabel:'Approx. budget',exploring:'Still exploring',briefLabel:'What do you want to achieve?',prepareBrief:'Prepare brief',instagramContact:'Contact on Instagram',formNote:'On submit, we prepare and copy your brief, then open LUMA’s official Instagram so you can send it by DM. No dependency on an unverified email or domain.',creatorQuestion:'Are you a creator?',creatorDm:'DM us “CREATOR”'}
};
function setLanguage(lang){
  currentLang=lang; document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(translations[lang][k]) el.textContent=translations[lang][k];});
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{const k=el.dataset.i18nHtml;if(translations[lang][k]) el.innerHTML=translations[lang][k];});
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
}
document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));

// V4: carry a selected LUMA Pulse signal into the campaign brief across pages.
const pulseTrendParam = new URLSearchParams(window.location.search).get('trend');
if (pulseTrendParam && briefText) {
  briefText.value = `Quiero explorar una campaña alrededor de “${pulseTrendParam}”. Objetivo: `;
  setTimeout(() => briefText.focus(), 650);
}
