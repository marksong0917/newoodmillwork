document.getElementById('year').textContent = new Date().getFullYear();

// Lightbox for gallery images (figure.work-item and figure.service-photo only —
// homepage tiles are <a> links to other pages and should keep their normal nav behaviour)
const lightboxTriggers = document.querySelectorAll('figure.work-item img, figure.service-photo img');
if (lightboxTriggers.length) {
  const images = Array.from(lightboxTriggers);
  let current = 0;

  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
    <img src="" alt="">
    <button class="lightbox-next" aria-label="Next">&#8250;</button>
  `;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');

  function show(i) {
    current = (i + images.length) % images.length;
    lbImg.src = images[current].src;
    lbImg.alt = images[current].alt;
  }
  function open(i) {
    show(i);
    lb.classList.add('open');
  }
  function close() {
    lb.classList.remove('open');
  }

  images.forEach((img, i) => {
    img.addEventListener('click', () => open(i));
  });
  lb.querySelector('.lightbox-close').addEventListener('click', close);
  lb.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
  lb.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}
// Quote request form: builds a pre-filled email (no backend needed on a static site)
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('qName').value.trim();
    const email = document.getElementById('qEmail').value.trim();
    const phone = document.getElementById('qPhone').value.trim();
    const type = document.getElementById('qType').value;
    const size = document.getElementById('qSize').value.trim();
    const details = document.getElementById('qDetails').value.trim();

    if (!name || !email) {
      alert('Please fill in your name and email so we can get back to you.');
      return;
    }

    const subject = `Quote Request: ${type} — ${name}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Project type: ${type}`,
      size ? `Approximate size: ${size}` : null,
      '',
      'Project details:',
      details || '(none provided)'
    ].filter(Boolean);

    const mailto = `mailto:info@newoodmillwork.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    window.location.href = mailto;
  });
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Reveal-on-scroll for section content
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}
