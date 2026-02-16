function sidebar() {
  const sideMenu = document.querySelector('.side_menu');
  if (!sideMenu) return;
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
