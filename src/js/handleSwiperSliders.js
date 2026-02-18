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

  if (
    swiperEl.hasAttribute('dynamic-swiper-list') &&
    !swiperOuter.hasAttribute('dynamic-swiper-list-is-initialized')
  ) {
    swiperOuter = dynamicSwiperList(swiperOuter, swiperEl, swiperWrapper);
    swiperEls = addClassesToSwiperElements(swiperOuter);
    swiperEl = swiperEls.swiperEl;
    swiperWrapper = swiperEls.swiperWrapper;
  }

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
    }
    swiperWrapper.style.gap = '0px';
  } else gap = swiperWrapper.getAttribute('swiper-copied-gap');

  swiperWrapper.style.gap = 0;

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

  if (swiperEl.swiper) swiperEl.swiper.destroy();
  let swiper = new Swiper(swiperEl, swiperProps);
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

export { handleSwiperSliders };
