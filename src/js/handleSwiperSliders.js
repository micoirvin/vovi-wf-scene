function handleSwiperSliders() {
  const swiperOuters = document.querySelectorAll('[swiper_outer]');
  swiperOuters.forEach((swiperOuter) => handleSingleSwiper(swiperOuter));
}

function handleSingleSwiper(swiperOuter, reload = false) {
  let swiperEls = addClassesToSwiperElements(swiperOuter);
  if (!swiperEls) return;
  let { swiperEl, swiperWrapper, swiperSlides } = swiperEls;

  if (swiperEl.swiper && !reload) {
    return console.warn('Swiper for el', swiperEl, 'has been initialized already ');
  }

  /*******  TO BE REVIEWED
  // if (
  //   swiperEl.hasAttribute('dynamic-swiper-list') &&
  //   !swiperOuter.hasAttribute('dynamic-swiper-list-is-initialized')
  // ) {
  //   swiperOuter = dynamicSwiperList(swiperOuter, swiperEl, swiperWrapper);
  //   swiperEls = addClassesToSwiperElements(swiperOuter);
  //   swiperEl = swiperEls.swiperEl;
  //   swiperWrapper = swiperEls.swiperWrapper;
  // }
  ********/

  const swiperType = swiperEl.getAttribute('swiper-type') || 'default';

  const nextEl = swiperOuter.querySelector('[swiper-button-next]') ?? null;
  const prevEl = swiperOuter.querySelector('[swiper-button-prev]') ?? null;

  const isLoop = swiperEl?.hasAttribute('swiper-loop') || false;

  const scrollbarEl = swiperOuter.querySelector('[swiper-scrollbar]') ?? false;
  const direction = swiperEl?.getAttribute('swiper-direction') ?? 'horizontal';

  let gap = 0;
  if (swiperWrapper.hasAttribute('swiper-copied-gap')) {
    gap = swiperWrapper.getAttribute('swiper-copied-gap');
  } else {
    gap = getComputedStyle(swiperWrapper).getPropertyValue('gap');
    if (gap) {
      swiperWrapper.setAttribute('swiper-copied-gap', gap);
    }
  }

  swiperWrapper.style.gap = '0px';

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
    mousewheel: false,
    freeMode: scrollbarEl
      ? {
          enabled: true,
          sticky: false,
          momentum: true,
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

  if (swiperEl.swiper) swiperEl.swiper.destroy();
  swiperWrapper.style.gap = '0px'; // should be after destroy

  let swiper = new Swiper(swiperEl, swiperProps);

  if (scrollbarEl) attachSmoothMousewheel(swiperEl, direction);
}

/**
 * Eases mousewheel scrolling on a swiper instead of Swiper's built-in mousewheel
 * module, which jumps directly to a new position on every wheel event and looks
 * stepped with a normal (non-trackpad) mouse wheel.
 */
function attachSmoothMousewheel(swiperEl, direction) {
  if (swiperEl.dataset.smoothWheelBound) return;
  swiperEl.dataset.smoothWheelBound = 'true';

  let target = null;
  let current = null;
  let rafId = null;
  let resyncTimeout = null;

  const tick = () => {
    const { swiper } = swiperEl;
    if (!swiper || target === null) {
      rafId = null;
      return;
    }

    current += (target - current) * 0.2;
    const settled = Math.abs(target - current) < 0.5;
    if (settled) current = target;

    swiper.setTransition(0);
    swiper.setTranslate(current);
    swiper.updateProgress(current);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();

    rafId = settled ? null : requestAnimationFrame(tick);
  };

  swiperEl.addEventListener(
    'wheel',
    (e) => {
      const { swiper } = swiperEl;
      if (!swiper) return;

      e.preventDefault();

      const delta = direction === 'vertical' ? e.deltaY : e.deltaY || e.deltaX;

      if (target === null) {
        target = swiper.translate;
        current = swiper.translate;
      }

      target -= delta;
      const lowerBound = Math.min(swiper.minTranslate(), swiper.maxTranslate());
      const upperBound = Math.max(swiper.minTranslate(), swiper.maxTranslate());
      target = Math.min(upperBound, Math.max(lowerBound, target));

      if (!rafId) rafId = requestAnimationFrame(tick);

      clearTimeout(resyncTimeout);
      resyncTimeout = setTimeout(() => {
        target = null;
      }, 200);
    },
    { passive: false }
  );
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

function dynamicSwiperList(swiperOuter, swiperEl, swiperWrapper) {
  return;
  const displayClone = swiperOuter.cloneNode(true);
  const key = swiperEl.getAttribute('dynamic-swiper-list');
  attributeCleanupMap(key, displayClone)();

  displayClone.setAttribute('dynamic-swiper-list-is-initialized', '');
  displayClone.setAttribute('dynamic-swiper-list-dest', '');

  swiperOuter.style.display = 'none';
  swiperOuter.setAttribute('dynamic-swiper-list-source', '');
  swiperOuter.insertAdjacentElement('afterend', displayClone);
  swiperOuter.removeAttribute('swiper_outer');

  swiperEl.removeAttribute('swiper');
  swiperEl.classList.remove('swiper');

  let timeout = null;
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          console.log('changed slides');
          const wrapper = displayClone.querySelector('[swiper-wrapper]');
          const newWrapper = swiperWrapper.cloneNode(true);
          attributeCleanupMap(key, newWrapper)();
          wrapper?.replaceWith(newWrapper);
          handleSingleSwiper(displayClone, true);
          clearTimeout(timeout);
        }, 300);
      }
    }
  });
  observer.observe(swiperWrapper, {
    childList: true, // watch for direct children changes only
    subtree: false, // watch for direct children changes only
  });

  return displayClone;
}

function attributeCleanupMap(key, swiperEl) {
  return;
  let retFunc = null;
  switch (key) {
    case 'fs':
      retFunc = () => {
        const attributes = ['fs-list-element', 'fs-list-instance', 'fs-list-field'];
        const strAttributes = attributes
          .map((val) => `[${val}]`)
          .reduce((acc, val) => acc + ', ' + val);
        const els = swiperEl.querySelectorAll(strAttributes);
        attributes.forEach((att) => {
          if (swiperEl.hasAttribute(att)) swiperEl.removeAttribute(att);
          els.forEach((el) => {
            if (el.hasAttribute(att)) el.removeAttribute(att);
          });
        });
      };
      break;
    default:
      retFunc = () => {};
  }
  return retFunc;
}

export { handleSwiperSliders, handleSingleSwiper };
