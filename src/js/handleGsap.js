import { basicAnimations } from './basicAnimations';
function handleGsap() {
  gsap.registerPlugin(ScrollTrigger);
  console.log('GSAP and ScrollTrigger loaded');
  basicAnimations();
}

export { handleGsap };
