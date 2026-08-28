const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const lightboxTriggers = document.querySelectorAll('.work-item img, .service-photo img');
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
    if (img.closest('figure')) {
      img.addEventListener('click', () => open(i));
    }
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

const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  let currentStep = 1;
  let selectedType = '';
  let selectedTimeline = '';

  const steps = quoteForm.querySelectorAll('.form-step');
  const dots = quoteForm.querySelectorAll('.form-progress-step');

  function goToStep(n) {
    currentStep = n;
    steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
    dots.forEach(d => {
      const dn = Number(d.dataset.stepDot);
      d.classList.toggle('active', dn === n);
      d.classList.toggle('done', dn < n);
    });
  }

  quoteForm.querySelectorAll('.form-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.closest('.form-step');
      step.querySelectorAll('.form-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const stepNum = Number(step.dataset.step);
      if (stepNum === 1) selectedType = btn.dataset.value;
      if (stepNum === 2) selectedTimeline = btn.dataset.value;
      setTimeout(() => goToStep(stepNum + 1), 200);
    });
  });

  quoteForm.querySelectorAll('.form-back').forEach(btn => {
    btn.addEventListener('click', () => goToStep(Number(btn.dataset.back)));
  });

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('qName').value.trim();
    const email = document.getElementById('qEmail').value.trim();
    const phone = document.getElementById('qPhone').value.trim();
    const size = document.getElementById('qSize').value.trim();
    const details = document.getElementById('qDetails').value.trim();

    if (!name || !email) {
      alert('Please fill in your name and email so we can get back to you.');
      return;
    }

    const subject = `Quote Request: ${selectedType || 'Project'} — ${name}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Project type: ${selectedType || 'Not specified'}`,
      `Timeline: ${selectedTimeline || 'Not specified'}`,
      size ? `Approximate size: ${size}` : null,
      '',
      'Project details:',
      details || '(none provided)'
    ].filter(Boolean);

    const mailto = `mailto:info@newoodmillwork.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('
'))}`;
    window.location.href = mailto;
  });
}

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
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
}