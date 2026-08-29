// Mobile navigation accessibility and active Web3Forms AJAX submission
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Handle AJAX Contact Form Submission
    const form = document.getElementById('contactForm');
    const result = document.getElementById('formResult');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            if (result) {
                result.style.display = 'block';
                result.innerHTML = 'Sending message...';
                result.style.color = '#cbd5e1';
            }

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    if (result) {
                        result.innerHTML = '&#10004; Message sent successfully! I will contact you shortly.';
                        result.style.color = '#10b981';
                    }
                    form.reset();
                } else {
                    if (result) {
                        result.innerHTML = json.message || 'Error sending message. Please call directly.';
                        result.style.color = '#ef4444';
                    }
                }
            })
            .catch(error => {
                if (result) {
                    result.innerHTML = 'Something went wrong! Please call (289) 500-5666.';
                    result.style.color = '#ef4444';
                }
            });
        });
    }
});