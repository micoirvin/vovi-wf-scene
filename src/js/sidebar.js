function sidebar() {
  const side = document.querySelector('.side');
  if (!side) return;
  const sideMenu = side.querySelector('.side_menu');

  const burger = side.querySelector('.side_burger-btn');
  burger.addEventListener('click', () => {
    let toState = 'open';
    if (side.classList.contains('is-closed')) toState = 'open';
    else toState = 'closed';

    side.classList.toggle('is-closed');
    sideMenu.classList.remove('is-closed');
    sideMenu.classList.add('is-open');

    // Also open the menu's own accordion item, since sideMenu's classList
    // alone no longer drives the nav's visibility (data-accordion-body does).
    const menuItem = sideMenu.querySelector('[data-accordion]');
    if (menuItem && menuItem.getAttribute('data-accordion') !== 'active') {
      menuItem.setAttribute('data-accordion', 'active');
      const toggle = menuItem.querySelector('[data-accordion-toggle]');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      menuItem.dispatchEvent(
        new CustomEvent('accordion:toggle', { detail: { open: true }, bubbles: true })
      );
    }
  });

  const sideMenuHead = sideMenu.querySelector('.side_menu-head');
  sideMenuHead.addEventListener('click', () => {
    if (sideMenu.classList.contains('is-closed')) {
      sideMenu.classList.remove('is-closed');
      sideMenu.classList.add('is-open');
    } else {
      sideMenu.classList.add('is-closed');
      sideMenu.classList.remove('is-open');
    }
  });

  side.addEventListener('click', (e) => {
    if (side.classList.contains('is-closed')) return;
    if (!e.target.closest('.side_menu-nav-link,  .side_cs-link, .side_cs-foot-link')) return;
    burger.click();
  });
}

export { sidebar };
