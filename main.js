/* ========================================================================
   Finhashy AI — company website interactions
   ======================================================================== */
(function () {
  'use strict';

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');

  function closeNav() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.hidden = true;
  }

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeNav();
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        mobileNav.hidden = false;
        // allow display before transition class
        requestAnimationFrame(function () { mobileNav.classList.add('open'); });
      }
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  /* ---- Scroll reveal ---- */
  var revealTargets = document.querySelectorAll(
    '.section h2, .feature-card, .solution-card, .outcome-card, .value-strip li, ' +
    '.arch-layer, .security-list li, .pilot-quote, .contact-form, .hero-copy, .hero-visual'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Contact form (client-side handling / demo) ---- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!status) return;

      var name = form.name.value.trim();
      var email = form.email.value.trim();

      if (!name) {
        status.className = 'form-status err';
        status.textContent = 'Please enter your name.';
        form.name.focus();
        return;
      }
      if (!isEmail(email)) {
        status.className = 'form-status err';
        status.textContent = 'Please enter a valid work email.';
        form.email.focus();
        return;
      }

      // No backend wired yet — acknowledge and reset.
      // Replace this block with a POST to your CRM / demo-request endpoint.
      status.className = 'form-status ok';
      status.textContent = 'Thanks, ' + name + '. We will reach out shortly to schedule your demo.';
      form.reset();
    });
  }
})();
