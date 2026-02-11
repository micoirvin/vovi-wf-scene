import { handleSwiperSliders } from './handleSwiperSliders';
import { loadScript } from './loadScript';
import { lazyFunc } from './lazy';

function lazySwiper() {
  const swiperOuters = document.querySelectorAll('[swiper_outer]');
  lazyFunc(swiperOuters, () => {
    loadScript('https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js')
      .then(() => {
        handleSwiperSliders();
      })
      .catch((err) => {
        console.error('Error loading Swiper:', err);
      });
  });
}

export { lazySwiper };
