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
