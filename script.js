/* ==========================================================================
   Newood Millwork — script.js (SOURCE OF TRUTH)
   Edit this file, then rebuild:  npx terser script.js -o script.min.js --compress --mangle
   Pages load script.min.js?v=ds11 — bump the ?v= on any script change.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Reveal on scroll — IntersectionObserver pattern (Studio Design System v1).
   JS adds the .js-reveal gate class to <html>; .reveal sections start
   hidden/offset only when that gate is present, so no-JS = fully visible.
   -------------------------------------------------------------------------- */
document.documentElement.classList.add("js-reveal");

const revealSections = document.querySelectorAll(".reveal");
if (revealSections.length) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealSections.forEach((section) => revealObserver.observe(section));
  } else {
    revealSections.forEach((section) => section.classList.add("in"));
  }
}

/* --------------------------------------------------------------------------
   Gallery lightbox — built on the fly when a page has .work-item images.
   -------------------------------------------------------------------------- */
const lightboxTriggers = document.querySelectorAll(".work-item img");
if (lightboxTriggers.length) {
  const images = Array.from(lightboxTriggers);
  let current = 0;
  let lastTrigger = null;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Image viewer");
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
    <img alt="">
    <button class="lightbox-next" aria-label="Next">&#8250;</button>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector("img");

  function show(index) {
    current = (index + images.length) % images.length;
    lightboxImg.src = images[current].src;
    lightboxImg.alt = images[current].alt;
  }

  function open(index, trigger) {
    lastTrigger = trigger || null;
    show(index);
    lightbox.classList.add("open");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove("open");
    if (lastTrigger) lastTrigger.focus();
  }

  images.forEach((img, index) => {
    if (img.closest("figure")) {
      img.tabIndex = -1; // focusable target for the lightbox focus return
      img.addEventListener("click", () => open(index, img));
    }
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox
    .querySelector(".lightbox-prev")
    .addEventListener("click", () => show(current - 1));
  lightbox
    .querySelector(".lightbox-next")
    .addEventListener("click", () => show(current + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
    if (event.key === "Tab") {
      const buttons = lightbox.querySelectorAll("button");
      if (buttons.length) {
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
  });
}

/* --------------------------------------------------------------------------
   Quote form — AJAX submit to the Hub intake endpoint (homepage only).
   -------------------------------------------------------------------------- */
const quoteForm = document.getElementById("quoteForm");
const formStatus = document.getElementById("formStatus");

function setFormStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.hidden = false;
  formStatus.className = type ? `form-status form-status-${type}` : "form-status";
}

if (quoteForm) {
  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("qName").value.trim();
    const email = document.getElementById("qEmail").value.trim();
    if (!name || !email) {
      setFormStatus(
        "Please fill in your name and email so we can get back to you.",
        "error",
      );
      return;
    }
    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    const submitLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    formStatus.hidden = true;
    try {
      const response = await fetch(
        "https://forms.foxuma.com/api/intake/website/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(
            Object.fromEntries(
              [...new FormData(quoteForm).entries()].filter(
                ([key]) => !key.startsWith("_"),
              ),
            ),
          ),
        },
      );
      if (!response.ok) throw new Error("Request failed");
      quoteForm.hidden = true;
      setFormStatus(
        "Thanks — we've received it. We reply within one business day.",
        "success",
      );
    } catch (error) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
      setFormStatus(
        "Something went wrong sending that. Please email us directly at info@newoodmillwork.com and we’ll get right back to you.",
        "error",
      );
    }
  });
}

/* --------------------------------------------------------------------------
   Mobile nav toggle.
   -------------------------------------------------------------------------- */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* --------------------------------------------------------------------------
   Visit beacon — cookieless first-party stats to the Hub, the same
   beacon the Hub-generated sites carry (path + referrer host only).
   -------------------------------------------------------------------------- */
(function () {
  try {
    var d = JSON.stringify({
      token: "Vc2Y9680nthOSe3oV2g6rh1pvRd0QIo-ItruNn--xMA",
      path: location.pathname,
      ref: document.referrer || "",
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "https://crm.newoodmillwork.com/api/website/hit/",
        new Blob([d], { type: "text/plain" }),
      );
    }
  } catch (e) {}
})();

/* Anti-bot render token (Hub 0.65): fetch a signed timestamp from
   the Hub and stamp it into every intake form on the page — the
   quote form's AJAX payload picks the field up from FormData (it
   does not start with "_"), the guide form carries it as a plain
   hidden field. The Hub silently drops submissions that arrive
   inhumanly fast or with a forged token. If the fetch fails the
   form still submits; the Hub's other layers (rate limit,
   duplicate suppression, content heuristics) still apply. */
(function () {
  var forms = document.querySelectorAll('form[action*="/api/intake/website/"]');
  if (!forms.length) return;
  var tok = forms[0].querySelector('[name="token"]');
  var action = forms[0].getAttribute("action") || "";
  if (!tok || !action) return;
  var url = action.replace("website/", "challenge/")
    + "?t=" + encodeURIComponent(tok.value);
  fetch(url).then(function (r) { return r.json(); }).then(function (j) {
    if (!j || !j.c) return;
    forms.forEach(function (f) {
      var inp = f.querySelector('[name="c"]');
      if (inp) inp.value = j.c;
    });
  }).catch(function () {});
})();
