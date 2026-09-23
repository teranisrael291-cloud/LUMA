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
