function sidebar() {
  const side = document.querySelector('.side');
  if (!side) return;
  const sideMenu = side.querySelector('.side_menu');

  const burger = side.querySelector('.side_burger-btn');
  burger.addEventListener('click', () => {
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
}

export { sidebar };
