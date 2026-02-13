function basicAnimations() {
  ScrollTrigger.refresh();
  const defaultEase = 'sine.out';
  const defaultDuration = 1;
  // 1. Stagger Animations
  document.querySelectorAll('[anim-stagger]').forEach((element) => {
    const childrenSelector = element.getAttribute('anim-stagger');
    if (!childrenSelector) return;

    const children = element.querySelectorAll(childrenSelector);
    if (!children.length) return;

    gsap.set(children, {
      y: element.getAttribute('from-y') || '0rem',
      x: element.getAttribute('from-x') || '0rem',
      opacity: 0,
    });

    ScrollTrigger.batch(children, {
      onEnter: (batch) => {
        gsap.to(batch, {
          y: '0rem',
          x: '0rem',
          opacity: 1,
          autoAlpha: 1,
          duration: parseFloat(element.getAttribute('data-duration')) || defaultDuration,
          delay: parseFloat(element.getAttribute('data-delay')) || 0.15,
          stagger: {
            each: parseFloat(element.getAttribute('stagger-amount')) || 0.3,
            from: element.getAttribute('stagger-from') || 'start',
          },
          ease: element.getAttribute('data-easing') || defaultEase,
          overwrite: true,
          clearProps: 'all',
        });
      },
    });
  });

  // 2. Single Element Animations
  document.querySelectorAll('[anim-element]').forEach((element) => {
    gsap.fromTo(
      element,
      { y: element.getAttribute('from-y') || '0rem', opacity: 0 },
      {
        y: '0rem',
        opacity: 1,
        duration: parseFloat(element.getAttribute('data-duration')) || defaultDuration,
        delay: parseFloat(element.getAttribute('data-delay')) || 0.15,
        ease: element.getAttribute('data-easing') || defaultEase,
        scrollTrigger: {
          trigger: element,
          start: element.getAttribute('scrollTrigger-start') || 'top 80%',
          markers: element.getAttribute('anim-markers') === 'true',
        },
        clearProps: 'all',
      }
    );
  });

  // 3. Scale + Opacity Animations
  gsap.utils.toArray('[anim-scale-opacity]').forEach((element) => {
    gsap.fromTo(
      element,
      { opacity: 0, scale: 1.1 },
      {
        opacity: 1,
        scale: 1,
        duration: parseFloat(element.getAttribute('data-duration')) || 2,
        delay: parseFloat(element.getAttribute('data-delay')) || 0,
        ease: defaultEase,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          markers: false,
        },
      }
    );
  });
}

export { basicAnimations };
