// =========================================================
// slider.js — Компонент слайдера (карусель)
// Infinite loop, autoplay, keyboard, dots, arrows
// =========================================================

'use strict';

/**
 * Фабрична функція для створення слайдера
 * @param {string} containerId ID контейнера слайдера
 * @param {Object} options Параметри конфігурації
 * @returns {Object} Публічне API слайдера
 */
const createSlider = (containerId, options = {}) => {
  // ── Налаштування з дефолтами ──
  const config = {
    duration:      options.duration     ?? 500,        // мс переходу
    autoplay:      options.autoplay     ?? true,       // автоматичне прокручування
    autoplayDelay: options.autoplayDelay ?? 3500,      // мс між слайдами
    showArrows:    options.showArrows   ?? true,        // показувати стрілки
    showDots:      options.showDots     ?? true,        // показувати точки
  };

  // ── Стан ──
  let currentIndex = 0;
  let autoplayTimer = null;
  let isTransitioning = false;

  // ── DOM елементи ──
  const container = document.getElementById(containerId);
  if (!container) return null;

  const track = container.querySelector('.slider-track');
  const prevBtn = container.querySelector('.slider-arrow-prev');
  const nextBtn = container.querySelector('.slider-arrow-next');
  const dotsContainer = container.querySelector('.slider-dots');

  if (!track) return null;

  const slides = Array.from(track.querySelectorAll('.slide'));
  const totalSlides = slides.length;

  if (totalSlides === 0) return null;

  // ── Ховаємо/показуємо елементи керування ──
  if (prevBtn) prevBtn.style.display = config.showArrows ? '' : 'none';
  if (nextBtn) nextBtn.style.display = config.showArrows ? '' : 'none';
  if (dotsContainer) dotsContainer.style.display = config.showDots ? '' : 'none';

  // ── Dots (точки навігації) ──

  /**
   * Рендерить точки пагінації
   */
  const renderDots = () => {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = slides.map((_, i) =>
      `<button class="slider-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Слайд ${i + 1}"></button>`
    ).join('');

    dotsContainer.querySelectorAll('.slider-dot').forEach(dot => {
      dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
    });
  };

  /**
   * Оновлює активну точку
   * @param {number} index Індекс активного слайду
   */
  const updateDots = (index) => {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  };

  // ── Навігація ──

  /**
   * Переходить до вказаного слайду з анімацією
   * @param {number} index Індекс слайду
   */
  const goToSlide = (index) => {
    if (isTransitioning) return;
    isTransitioning = true;

    // Нормалізація індексу (infinite loop)
    const normalizedIndex = ((index % totalSlides) + totalSlides) % totalSlides;

    track.style.transition = `transform ${config.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    track.style.transform = `translateX(-${normalizedIndex * 100}%)`;

    currentIndex = normalizedIndex;
    updateDots(currentIndex);

    setTimeout(() => {
      isTransitioning = false;
    }, config.duration);
  };

  /**
   * Переходить до наступного слайду
   */
  const goToNext = () => goToSlide(currentIndex + 1);

  /**
   * Переходить до попереднього слайду
   */
  const goToPrev = () => goToSlide(currentIndex - 1);

  // ── Autoplay ──

  /**
   * Запускає autoplay
   */
  const startAutoplay = () => {
    if (!config.autoplay) return;
    stopAutoplay();
    autoplayTimer = setInterval(goToNext, config.autoplayDelay);
  };

  /**
   * Зупиняє autoplay
   */
  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  // ── Обробники подій ──

  // Стрілки
  if (prevBtn) prevBtn.addEventListener('click', () => { goToPrev(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goToNext(); resetAutoplay(); });

  /**
   * Скидає і перезапускає autoplay
   */
  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  // Зупинка при hover
  const wrapper = container.querySelector('.slider-track-wrapper') || container;
  wrapper.addEventListener('mouseenter', stopAutoplay);
  wrapper.addEventListener('mouseleave', startAutoplay);

  // Клавіатурні події (лише коли слайдер у фокусі чи видимий)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      goToPrev();
      resetAutoplay();
    } else if (e.key === 'ArrowRight') {
      goToNext();
      resetAutoplay();
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  // ── Ініціалізація ──
  renderDots();
  track.style.transform = 'translateX(0%)';
  startAutoplay();

  // ── Публічне API ──
  return {
    goToSlide,
    goToNext,
    goToPrev,
    startAutoplay,
    stopAutoplay,
    destroy: () => {
      stopAutoplay();
      document.removeEventListener('keydown', handleKeyDown);
    },
  };
};

// ── Ініціалізація при завантаженні сторінки ────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Ініціалізуємо головний слайдер
  createSlider('main-slider', {
    duration:      500,
    autoplay:      true,
    autoplayDelay: 3500,
    showArrows:    true,
    showDots:      true,
  });
});
