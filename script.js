const events = [
  ['JUL', '19', 'Design Thinking Lab', 'Workshop · 2:00 PM'],
  ['JUL', '21', 'Inter-Block Football', 'Sports · 4:30 PM'],
  ['JUL', '23', 'Open Mic Evening', 'Cultural · 5:00 PM'],
  ['JUL', '26', 'Build with AI', 'Tech · 11:00 AM']
];

const eventList = document.querySelector('#eventList');
let eventOffset = 0;

function renderEvents() {
  eventList.innerHTML = events
    .slice(eventOffset, eventOffset + 3)
    .map(
      ([month, date, name, details]) => `
        <article class="event-row">
          <div class="date-box">${month}<b>${date}</b></div>
          <div>
            <h4>${name}</h4>
            <p>${details}</p>
          </div>
          <button aria-label="View ${name}">→</button>
        </article>
      `
    )
    .join('');
}

renderEvents();

document.querySelector('#nextEvent').addEventListener('click', () => {
  eventOffset = (eventOffset + 1) % (events.length - 2);
  renderEvents();
});

document.querySelector('#previousEvent').addEventListener('click', () => {
  eventOffset = (eventOffset + events.length - 3) % (events.length - 2);
  renderEvents();
});

const items = [
  ['◈', 'Coding Club', 'Club'],
  ['◴', 'NEXUS 25', 'Cultural fest'],
  ['⌁', 'Learn Figma', 'Skill exchange'],
  ['▱', 'Calculus textbook', 'Marketplace'],
  ['⌖', 'Central Library', 'Campus guide']
];

const search = document.querySelector('#globalSearch');
const results = document.querySelector('#searchResults');

function showResults() {
  const q = search.value.toLowerCase().trim();
  const found = items.filter(
    (x) => x[1].toLowerCase().includes(q) || x[2].toLowerCase().includes(q)
  );

  if (!q) {
    results.classList.remove('visible');
    return;
  }

  results.innerHTML = (found.length ? found : items)
    .map(
      ([i, n, t]) => `
        <div class="search-result">
          <span class="result-mark">${i}</span>
          <span><b>${n}</b><br><small>${t}</small></span>
        </div>
      `
    )
    .join('');
  results.classList.add('visible');
}

search.addEventListener('input', showResults);
search.addEventListener('focus', showResults);

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) {
    results.classList.remove('visible');
  }
});

document.querySelectorAll('[data-search]').forEach((button) =>
  button.addEventListener('click', () => {
    search.value = button.dataset.search;
    search.focus();
    showResults();
  })
);

const toast = document.querySelector('#toast');

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

document
  .querySelector('#searchButton')
  .addEventListener('click', () => notify('Search is ready for backend results.'));

document
  .querySelector('#joinButton')
  .addEventListener('click', () => notify('Welcome aboard — sign-up will connect here soon.'));

document
  .querySelector('.notification-button')
  .addEventListener('click', () => notify('You have 3 campus updates.'));

document
  .querySelectorAll('.access-card, .community-card a, .event-row button, .soft-button')
  .forEach((el) =>
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A') e.preventDefault();
      notify('This space is ready to connect to its future page.');
    })
  );

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const counters = document.querySelectorAll('[data-target]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = +el.dataset.target;
      const start = performance.now();
      const duration = 1300;

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(
          target * (1 - Math.pow(1 - progress, 3))
        ).toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

counters.forEach((el) => counterObserver.observe(el));

// Mobile navigation keeps the page fully usable on smaller screens.
const drawer = document.querySelector('#mobileDrawer');
const menuButton = document.querySelector('.menu-button');
const drawerClose = document.querySelector('#drawerClose');

function setDrawer(open) {
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}

menuButton.addEventListener('click', () => setDrawer(true));
drawerClose.addEventListener('click', () => setDrawer(false));
drawer.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => setDrawer(false))
);

document.querySelectorAll('.link-button').forEach((button) =>
  button.addEventListener('click', () =>
    notify(`${button.dataset.action} is ready to connect to live campus data.`)
  )
);

// Event rows are re-rendered by the carousel, so delegate their future interaction.
eventList.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (button) notify('Event details and registration will open here.');
});
