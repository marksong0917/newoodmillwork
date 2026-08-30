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

// Contact form: submits to FormSubmit (a free static-site form backend — no
// server needed) via fetch, so it works even for visitors with no email app
// configured. Native form action="" is left in place as a no-JS fallback.
const quoteForm = document.getElementById('quoteForm');
const formStatus = document.getElementById('formStatus');

function setFormStatus(message, kind) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.hidden = false;
  formStatus.className = kind ? `form-status form-status-${kind}` : 'form-status';
}

if (quoteForm) {
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('qName').value.trim();
    const email = document.getElementById('qEmail').value.trim();

    if (!name || !email) {
      setFormStatus('Please fill in your name and email so we can get back to you.', 'error');
      return;
    }

    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    formStatus.hidden = true;

    try {
      const response = await fetch('https://formsubmit.co/ajax/info@newoodmillwork.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(quoteForm).entries()))
      });
      if (!response.ok) throw new Error('Request failed');

      quoteForm.hidden = true;
      setFormStatus("Thanks — your message is on its way. We'll get back to you within 24–48 business hours.", 'success');
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      setFormStatus('Something went wrong sending that. Please email us directly at info@newoodmillwork.com and we\u2019ll get right back to you.', 'error');
    }
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
