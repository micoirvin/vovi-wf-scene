import { img2svg } from './img2svg';
async function globeInteraction() {
  const globeImg = document.querySelector('.globe-svg');
  const globeNav = document.querySelector('.globe-nav');
  if (!globeImg && !globeNav) return;
  const svg = await img2svg(globeImg);
  if (!svg) return;
  const locs = svg.querySelectorAll(`.globe-svg_loc-point`);
  const btns = globeNav.querySelectorAll('.globe-nav_btn');
  globeNav.addEventListener('click', (e) => {
    const btn = e.target.closest('.globe-nav_btn');
    if (!btn) return;
    const name = btn.dataset.name;
    btns.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    locs.forEach((loc) => {
      if (loc.classList.contains(name)) loc.classList.add('is-active');
      else loc.classList.remove('is-active');
    });
  });
}

export { globeInteraction };
