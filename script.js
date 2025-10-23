document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel__track');
  const slides = [...track.children];
  const prevBtn = document.querySelector('.carousel__button--prev');
  const nextBtn = document.querySelector('.carousel__button--next');
  const dotsContainer = document.querySelector('.carousel__nav--dots');
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
  const viewport = document.querySelector('.carousel__viewport');

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let translateX = 0;

  const update = () => {
    dots.forEach((dot, i) => dot.setAttribute('aria-current', i === index));
    prevBtn.hidden = index === 0;
    nextBtn.hidden = index === slides.length - 1;

    const target = slides[index];
    if (window.innerWidth <= 980) {
      const targetRect = target.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const offset = targetRect.left - trackRect.left;
      track.style.transform = `translateX(-${offset}px)`;
    } else {
      track.style.transform = '';
    }
  };

  const go = (dir) => {
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

  // Drag logic
  const startDrag = (e) => {
    if (window.innerWidth > 740) return;
    isDragging = true;
    startX = e.touches?.[0].clientX ?? e.clientX;
    viewport.classList.add('is-dragging');
    track.style.transition = 'none';
  };

  const moveDrag = (e) => {
    if (!isDragging) return;
    currentX = e.touches?.[0].clientX ?? e.clientX;
    translateX = -(slides[index].offsetLeft) + (currentX - startX);
    track.style.transform = `translateX(${translateX}px)`;
  };

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('is-dragging');
    track.style.transition = '';

    const diff = (currentX || startX) - startX;
    if (diff < -100) go(1);
    else if (diff > 100) go(-1);
    else update();
  };

  ['mousedown', 'touchstart'].forEach(ev => viewport.addEventListener(ev, startDrag));
  ['mousemove', 'touchmove'].forEach(ev => viewport.addEventListener(ev, moveDrag));
  ['mouseup', 'touchend', 'mouseleave'].forEach(ev => viewport.addEventListener(ev, endDrag));

  // Desktop click-to-enlarge
  slides.forEach(slide => {
    slide.addEventListener('click', () => {
      if (window.innerWidth <= 740) return;
      if (slide.classList.contains('is-active')) return;

      slides.forEach(s => s.classList.remove('is-active', 'has-active'));
      slide.classList.add('is-active');

      slides.forEach(s => {
        if (!s.classList.contains('is-active')) {
          s.classList.add('has-active');
        }
      });
    });
  });

  // Debounce resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(update, 150);
  });

  update();
});