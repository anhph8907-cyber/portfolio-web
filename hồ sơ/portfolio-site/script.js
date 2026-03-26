const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const editToggle = document.getElementById('toggleEdit');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const yearEl = document.getElementById('footerYear');
const projectModal = document.getElementById('projectModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalLink = document.getElementById('modalLink');
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');
const pageTransition = document.getElementById('page-transition');
const editableElements = document.querySelectorAll('[contenteditable="true"]');

// Theme
function initTheme() {
  const saved = localStorage.getItem('my_portfolio_theme');
  const current = saved || 'light';
  if (current === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀';
  } else {
    body.removeAttribute('data-theme');
    themeToggle.textContent = '☾';
  }
}

function saveTheme(theme) {
  localStorage.setItem('my_portfolio_theme', theme);
}

themeToggle.addEventListener('click', () => {
  if (body.getAttribute('data-theme') === 'dark') {
    body.removeAttribute('data-theme');
    themeToggle.textContent = '☾';
    saveTheme('light');
  } else {
    body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀';
    saveTheme('dark');
  }
});

// Edit mode
let editable = false;

function setEditable(state) {
  editable = state;
  editableElements.forEach((el) => {
    el.contentEditable = state;
    el.classList.toggle('editing', state);
  });
  editToggle.textContent = state ? 'Save mode' : 'Edit mode';
  localStorage.setItem('my_portfolio_edit', JSON.stringify(state));
}

editToggle.addEventListener('click', () => setEditable(!editable));

function initEditMode() {
  const saved = JSON.parse(localStorage.getItem('my_portfolio_edit')) || false;
  setEditable(saved);
}

// preserve content changes
editableElements.forEach((el) => {
  el.addEventListener('input', () => {
    const identifier = el.id || el.dataset.key || el.nodeName + '_' + Math.random().toString(36).substr(2, 5);
    localStorage.setItem(`cv_${identifier}`, el.innerHTML);
  });
});

function restoreContent() {
  editableElements.forEach((el) => {
    const identifier = el.id || el.dataset.key || el.nodeName + '_' + Array.from(editableElements).indexOf(el);
    const saved = localStorage.getItem(`cv_${identifier}`);
    if (saved) el.innerHTML = saved;
  });
}

// smooth reveal on scroll
const revealItems = document.querySelectorAll('[data-reveal]');

function reveal() {
  const scrollY = window.scrollY + window.innerHeight;
  revealItems.forEach((item) => {
    if (scrollY > item.offsetTop + 100) item.classList.add('reveal');
  });
}

window.addEventListener('scroll', reveal);
window.addEventListener('load', () => {
  reveal();
  initTheme();
  initEditMode();
  restoreContent();
  yearEl.textContent = new Date().getFullYear();
  setTimeout(() => pageTransition.style.opacity = '0', 250);
});

// nav hamburger
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// smooth scroll
document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    navLinks.classList.remove('open');
  });
});

// project modal data loaded from project-data.js (shared data file)


document.querySelectorAll('[data-project]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const id = e.currentTarget.dataset.project;
    if (projects[id]) {
      const project = projects[id];

      // Cập nhật title
      modalTitle.textContent = project.title;

      // Cập nhật hình ảnh
      const modalImages = document.getElementById('modalImages');
      modalImages.innerHTML = '';
      project.images.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = project.title;
        img.style.width = '100%';
        img.style.maxWidth = '300px';
        img.style.borderRadius = '8px';
        img.style.margin = '0.5rem';
        modalImages.appendChild(img);
      });

      // Cập nhật thông tin chi tiết
      document.getElementById('modalRole').textContent = project.role;
      document.getElementById('modalSkills').textContent = project.skills;
      document.getElementById('modalResults').textContent = project.results;

      // Cập nhật link
      modalLink.href = project.url;
      modalLink.textContent = 'Xem Dự Án';

      try { projectModal.showModal(); } catch (err) { projectModal.setAttribute('open', ''); }
    }
  });
});

closeModal.addEventListener('click', () => projectModal.close());
projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) projectModal.close();
});

// contact form submit
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const email = e.target.email.value;
  const message = e.target.message.value;

  contactStatus.textContent = 'Sending...';
  setTimeout(() => {
    contactStatus.textContent = `Thanks ${name}! Message delivered.`;
    e.target.reset();
  }, 800);
});

// page transitions via navigation
window.addEventListener('beforeunload', () => {
  pageTransition.style.opacity = '1';
});
