import { greetUser } from '$utils/greet';
import { init } from './js/_init';
import { sidebar } from './js/sidebar';
import { cycleClock } from './js/cycleClock';
import { prepareSideCs } from './js/simplifiedSidebarCs';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'John Doe';
  greetUser(name);
  console.log(`Welcome to Webflow, ${name}!`);
  document.documentElement.classList.add('ready');

  cycleClock();
  sidebar();
  prepareSideCs();
  init();
});
