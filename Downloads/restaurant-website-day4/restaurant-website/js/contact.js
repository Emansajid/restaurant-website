/* ==========================================
   SAVEUR RESTAURANT - Contact Page JavaScript
   Full Form Validation
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAVBAR ----
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');
  navbar.classList.add('scrolled');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    backToTop.classList.toggle('show', window.scrollY > 400);
  });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- HAMBURGER ----
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---- SCROLL REVEAL ----
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ---- FORM VALIDATION ----
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');
  const formSuccess = document.getElementById('formSuccess');

  // Validate single field
  function validateField(field) {
    const id = field.id;
    const val = field.value.trim();
    const wrap = field.closest('.input-wrap') || field.parentElement;
    const icon = wrap.querySelector('.input-icon');
    const errMsg = document.getElementById(id + 'Error');
    const okMsg  = document.getElementById(id + 'Ok');

    let isValid = true;
    let errorText = '';

    // Rules per field
    if (id === 'fname' || id === 'lname') {
      if (!val) { isValid = false; errorText = 'This field is required.'; }
      else if (val.length < 2) { isValid = false; errorText = 'Must be at least 2 characters.'; }
    }

    if (id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) { isValid = false; errorText = 'Email address is required.'; }
      else if (!emailRegex.test(val)) { isValid = false; errorText = 'Please enter a valid email address.'; }
    }

    if (id === 'phone') {
      if (val && !/^[\d\s\+\-\(\)]{7,15}$/.test(val)) {
        isValid = false; errorText = 'Enter a valid phone number.';
      }
    }

    if (id === 'subject') {
      if (!val) { isValid = false; errorText = 'Please select a subject.'; }
    }

    if (id === 'message') {
      if (!val) { isValid = false; errorText = 'Message cannot be empty.'; }
      else if (val.length < 20) { isValid = false; errorText = `At least 20 characters required (${val.length}/20).`; }
    }

    // Apply states
    field.classList.toggle('error', !isValid);
    field.classList.toggle('success', isValid && val !== '');

    if (icon) {
      icon.className = 'input-icon';
      if (val !== '') {
        icon.classList.add('show', isValid ? 'success' : 'error');
        icon.innerHTML = isValid
          ? '<i class="fa-solid fa-circle-check"></i>'
          : '<i class="fa-solid fa-circle-exclamation"></i>';
      }
    }

    if (errMsg) {
      errMsg.textContent = errorText;
      errMsg.classList.toggle('show', !isValid);
    }
    if (okMsg) {
      okMsg.classList.toggle('show', isValid && val !== '');
    }

    return isValid || val === ''; // empty optional fields pass
  }

  // Validate required fields only
  function validateRequired(field) {
    const optionalFields = ['phone'];
    if (optionalFields.includes(field.id)) return true;
    return validateField(field) && field.value.trim() !== '';
  }

  // Live validation on blur
  form.querySelectorAll('.form-control').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  // Character counter for message
  const msgField = document.getElementById('message');
  const charCounter = document.getElementById('charCounter');
  const maxChars = 500;

  msgField.addEventListener('input', () => {
    const len = msgField.value.length;
    charCounter.textContent = `${len} / ${maxChars}`;
    charCounter.className = 'char-counter';
    if (len > maxChars * 0.8) charCounter.classList.add('warn');
    if (len >= maxChars) charCounter.classList.add('limit');
  });

  // ---- FORM SUBMIT ----
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all required fields
    const fields = ['fname', 'lname', 'email', 'subject', 'message'];
    let allValid = true;

    fields.forEach(id => {
      const field = document.getElementById(id);
      const valid = validateField(field) && field.value.trim() !== '';
      if (!valid) allValid = false;
    });

    // Also validate phone if filled
    const phone = document.getElementById('phone');
    if (phone.value.trim()) validateField(phone);

    if (!allValid) {
      // Scroll to first error
      const firstError = form.querySelector('.form-control.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Simulate sending
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('show');
    }, 1800);
  });

  // Reset form
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      formSuccess.classList.remove('show');
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
      form.querySelectorAll('.form-control').forEach(f => {
        f.classList.remove('error', 'success');
      });
      form.querySelectorAll('.input-icon').forEach(i => i.className = 'input-icon');
      form.querySelectorAll('.field-msg').forEach(m => m.classList.remove('show'));
      charCounter.textContent = '0 / 500';
      charCounter.className = 'char-counter';
    });
  }

});
