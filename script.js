const snapContainer = document.querySelector('.snap-container');
const observedSections = document.querySelectorAll('.observe');
const dotLinks = document.querySelectorAll('.scroll-dots a');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  {
    root: snapContainer,
    threshold: 0.36,
  }
);

observedSections.forEach(section => revealObserver.observe(section));

const activeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id') || 'top';
      dotLinks.forEach(link => {
        const href = link.getAttribute('href')?.replace('#', '');
        link.classList.toggle('active', href === id);
      });
    });
  },
  {
    root: snapContainer,
    threshold: 0.58,
  }
);

observedSections.forEach(section => activeObserver.observe(section));
