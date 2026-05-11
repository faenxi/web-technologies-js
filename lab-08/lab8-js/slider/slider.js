'use strict';

const createSlider = (containerId, options = {}) => {
  
  const config = {
    duration:      options.duration     ?? 500,        
    autoplay:      options.autoplay     ?? true,       
    autoplayDelay: options.autoplayDelay ?? 3500,      
    showArrows:    options.showArrows   ?? true,        
    showDots:      options.showDots     ?? true,        
  };

  
  let currentIndex = 0;
  let autoplayTimer = null;
  let isTransitioning = false;

  
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

  
  if (prevBtn) prevBtn.style.display = config.showArrows ? '' : 'none';
  if (nextBtn) nextBtn.style.display = config.showArrows ? '' : 'none';
  if (dotsContainer) dotsContainer.style.display = config.showDots ? '' : 'none';

  

  
  const renderDots = () => {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = slides.map((_, i) =>
      `<button class="slider-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Слайд ${i + 1}"></button>`
    ).join('');

    dotsContainer.querySelectorAll('.slider-dot').forEach(dot => {
      dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
    });
  };

  
  const updateDots = (index) => {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  };

  

  
  const goToSlide = (index) => {
    if (isTransitioning) return;
    isTransitioning = true;

    
    const normalizedIndex = ((index % totalSlides) + totalSlides) % totalSlides;

    track.style.transition = `transform ${config.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    track.style.transform = `translateX(-${normalizedIndex * 100}%)`;

    currentIndex = normalizedIndex;
    updateDots(currentIndex);

    setTimeout(() => {
      isTransitioning = false;
    }, config.duration);
  };

  
  const goToNext = () => goToSlide(currentIndex + 1);

  
  const goToPrev = () => goToSlide(currentIndex - 1);

  

  
  const startAutoplay = () => {
    if (!config.autoplay) return;
    stopAutoplay();
    autoplayTimer = setInterval(goToNext, config.autoplayDelay);
  };

  
  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  

  
  if (prevBtn) prevBtn.addEventListener('click', () => { goToPrev(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goToNext(); resetAutoplay(); });

  
  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  
  const wrapper = container.querySelector('.slider-track-wrapper') || container;
  wrapper.addEventListener('mouseenter', stopAutoplay);
  wrapper.addEventListener('mouseleave', startAutoplay);

  
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

  
  renderDots();
  track.style.transform = 'translateX(0%)';
  startAutoplay();

  
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

document.addEventListener('DOMContentLoaded', () => {
  
  createSlider('main-slider', {
    duration:      500,
    autoplay:      true,
    autoplayDelay: 3500,
    showArrows:    true,
    showDots:      true,
  });
});
