import { basicTabs } from './basicTabs';
import { lazySwiper } from './lazySwiper';
import { gsapLoader } from './gsapLoader';
import { barbaLoader } from './barbaLoader';
import { lazyFinsweet } from './lazyFinsweet';

function init() {
  gsapLoader();
  barbaLoader();
  basicTabs();
  lazySwiper();
  lazyFinsweet();
}

export { init };
