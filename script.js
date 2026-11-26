const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav?.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

// The Our Work gallery is rendered by gallery.js from gallery.json.

const filters = document.querySelectorAll('[data-filter]');
const serviceCards = document.querySelectorAll('[data-service]');

filters.forEach((filter) => filter.addEventListener('click', () => {
  const category = filter.dataset.filter;
  filters.forEach((item) => {
    const active = item === filter;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  serviceCards.forEach((card) => {
    const categories = card.dataset.category.split(' ');
    card.hidden = category !== 'all' && !categories.includes(category);
  });
}));

const form = document.querySelector('[data-quote-form]');
const serviceSelect = document.querySelector('#service');
const status = document.querySelector('[data-form-status]');

document.querySelectorAll('.choose-service').forEach((button) => button.addEventListener('click', () => {
  const card = button.closest('[data-service]');
  serviceSelect.value = card.dataset.service;
  document.querySelector('#quote')?.scrollIntoView({ behavior: 'smooth' });
  window.setTimeout(() => serviceSelect.focus({ preventScroll: true }), 550);
}));

const valueOf = (name) => String(new FormData(form).get(name) || '').trim();
const requestSummary = () => {
  const data = new FormData(form);
  const details = data.getAll('details');
  return [
    'OUTBACK SITE SERVICES — QUOTE REQUEST',
    '',
    `Service: ${valueOf('service') || 'Not selected'}`,
    `Project city: ${valueOf('location') || 'Not provided'}`,
    `Approx. square footage: ${valueOf('size') || 'Not provided'}`,
    `Desired timing: ${valueOf('timeline') || 'Not provided'}`,
    `Property / project type: ${valueOf('property') || 'Not provided'}`,
    `Helpful details: ${details.length ? details.join(', ') : 'None selected'}`,
    '',
    'Project notes:',
    valueOf('notes') || 'None provided',
    '',
    `Name: ${valueOf('name') || 'Not provided'}`,
    `Phone or email: ${valueOf('contact') || 'Not provided'}`,
    '',
    'Please contact me to discuss availability and pricing. Thank you.'
  ].join('\n');
};

const showStatus = (message, error = false) => {
  status.textContent = message;
  status.style.color = error ? '#9a301b' : '';
  status.style.background = error ? '#f8e4df' : '';
};

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const service = valueOf('service');
  const subject = `Quote Request — ${service}`;
  const mailto = `mailto:outbacksiteservices26@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestSummary())}`;
  showStatus('Your quote request is ready. Opening your email app now…');
  window.location.href = mailto;
});

document.querySelector('[data-copy-summary]')?.addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  try {
    await navigator.clipboard.writeText(requestSummary());
    showStatus('Quote request copied. Paste it into a text or email when you’re ready.');
  } catch {
    showStatus('Copy was blocked by your browser. Select “Prepare my email” instead.', true);
  }
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();

