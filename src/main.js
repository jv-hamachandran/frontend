import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScene } from './scene.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = String(new Date().getFullYear());

/* ---------- Cinematic hero 3D scene ---------- */
let scene = null;
if (!prefersReduced && window.innerWidth >= 640) {
  scene = initScene(document.getElementById('scene'));
}

/* ---------- Nav: scrolled state + mobile menu ---------- */
const nav = document.getElementById('nav');
const toggle = document.getElementById('nav-toggle');
const menu = document.getElementById('mobile-menu');

function setNavState(y) {
  nav.classList.toggle('scrolled', y > 40);
}
setNavState(window.scrollY);

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    if (open) { menu.classList.remove('open'); menu.hidden = true; }
    else { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('open')); }
  });
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      menu.hidden = true;
    })
  );
}

/* ---------- Scroll progress bar ---------- */
const progress = document.getElementById('progress');
function setProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
}

/* ---------- Lenis smooth scrolling ---------- */
let lenis = null;
if (!prefersReduced) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });

  lenis.on('scroll', () => {
    ScrollTrigger.update();
    setNavState(window.scrollY);
    setProgress();
    if (scene) {
      const heroH = window.innerHeight;
      scene.setScroll(Math.min(window.scrollY / heroH, 1));
    }
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // anchor links -> lenis smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -70 }); }
      }
    });
  });
} else {
  window.addEventListener('scroll', () => { setNavState(window.scrollY); setProgress(); }, { passive: true });
}
setProgress();

/* ---------- Animations ---------- */
if (!prefersReduced) {
  // Hero intro timeline — cinematic line mask reveal
  document.querySelectorAll('[data-hero-line]').forEach((line) => {
    const wrap = document.createElement('span');
    wrap.className = 'line-mask';
    line.parentNode.insertBefore(wrap, line);
    wrap.appendChild(line);
  });

  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  heroTl
    .from('.pill', { y: 20, opacity: 0, duration: 0.7 })
    .from('[data-hero-line]', { yPercent: 120, duration: 1.1, stagger: 0.14 }, '-=0.3')
    .from('.hero-sub', { y: 24, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-cta', { y: 24, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-stats > div', { y: 24, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.5');

  // Generic reveal
  gsap.utils.toArray('[data-animate]').forEach((el) => {
    gsap.from(el, {
      y: 44, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // Staggered groups
  gsap.utils.toArray('.stagger').forEach((group) => {
    gsap.from(group.children, {
      y: 48, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 80%' }
    });
  });

  // Hero parallax on scroll
  gsap.to('.hero-glow', {
    y: 180, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Workflow: fill the progress line as the section scrolls through
  const flow = document.getElementById('flow');
  const flowFill = document.getElementById('flow-fill');
  if (flow && flowFill) {
    gsap.to(flowFill, {
      width: '100%', ease: 'none',
      scrollTrigger: { trigger: flow, start: 'top 70%', end: 'bottom 60%', scrub: true }
    });
    gsap.from('.flow-step', {
      opacity: 0, y: 30, duration: 0.6, stagger: 0.12,
      scrollTrigger: { trigger: flow, start: 'top 75%' }
    });
  }

  // Section titles subtle scale-in
  gsap.utils.toArray('.section-title').forEach((el) => {
    gsap.from(el, {
      scale: 0.96, transformOrigin: 'left center', duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  ScrollTrigger.refresh();
}
