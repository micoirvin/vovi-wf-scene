import { loadScript } from './loadScript';
import { handleBarba } from './handleBarba';

function barbaLoader() {
  if (window.VAR_BARBA) return;

  loadScript('https://cdn.jsdelivr.net/npm/@barba/core')
    .then(() => {
      console.log('Barba.js loaded');
      handleBarba();
    })
    .catch((err) => {
      console.error('Error loading Barba.js:', err);
    });
}

export { barbaLoader };
