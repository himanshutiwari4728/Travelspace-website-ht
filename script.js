/* =============================================
   TravelScape — JavaScript
   ============================================= */

/* ---------- Theme Toggle ---------- */
const root = document.documentElement;
const themeBtn = document.querySelector('[data-theme-toggle]');
let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
root.setAttribute('data-theme', theme);
themeBtn.textContent = theme === 'dark' ? '☀' : '☾';
themeBtn.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '☀' : '☾';
  themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
});

/* ---------- Mobile Menu ---------- */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ---------- FAQ Accordion ---------- */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => btn.parentElement.classList.toggle('active'));
});

/* ---------- Scroll Reveal ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ---------- Contact Form ---------- */
document.querySelector('.contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const button = e.target.querySelector('button[type="submit"]');
  const original = button.textContent;
  button.textContent = 'Enquiry sent';
  button.disabled = true;
  setTimeout(() => {
    button.textContent = original;
    button.disabled = false;
    e.target.reset();
  }, 1800);
});

/* ---------- Auth Modal ---------- */
const authModal = document.getElementById('authModal');
const authClose = document.getElementById('authClose');
const authTabs = document.querySelectorAll('.auth-tab');
const authPanels = document.querySelectorAll('.auth-panel');
const openButtons = document.querySelectorAll('[data-open-auth]');
const closeButtons = document.querySelectorAll('[data-close-auth]');

// In-memory accounts store
const accounts = [];

function switchAuthTab(target) {
  authTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.authTab === target));
  authPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.authPanel === target));
}
function openAuth(target = 'signup') {
  switchAuthTab(target);
  authModal.classList.add('open');
  authModal.setAttribute('aria-hidden', 'false');
}
function closeAuth() {
  authModal.classList.remove('open');
  authModal.setAttribute('aria-hidden', 'true');
}

openButtons.forEach(btn => btn.addEventListener('click', () => openAuth(btn.dataset.openAuth)));
closeButtons.forEach(btn => btn.addEventListener('click', closeAuth));
authClose.addEventListener('click', closeAuth);
authTabs.forEach(tab => tab.addEventListener('click', () => switchAuthTab(tab.dataset.authTab)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && authModal.classList.contains('open')) closeAuth();
});

/* ---------- Validation Helpers ---------- */
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function strongPassword(value) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(value);
}
function setError(input, message) {
  input.classList.add('invalid');
  input.parentElement.querySelector('.error-text').textContent = message;
}
function clearError(input) {
  input.classList.remove('invalid');
  input.parentElement.querySelector('.error-text').textContent = '';
}
function clearFormMessages(form) {
  form.querySelectorAll('input').forEach(clearError);
  form.querySelector('.auth-success').textContent = '';
}

/* ---------- Sign Up Form ---------- */
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearFormMessages(signupForm);
  const name = signupForm.name.value.trim();
  const email = signupForm.email.value.trim().toLowerCase();
  const password = signupForm.password.value;
  const confirmPassword = signupForm.confirmPassword.value;
  let valid = true;

  if (name.length < 3) {
    setError(signupForm.name, 'Name must be at least 3 characters.');
    valid = false;
  }
  if (!isEmail(email)) {
    setError(signupForm.email, 'Enter a valid email address.');
    valid = false;
  }
  if (!strongPassword(password)) {
    setError(signupForm.password, 'Use 8+ chars with uppercase, lowercase, number, and special symbol.');
    valid = false;
  }
  if (confirmPassword !== password || !confirmPassword) {
    setError(signupForm.confirmPassword, 'Passwords do not match.');
    valid = false;
  }
  if (accounts.some(acc => acc.email === email)) {
    setError(signupForm.email, 'This email is already registered.');
    valid = false;
  }
  if (!valid) return;

  accounts.push({ name, email, password });
  signupForm.querySelector('.auth-success').textContent =
    'Account created successfully. You can now sign in.';
  signupForm.reset();
  setTimeout(() => switchAuthTab('signin'), 800);
});

/* ---------- Sign In Form ---------- */
const signinForm = document.getElementById('signinForm');
signinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearFormMessages(signinForm);
  const email = signinForm.email.value.trim().toLowerCase();
  const password = signinForm.password.value;
  let valid = true;

  if (!isEmail(email)) {
    setError(signinForm.email, 'Enter a valid registered email.');
    valid = false;
  }
  if (!password) {
    setError(signinForm.password, 'Password is required.');
    valid = false;
  }
  if (!valid) return;

  const user = accounts.find(acc => acc.email === email && acc.password === password);
  if (!user) {
    setError(signinForm.password, 'Invalid email or password.');
    return;
  }
  signinForm.querySelector('.auth-success').textContent = `Welcome back, ${user.name}.`;
  signinForm.reset();
});

/* ---------- Login Form ---------- */
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearFormMessages(loginForm);
  const email = loginForm.email.value.trim().toLowerCase();
  const password = loginForm.password.value;
  let valid = true;

  if (!email) {
    setError(loginForm.email, 'Email is required.');
    valid = false;
  } else if (!isEmail(email)) {
    setError(loginForm.email, 'Invalid email format.');
    valid = false;
  }
  if (!password) {
    setError(loginForm.password, 'Password is required.');
    valid = false;
  } else if (password.length < 8) {
    setError(loginForm.password, 'Password must be at least 8 characters.');
    valid = false;
  }
  if (!valid) return;

  const user = accounts.find(acc => acc.email === email);
  if (!user) {
    setError(loginForm.email, 'No account found with this email.');
    return;
  }
  if (user.password !== password) {
    setError(loginForm.password, 'Incorrect password.');
    return;
  }
  loginForm.querySelector('.auth-success').textContent = `Login successful. Hello, ${user.name}.`;
  loginForm.reset();
});

/* ---------- Clear errors on input ---------- */
document.querySelectorAll('.auth-form input').forEach(input => {
  input.addEventListener('input', () => clearError(input));
});
