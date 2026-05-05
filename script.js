/* =============================================
   MILESTONE COFFEE & PASTRY SHOP
   Main JavaScript File
   ============================================= */

// ── Preloader ──────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 1200);
});

document.body.style.overflow = 'hidden';

// ── Navbar scroll behavior ─────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  // Back to top button
  const btt = document.getElementById('back-to-top');
  if (btt) {
    if (window.scrollY > 400) btt.classList.add('visible');
    else btt.classList.remove('visible');
  }
});

// ── Mobile Navigation ──────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavClose = document.querySelector('.mobile-nav-close');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileNav?.classList.toggle('open');
});

mobileNavClose?.addEventListener('click', () => {
  hamburger?.classList.remove('active');
  mobileNav?.classList.remove('open');
});

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    mobileNav?.classList.remove('open');
  });
});

// ── Active nav link ────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Back to top ────────────────────────────────
document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Scroll Reveal Animations ───────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ── Hero background Ken Burns effect ──────────
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  setTimeout(() => heroBg.classList.add('loaded'), 100);
}

// ── Testimonials Carousel ──────────────────────
const track = document.querySelector('.testimonials-track');
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.testimonial-dot');
let currentSlide = 0;
let autoplayInterval;

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

document.querySelector('.prev-btn')?.addEventListener('click', () => {
  goToSlide(currentSlide - 1);
  resetAutoplay();
});

document.querySelector('.next-btn')?.addEventListener('click', () => {
  goToSlide(currentSlide + 1);
  resetAutoplay();
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    goToSlide(i);
    resetAutoplay();
  });
});

function startAutoplay() {
  autoplayInterval = setInterval(() => goToSlide(currentSlide + 1), 4500);
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

if (slides.length > 0) {
  goToSlide(0);
  startAutoplay();
}

// ── Menu Tabs Filter ───────────────────────────
const menuTabs = document.querySelectorAll('.menu-tab');
const menuCards = document.querySelectorAll('.menu-card');

menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    menuTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    menuCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ── Contact Form Validation ────────────────────
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const fields = [
    { id: 'contact-name', errId: 'name-err', msg: 'Name is required' },
    { id: 'contact-email', errId: 'email-err', msg: 'Valid email required', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { id: 'contact-phone', errId: 'phone-err', msg: 'Phone number required' },
    { id: 'contact-message', errId: 'message-err', msg: 'Message is required' }
  ];

  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    if (!input || !err) return;
    if (!input.value.trim() || (f.pattern && !f.pattern.test(input.value))) {
      err.classList.add('visible');
      input.style.borderColor = '#e53935';
      valid = false;
    } else {
      err.classList.remove('visible');
      input.style.borderColor = '';
    }
  });

  if (valid) {
    showToast('✅ Message sent! We\'ll get back to you soon.');
    contactForm.reset();
  }
});

// ── Order System ───────────────────────────────
const orderItems = document.querySelectorAll('.order-item');
const selectedItems = new Map();
let selectedPayment = 'cod';

orderItems.forEach(item => {
  item.addEventListener('click', () => {
    const id = item.dataset.id;
    const name = item.dataset.name;
    const price = parseInt(item.dataset.price);
    
    if (selectedItems.has(id)) {
      selectedItems.delete(id);
      item.classList.remove('selected');
    } else {
      selectedItems.set(id, { name, price });
      item.classList.add('selected');
    }
    updateOrderSummary();
  });
});

function updateOrderSummary() {
  const summaryEl = document.getElementById('order-items-list');
  const totalEl = document.getElementById('order-total');
  if (!summaryEl || !totalEl) return;
  
  if (selectedItems.size === 0) {
    summaryEl.innerHTML = '<p class="summary-empty">No items selected yet</p>';
    totalEl.textContent = 'BDT 0';
    return;
  }
  
  let total = 0;
  let html = '';
  selectedItems.forEach(item => {
    total += item.price;
    html += `<div class="summary-item">
      <span class="summary-item-name">${item.name}</span>
      <span class="summary-item-price">BDT ${item.price}</span>
    </div>`;
  });
  
  summaryEl.innerHTML = html;
  totalEl.textContent = `BDT ${total}`;
}

// Payment buttons
document.querySelectorAll('.payment-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedPayment = btn.dataset.payment;
  });
});

// Order form submit
const orderForm = document.getElementById('order-form');
orderForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('order-name')?.value.trim();
  const phone = document.getElementById('order-phone')?.value.trim();
  const address = document.getElementById('order-address')?.value.trim();
  
  let valid = true;
  if (!name) { showFieldError('order-name', 'Name is required'); valid = false; }
  if (!phone) { showFieldError('order-phone', 'Phone number is required'); valid = false; }
  if (!address) { showFieldError('order-address', 'Address is required'); valid = false; }
  if (selectedItems.size === 0) {
    showToast('⚠️ Please select at least one item');
    valid = false;
  }
  
  if (valid) {
    let total = 0;
    selectedItems.forEach(item => total += item.price);
    showToast(`🎉 Order placed! Total: BDT ${total} via ${selectedPayment.toUpperCase()}`);
    orderForm.reset();
    selectedItems.clear();
    orderItems.forEach(i => i.classList.remove('selected'));
    updateOrderSummary();
  }
});

function showFieldError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  if (field) field.style.borderColor = '#e53935';
}

// ── Toast Notification ─────────────────────────
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ── Add to Cart from Menu ──────────────────────
document.querySelectorAll('.menu-card-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.menu-card');
    const name = card.querySelector('.menu-card-name')?.textContent;
    showToast(`✅ ${name} added to your order!`);
    // visual pulse
    btn.textContent = '✓ Added';
    btn.style.background = 'var(--gold)';
    btn.style.color = 'var(--dark-brown)';
    setTimeout(() => {
      btn.textContent = 'Order Now';
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  });
});

// ── CSS animation keyframes added dynamically ──
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);
