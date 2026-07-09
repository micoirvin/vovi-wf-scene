import { basicTabs } from './basicTabs';
import { lazySwiper } from './lazySwiper';
import { gsapLoader } from './gsapLoader';
import { barbaLoader } from './barbaLoader';
import { lazyFinsweet } from './lazyFinsweet';
import { globeInteraction } from './globeInteraction';
import { enableSubmitButton } from './enableButtonSubmit';
import { dropdown } from './dropdown';
import { initAccordion } from './accordion';
import { richtextMap, initStoryScrollSync } from './richtextMap';
import { mergeCsIndiFoot } from './csIndiFoot';

function init() {
  gsapLoader();
  barbaLoader();
  basicTabs();
  lazySwiper();
  lazyFinsweet();
  globeInteraction();
  enableSubmitButton();
  dropdown();
  initAccordion();
  richtextMap();
  initStoryScrollSync();
  mergeCsIndiFoot();
}

export { init };
