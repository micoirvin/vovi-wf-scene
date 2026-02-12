import { loadScript } from './loadScript';
import { lazyFunc } from './lazy';
import { handleFinsweet } from './handleFinsweet';

function lazyFinsweet() {
  if (window.FinsweetAttributes) return handleFinsweet();
  const el = document.querySelectorAll('[fs-list-element]');

  lazyFunc(el, () => {
    loadScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js', [
      ['fs-list', ''],
      ['type', 'module'],
    ])
      .then(() => {
        console.log('Finsweet Attributes script loaded.');
        handleFinsweet();
      })
      .catch((err) => {
        console.error('Error loading Finsweet Attributes script:', err);
      });
  });
}

export { lazyFinsweet };
