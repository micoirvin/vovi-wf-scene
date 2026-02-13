function handleSwiperSliders() {
  const swiperOuterControllables = document.querySelectorAll('[swiper_outer_controllable]');

  swiperOuterControllables.forEach((swiperOuter) => {
    addClassesToSwiperElements(swiperOuter);
  });

  const swiperOuters = document.querySelectorAll('[swiper_outer]');

  swiperOuters.forEach((swiperOuter) => {
    const swiperEls = addClassesToSwiperElements(swiperOuter);
    if (!swiperEls) return;
    const { swiperEl, swiperWrapper, swiperSlides } = swiperEls;

    const isController = swiperEl?.hasAttribute('swiper-controller');

    const swiperType = swiperEl.getAttribute('swiper-type') || 'default';

    const nextEl = swiperOuter.querySelector('[swiper-button-next]') ?? null;
    const prevEl = swiperOuter.querySelector('[swiper-button-prev]') ?? null;

    const isLoop = swiperEl?.hasAttribute('swiper-loop') || false;

    const scrollbarEl = swiperOuter.querySelector('[swiper-scrollbar]') ?? false;
    const direction = swiperEl?.getAttribute('swiper-direction') ?? 'horizontal';

    let gap = 0;
    if (!swiperWrapper.hasAttribute('swiper-copied-gap')) {
      gap = getComputedStyle(swiperWrapper).getPropertyValue('gap');
      if (gap) {
        swiperWrapper.setAttribute('swiper-copied-gap', gap);
        swiperSlides.forEach((slide) => {
          if (direction === 'horizontal') slide.style.marginRight = gap;
          else slide.style.marginBottom = gap;
        });
      }
      swiperWrapper.style.gap = '0px';
    } else gap = swiperWrapper.getAttribute('swiper-copied-gap');

    const swiperProps = {
      loop: isLoop,
      direction: direction,
      speed: 600,
      slidesPerView: 'auto',
      grabCursor: true,
      watchSlidesProgress: false,
      spaceBetween: gap,
      navigation: {
        prevEl: prevEl,
        nextEl: nextEl,
      },
      scrollbar: scrollbarEl
        ? {
            el: scrollbarEl,
            draggable: true,
            snapOnRelease: false,
          }
        : false,
    };

    switch (swiperType) {
      case 'default':
        // as is
        break;
      case 'auto':
        swiperProps.effect = 'fade';
        swiperProps.fadeEffect = {
          crossFade: true,
        };
        swiperProps.autoplay = {
          delay: 600,
          disableOnInteraction: false,
        };
        swiperProps.grabCursor = false;
        break;
      case 'scale':
        swiperProps.centeredSlides = true;
        swiperProps.effect = 'creative';
        swiperProps.creativeEffect = {
          prev: {
            translate: ['-90%', 0, 0],
            scale: 0.8,
          },
          next: {
            translate: ['90%', 0, 0],
            scale: 0.8,
          },
          limitProgress: 1,
        };
    }

    const swiper = new Swiper(swiperEl, swiperProps);

    if (swiper && isController) {
      handleControllableSwiper(swiperEl, swiper, swiperProps);
    }
  });
}

const addClassesToSwiperElements = (swiperOuter) => {
  const swiperEl = swiperOuter.querySelector('[swiper]');
  const swiperWrapper = swiperOuter.querySelector('[swiper-wrapper]');
  const swiperSlides = swiperOuter.querySelectorAll('[swiper-slide]');
  if (!swiperEl) return null;
  swiperEl.classList.add('swiper');
  swiperWrapper?.classList.add('swiper-wrapper');
  swiperSlides.forEach((s) => s.classList.add('swiper-slide'));

  const scrollbarDrag = swiperOuter.querySelector('[swiper-scrollbar-drag]');
  if (scrollbarDrag) scrollbarDrag.classList.add('swiper-scrollbar-drag');

  return {
    swiperEl,
    swiperWrapper,
    swiperSlides,
  };
};

const handleControllableSwiper = (swiperEl, swiper, swiperProps) => {
  const controlId = swiperEl.getAttribute('swiper-control-id');
  if (!controlId) return;
  const syncedSwiper = document.querySelector(
    `[swiper-controllable][swiper-control-id="${controlId}"]`
  );
  if (!syncedSwiper) return;

  swiperProps.effect = 'fade';
  swiperProps.fadeEffect = {
    crossFade: true,
  };
  swiperProps.grabCursor = false;
  swiperProps.disableOnInteraction = false;

  const controllableSwiper = new Swiper(syncedSwiper, swiperProps);

  swiper.controller.control = controllableSwiper;
};

export { handleSwiperSliders };
