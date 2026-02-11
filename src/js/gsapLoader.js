import { handleGsap } from './handleGsap';
import { loadScript } from './loadScript';

function gsapLoader() {
  loadScript('https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/gsap.min.js')
    .then(() => {
      loadScript('https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/ScrollTrigger.min.js')
        .then(() => {
          handleGsap();
        })
        .catch((err) => {
          console.error('Error loading ScrollTrigger:', err);
        });
    })
    .catch((err) => {
      console.error('Error loading GSAP:', err);
    });
}

export { gsapLoader };
