// Lightbox for gallery images (figure.work-item images in the simple 3x3 project grids)
const lightboxTriggers = document.querySelectorAll('.work-item img');
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
    // Only intercept clicks on images that aren't themselves inside a plain <a> nav link
    // (work-item figures use lightbox; pillar/gallery links to other pages are untouched)
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

// Contact form: single-page form, builds a pre-filled email (no backend needed on a static site)
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('qName').value.trim();
    const email = document.getElementById('qEmail').value.trim();
    const phone = document.getElementById('qPhone').value.trim();
    const type = document.getElementById('qType').value;
    const details = document.getElementById('qDetails').value.trim();

    if (!name || !email) {
      alert('Please fill in your name and email so we can get back to you.');
      return;
    }

    const subject = `Project Inquiry: ${type || 'Project'} — ${name}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Project type: ${type || 'Not specified'}`,
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

// Section entrance is handled purely by CSS (see .reveal in styles.css) —
// no JS needed, so it can never leave a section stuck invisible.
