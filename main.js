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
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealTargets = document.querySelectorAll(
    '.section h2, .feature-card, .solution-card, .outcome-card, .value-strip li, ' +
    '.arch-layer, .security-list li, .pilot-quote, .contact-form, .hero-copy, .hero-visual'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  // Elements already marked with data-reveal in the HTML are observed too.
  var observeList = [].slice.call(revealTargets)
    .concat([].slice.call(document.querySelectorAll('[data-reveal]')));

  if ('IntersectionObserver' in window && !prefersReduced) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    observeList.forEach(function (el) { observer.observe(el); });
  } else {
    observeList.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Scroll-linked effects: progress bar, parallax, showcase scale ---- */
  var progressBar = document.getElementById('scroll-progress');
  var parallaxEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;

  function onScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // progress bar
    if (progressBar) {
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }

    if (prefersReduced) { ticking = false; return; }

    // hero parallax
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
      el.style.transform = 'translate3d(0,' + (scrollTop * speed) + 'px,0)';
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

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
