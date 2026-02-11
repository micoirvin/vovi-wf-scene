function lazyLoader() {
  document.querySelectorAll('[lazy-load]').forEach((el) => {
    lazyFunc([el], () => {
      el.removeAttribute('lazy-load');
      console.log('Lazy loaded:', el);
    });
  });
}

function lazyFunc(trigEls, func, rootMargin = '50% 0px') {
  if (!trigEls || trigEls.length === 0)
    return console.warn('No trigger element for lazyFunc', func.name);

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('Element is in entering view:', entry.target);
          func();
          obs.disconnect();
        }
      });
    },
    {
      root: null, // viewport
      rootMargin: rootMargin, // preload when 0.5 viewport height away
      threshold: 0, // trigger as soon as it enters the margin
    },
  );

  trigEls.forEach((trigEl) => observer.observe(trigEl));
}

export { lazyLoader, lazyFunc };
