import { greetUser } from '$utils/greet';
import { basicTabs } from 'src/js/basicTabs';
import { lazySwiper } from 'src/js/lazyHandles';
import { gsapLoader } from 'src/js/gsapLoader';
import { barbaLoader } from 'src/js/barbaLoader';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'John Doe';
  greetUser(name);
  console.log(`Welcome to Webflow, ${name}!`);

  document.documentElement.classList.add('ready');
  gsapLoader();
  barbaLoader();
  basicTabs();
  lazySwiper();
});
