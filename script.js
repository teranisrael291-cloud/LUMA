const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

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
if (heroVisual && window.matchMedia('(pointer:fine)').matches) {
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    parallaxCards.forEach((card) => {
      const depth = Number(card.dataset.depth || 6);
      card.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0) rotateX(${-y * 2}deg) rotateY(${x * 2}deg)`;
    });
  });
  heroVisual.addEventListener('mouseleave', () => {
    parallaxCards.forEach((card) => card.style.transform = '');
  });
}
