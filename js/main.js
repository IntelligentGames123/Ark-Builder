// Mobile menu, game filter tabs, contact form and footer year.
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  const tabs = document.querySelectorAll('.tab');
  const cards = document.querySelectorAll('.game-card');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      const f = tab.dataset.filter;
      cards.forEach((c) => { c.hidden = f !== 'all' && c.dataset.subject !== f; });
    });
  });

  // No backend yet: open the visitor's email app with the message filled in.
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const subject = encodeURIComponent('Enquiry from ' + d.get('name') + ' (' + d.get('role') + ')');
    const body = encodeURIComponent(d.get('message') + '\n\n' + d.get('name') + '\n' + d.get('email'));
    window.location.href = 'mailto:hello@intelligentgames4u.com?subject=' + subject + '&body=' + body;
    document.getElementById('form-note').textContent = 'Thank you! Your email app should open so you can send your message.';
  });

  // Donate button uses the donation link from config.js when one is set.
  const cfg = window.IG4U_CONFIG || {};
  if (cfg.donateLink) {
    const btn = document.getElementById('donate-btn');
    btn.href = cfg.donateLink;
    btn.target = '_blank';
    btn.rel = 'noopener';
  } else {
    document.getElementById('donate-note').textContent = 'Online donations are coming soon. Get in touch below to give today.';
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
