import { basicTabs } from './basicTabs';
import { lazySwiper } from './lazySwiper';
import { gsapLoader } from './gsapLoader';
import { barbaLoader } from './barbaLoader';
import { lazyFinsweet } from './lazyFinsweet';
import { globeInteraction } from './globeInteraction';
import { enableSubmitButton } from './enableButtonSubmit';

function init() {
  gsapLoader();
  barbaLoader();
  basicTabs();
  lazySwiper();
  lazyFinsweet();
  globeInteraction();
  enableSubmitButton();
}

export { init };
