const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const formAlert = document.getElementById('formAlert');
const loginBtn = document.getElementById('loginBtn');
const btnText = loginBtn.querySelector('.btn-text');
const togglePass = document.getElementById('togglePass');
const remember = document.getElementById('remember');

const DEMO_EMAIL = 'demo@sr.com';
const DEMO_PASSWORD = 'Demo@123';

// Restore remembered email
const savedEmail = localStorage.getItem('rememberedEmail');
if (savedEmail) {
  emailInput.value = savedEmail;
  remember.checked = true;
}

// Show / hide password
togglePass.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  togglePass.innerHTML = isHidden
    ? '<i class="fa-regular fa-eye-slash"></i>'
    : '<i class="fa-regular fa-eye"></i>';
});

// Validators
function validateEmail() {
  const value = emailInput.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value === '') return setState(emailInput, emailError, 'Email is required');
  if (!pattern.test(value)) return setState(emailInput, emailError, 'Enter a valid email address');
  return setState(emailInput, emailError, '');
}

function validatePassword() {
  const value = passwordInput.value;
  if (value === '') return setState(passwordInput, passwordError, 'Password is required');
  if (value.length < 6) return setState(passwordInput, passwordError, 'Password must be at least 6 characters');
  return setState(passwordInput, passwordError, '');
}

function setState(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.toggle('invalid', message !== '');
  input.classList.toggle('valid', message === '');
  return message === '';
}

function showAlert(message, type) {
  formAlert.textContent = message;
  formAlert.className = 'alert show ' + (type === 'success' ? 'success-box' : 'error-box');
}

// Live validation
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);
emailInput.addEventListener('input', () => { if (emailInput.classList.contains('invalid')) validateEmail(); });
passwordInput.addEventListener('input', () => { if (passwordInput.classList.contains('invalid')) validatePassword(); });

// Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  formAlert.className = 'alert';

  const emailOk = validateEmail();
  const passOk = validatePassword();
  if (!emailOk || !passOk) return;

  // Loading state
  loginBtn.classList.add('loading');
  loginBtn.disabled = true;
  btnText.textContent = 'Signing in...';

  // Simulated server delay (front end only)
  setTimeout(() => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      if (remember.checked) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      showAlert('Login successful. Welcome back!', 'success');
      btnText.textContent = 'Signed in';
      loginBtn.classList.remove('loading');
    } else {
      showAlert('Invalid email or password. Please try again.', 'error');
      btnText.textContent = 'Sign in';
      loginBtn.classList.remove('loading');
      loginBtn.disabled = false;
    }
  }, 1200);
});
// Social sign-in (simulated)
document.querySelectorAll('.social-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const provider = btn.dataset.provider;
    const original = btn.innerHTML;

    document.querySelectorAll('.social-btn').forEach((b) => (b.disabled = true));
    btn.textContent = 'Connecting...';
    formAlert.className = 'alert';

    setTimeout(() => {
      btn.innerHTML = original;
      document.querySelectorAll('.social-btn').forEach((b) => (b.disabled = false));
      showAlert('Signed in with ' + provider + ' (demo).', 'success');
    }, 1200);
  });
});
