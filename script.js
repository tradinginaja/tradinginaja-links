// ============================================
// TRADINGINAJA_ LINKTREE — MAIN SCRIPT
// Handles: Testimonial Carousel, Products Dropdown
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initProducts();
});

// ── Testimonial Carousel ──────────────────────
function initCarousel() {
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const section = document.getElementById('testimonials');

  // Check if TESTIMONIALS data exists and has items
  if (typeof TESTIMONIALS === 'undefined' || !TESTIMONIALS.length) {
    track.innerHTML = `
      <div class="no-testimonials">
        <i class="fas fa-image"></i>
        <p>Testimoni akan segera hadir!</p>
      </div>
    `;
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    return;
  }

  let currentSlide = 0;
  let autoSlideTimer = null;
  const totalSlides = TESTIMONIALS.length;
  const interval = typeof SLIDE_INTERVAL !== 'undefined' ? SLIDE_INTERVAL : 5000;

  // Build slides
  TESTIMONIALS.forEach((item, idx) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `<img src="${item.url}" alt="${item.alt || 'Testimoni ' + (idx + 1)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'no-testimonials\\'><i class=\\'fas fa-image\\'></i><p>Gagal memuat gambar</p></div>'">`;
    track.appendChild(slide);
  });

  // Build dots
  TESTIMONIALS.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${idx + 1}`);
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  // Hide buttons if only one slide
  if (totalSlides <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    dotsContainer.style.display = 'none';
    return;
  }

  function goToSlide(index) {
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));

    resetAutoSlide();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Controls
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Touch / Swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  const carouselContainer = track.parentElement;

  carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  }, { passive: true });

  // Pause auto-slide on hover
  carouselContainer.addEventListener('mouseenter', () => {
    clearInterval(autoSlideTimer);
  });

  carouselContainer.addEventListener('mouseleave', () => {
    startAutoSlide();
  });

  // Auto slide
  function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, interval);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  startAutoSlide();
}

// ── Products Dropdown ─────────────────────────
function initProducts() {
  const toggle = document.getElementById('products-toggle');
  const list = document.getElementById('products-list');
  const arrow = document.getElementById('toggle-arrow');

  if (!toggle || !list) return;

  toggle.addEventListener('click', () => {
    const isOpen = list.classList.contains('open');

    if (isOpen) {
      list.classList.remove('open');
      toggle.classList.remove('active');
      arrow.classList.remove('rotated');
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      list.classList.add('open');
      toggle.classList.add('active');
      arrow.classList.add('rotated');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
}
