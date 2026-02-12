import { init } from './_init';

function handleBarba() {
  if (window.VAR_BARBA) return;
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }

  window.VAR_BARBA = barba;

  barba.init({
    transitions: [
      {
        name: 'fade',
        async leave(data) {
          await gsap.to(data.current.container, {
            opacity: 0,
            duration: 0.5,
          });
        },
        enter(data) {
          gsap.from(data.next.container, {
            opacity: 0,
            duration: 0.5,
          });
        },
      },
    ],
  });

  barba.hooks.afterLeave(() => {
    window.scrollTo(0, 0);
    gsap.globalTimeline.clear();
  });

  barba.hooks.after(() => {
    init();
  });
}

export { handleBarba };
