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

// Website inquiries stay separate from cleaning quote requests.
const webForm = document.querySelector('[data-web-quote-form]');
const webPackage = document.querySelector('#web-package');
const webStatus = document.querySelector('[data-web-status]');
const websiteRequestSummary = () => {
  const data = new FormData(webForm);
  const value = (key) => String(data.get(key) || '').trim() || 'Not provided';
  return ['OUTBACK WEB DESIGN — FREE WEBSITE QUOTE REQUEST', '',
    `Name: ${value('name')}`, `Business: ${value('business')}`, `Email: ${value('email')}`,
    `Phone: ${value('phone')}`, `Current website: ${value('website')}`,
    `Package: ${value('package')}`, `Monthly maintenance: ${value('maintenance')}`,
    `Features needed: ${value('features')}`, '', 'Project details:', value('details'), '',
    'Please contact me with a free, no-obligation website quote.'].join('\n');
};
document.querySelectorAll('[data-web-package]').forEach((link) => link.addEventListener('click', () => {
  webPackage.value = link.dataset.webPackage;
}));
webForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!webForm.reportValidity()) return;
  webStatus.textContent = 'Opening your email app. Review and send your request to complete your inquiry.';
  window.location.href = `mailto:outbacksiteservices26@gmail.com?subject=${encodeURIComponent('Outback Web Design — Free Website Quote Request')}&body=${encodeURIComponent(websiteRequestSummary())}`;
});
document.querySelector('[data-web-copy]')?.addEventListener('click', async () => {
  if (!webForm.reportValidity()) return;
  try {
    await navigator.clipboard.writeText(websiteRequestSummary());
    webStatus.textContent = 'Request copied. Paste it into an email to outbacksiteservices26@gmail.com or a text to 435-241-8611.';
  } catch {
    webStatus.textContent = 'Your browser could not copy the request. Use “Prepare my free quote email” instead.';
  }
});
