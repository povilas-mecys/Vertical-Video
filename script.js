document.addEventListener('DOMContentLoaded', () => {
  // DOM elements selection
  const track = document.querySelector('.carousel__track');
  const slides = [...track.children];
  const prevBtn = document.querySelector('.carousel__button--prev');
  const nextBtn = document.querySelector('.carousel__button--next');
  const dotsContainer = document.querySelector('.carousel__nav--dots');
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel__nav--dots button') : [];
  const viewport = document.querySelector('.carousel__viewport');

  let index = 0;

  // Index and update functions
  const update = () => {
    // Update aria-current attribute for dots based on current index
    dots.forEach((dot, i) => dot.setAttribute('aria-current', i === index));
    // Hide prev button if at the first slide
    prevBtn.hidden = index === 0;
    // Hide next button if at the last slide
    nextBtn.hidden = index === slides.length - 1;

    const target = slides[index];
    if (window.innerWidth <= 980) {
      // Calculate offset for mobile view to translate the track
      const targetRect = target.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const offset = targetRect.left - trackRect.left;
      track.style.transform = `translateX(-${offset}px)`;
    } else {
      // Reset transform for desktop view
      track.style.transform = '';
    }
  };

  const go = (dir) => {
    // Change index within bounds and update carousel
    index = Math.min(Math.max(index + dir, 0), slides.length - 1);
    update();
  };

  // Button navigation
  prevBtn.addEventListener('click', () => go(-1));
  nextBtn.addEventListener('click', () => go(1));

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i;
      update();
    });
  });

  // Desktop click-to-enlarge with autoplay logic
  slides.forEach(slide => {
    const iframe = slide.querySelector('iframe');
    slide.addEventListener('click', () => {
      // If slide is already active, do nothing
      if (slide.classList.contains('is-active')) return;

      // Remove active and has-active classes from all slides and stop videos
      slides.forEach(s => {
        s.classList.remove('is-active', 'has-active');
        const sIframe = s.querySelector('iframe');
        if (sIframe) {
          const src = sIframe.src.replace(/[?&]autoplay=1/, '');
          sIframe.src = src; // stop video playback
        }
      });

      // Set clicked slide as active
      slide.classList.add('is-active');
      // Add has-active class to all other slides
      slides.forEach(s => {
        if (!s.classList.contains('is-active')) s.classList.add('has-active');
      });

      // Start autoplay on the iframe of the active slide
      if (iframe) {
        let src = iframe.src;
        src += src.includes('?') ? '&autoplay=1' : '?autoplay=1';
        iframe.src = src; // start playback
      }
    });
  });

  // Resize debounce to optimize update calls
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(update, 150);
  });

  // Initial update call to set up carousel
  update();
});