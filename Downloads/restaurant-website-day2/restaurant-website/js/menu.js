/* ==========================================
   SAVEUR RESTAURANT - Menu Page JavaScript
   Search + Category Filter + Interactions
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- ELEMENTS ----
  const searchInput   = document.getElementById('menuSearch');
  const categoryTabs  = document.querySelectorAll('.cat-tab');
  const menuCards     = document.querySelectorAll('.menu-card');
  const categoryGroups= document.querySelectorAll('.category-group');
  const noResults     = document.getElementById('noResults');
  const itemsCountEl  = document.getElementById('itemsCount');
  const cartToast     = document.getElementById('cartToast');
  const toastName     = document.getElementById('toastName');

  let activeCategory  = 'all';
  let searchQuery     = '';

  // ---- FILTER FUNCTION ----
  function applyFilters() {
    let visibleCount = 0;

    categoryGroups.forEach(group => {
      const groupCategory = group.dataset.category;
      const cards = group.querySelectorAll('.menu-card');
      let groupVisible = 0;

      cards.forEach(card => {
        const name     = card.dataset.name.toLowerCase();
        const category = card.dataset.category;
        const tags     = card.dataset.tags ? card.dataset.tags.toLowerCase() : '';

        const matchesCategory = activeCategory === 'all' || category === activeCategory;
        const matchesSearch   = name.includes(searchQuery) || tags.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          card.classList.remove('hidden');
          groupVisible++;
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      // Hide the entire group section if no cards visible
      group.classList.toggle('hidden', groupVisible === 0);
    });

    // Update count
    itemsCountEl.innerHTML = `<span>${visibleCount}</span> item${visibleCount !== 1 ? 's' : ''} found`;

    // No results state
    noResults.classList.toggle('show', visibleCount === 0);
  }

  // ---- SEARCH ----
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    applyFilters();
  });

  // ---- CATEGORY TABS ----
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category;
      applyFilters();
    });
  });

  // ---- ORDER BUTTON: Toast Notification ----
  document.querySelectorAll('.card-order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.menu-card');
      const name = card.dataset.name;
      toastName.textContent = name;

      cartToast.classList.add('show');
      clearTimeout(window._toastTimer);
      window._toastTimer = setTimeout(() => {
        cartToast.classList.remove('show');
      }, 2800);
    });
  });

  // ---- FAVOURITE BUTTON ----
  document.querySelectorAll('.card-fav').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('liked');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('liked')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
      } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
      }
    });
  });

  // ---- SCROLL REVEAL ----
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));

  // ---- STAGGER CARDS ----
  menuCards.forEach((card, i) => {
    card.style.transitionDelay = `${(i % 3) * 0.08}s`;
    card.classList.add('reveal');
    observer.observe(card);
  });

  // ---- NAVBAR SCROLL ----
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    backToTop.classList.toggle('show', window.scrollY > 400);
  });

  // always scrolled on inner pages
  navbar.classList.add('scrolled');

  // ---- BACK TO TOP ----
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

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

  // Initial count
  applyFilters();
});
