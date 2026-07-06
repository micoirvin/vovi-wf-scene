import { handleSingleSwiper } from './handleSwiperSliders';

window.siteSideCs = {};
function prepareSideCs() {
  const sideCs = document.querySelector('.side_cs');
  window.siteSideCs.el = sideCs;
  const swiperOuter = sideCs.querySelector('[side-cs-swiper]');
  if (window.FinsweetAttributes && window.Swiper)
    console.error('Dev note: Run this function before FS and Swiper loads');

  const hideViewClone = sideCs.querySelector('[side-cs-hideview]');
  const filterClone = sideCs.querySelector('[side-cs-filter]');

  // I hard-added the clones on the HTML because cloning causes problems for Finsweet

  removeFsAttributes(swiperOuter);
  removeFsAttributes(hideViewClone);

  hideViewClone.style.outline = '1px solid lime';
  filterClone.style.outline = '1px solid red';
  hideViewClone.removeAttribute('swiper_outer');
  filterClone.removeAttribute('swiper_outer');

  // swiperOuter.parentElement.prepend(hideViewClone);
  // swiperOuter.parentElement.prepend(filterClone);
  console.log('prepareSidebarCS', new Date().getTime());

  // swiperOuter.insertAdjacentElement('afterend', hideViewClone);
  // swiperOuter.insertAdjacentElement('afterend', filterClone);

  linkUpHideView(hideViewClone, filterClone);
  linkUpSwiper(swiperOuter, hideViewClone);

  handleReenable();
}

function linkUpHideView(hideViewClone, filterClone) {
  const hideList = hideViewClone.querySelector('.side_cs-list');
  const filterList = filterClone.querySelector('.side_cs-list');

  let timeout = null;
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        if (window.siteSideCs.pauseHideViewUpdates) return;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          console.log('filter updates');
          replaceChildren(hideList, filterList);
          clearTimeout(timeout);
        }, 300);
      }
    }
  });
  observer.observe(filterList, {
    childList: true, // watch for direct children changes only
    subtree: false, // watch for direct children changes only
  });
}

function linkUpSwiper(swiperOuter, hideViewClone) {
  let swiperList = swiperOuter.querySelector('[swiper-wrapper]');
  const hideList = hideViewClone.querySelector('[swiper-wrapper]');

  let timeout = null;
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        if (window.siteSideCs.pauseSwiperUpdates) return;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          console.log('view update');
          replaceChildren(swiperList, hideList);
          handleSingleSwiper(swiperOuter, true);
          clearTimeout(timeout);
        }, 300);
      }
    }
  });
  observer.observe(hideList, {
    childList: true, // watch for direct children changes only
    subtree: false, // watch for direct children changes only
  });
}

function handleReenable() {
  const filters = window.siteSideCs.el.querySelector(
    '[fs-list-element="filters"][fs-list-instance="sidebar-cs"]'
  );
  filters.addEventListener('change', () => {
    if (window.siteSideCs.reenableUpdates) {
      window.siteSideCs.pauseSwiperUpdates = false;
      window.siteSideCs.pauseHideViewUpdates = false;
    }
  });
}

function sideCsOnBeforeLeave() {
  const filters = window.siteSideCs.el.querySelector(
    '[fs-list-element="filters"][fs-list-instance="sidebar-cs"]'
  );
  const checkeds = filters.querySelectorAll('input:checked');
  const clearEls = filters.querySelectorAll('[fs-list-element="clear"]');
  clearEls.forEach((c) => c.click());

  checkeds.forEach((c) => {
    c.checked = 'checked';
  });
  window.siteSideCs.checkedFiltersOnBeforeLeave = checkeds;
  window.siteSideCs.pauseHideViewUpdates = true;
  window.siteSideCs.reenableUpdates = false;
}

function sideCsOnAfter() {
  window.siteSideCs.reenableUpdates = true;
}

function syncSideCsAccordionWithMenu() {
  const menuList = document.querySelector('.side_menu[data-accordion-list="css"]');
  const csList = document.querySelector('.side_cs [data-accordion-list="css"]');
  if (!menuList || !csList) return;

  // Only one of menu/side_cs open at a time on desktop (768px+). Below that,
  // both may be open together — matches the mobile layout's staggered fade-in
  // for .side_menu and .side_cs rather than an exclusive accordion.
  const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

  const closeActiveItems = (list) => {
    list.querySelectorAll('[data-accordion="active"]').forEach((item) => {
      item.setAttribute('data-accordion', 'not-active');
      const toggle = item.querySelector('[data-accordion-toggle]');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      item.dispatchEvent(
        new CustomEvent('accordion:toggle', { detail: { open: false }, bubbles: true })
      );
    });
  };

  menuList.addEventListener('accordion:toggle', (e) => {
    menuList.classList.toggle('is-open', e.detail.open);
    menuList.classList.toggle('is-closed', !e.detail.open);
  });

  menuList.addEventListener('accordion:toggle', (e) => {
    if (e.detail.open && isDesktop()) closeActiveItems(csList);
  });

  csList.addEventListener('accordion:toggle', (e) => {
    if (e.detail.open && isDesktop()) closeActiveItems(menuList);
  });
}

function removeFsAttributes(el) {
  const removeEls = el.querySelectorAll('[fs-list-instance], [fs-list-element]');
  removeEls.forEach((rel) => {
    rel.removeAttribute('fs-list-instance');
    rel.removeAttribute('fs-list-element');
  });
}

function replaceChildren(target, source) {
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }

  Array.from(source.children).forEach((child) => {
    target.appendChild(child.cloneNode(true));
  });
}

export { prepareSideCs, sideCsOnAfter, sideCsOnBeforeLeave, syncSideCsAccordionWithMenu };
