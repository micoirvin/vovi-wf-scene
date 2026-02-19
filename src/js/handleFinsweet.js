function handleFinsweet() {
  // REFACTOR. MODULARIZE THIS
  if (!window.isFinsweetLoaded) {
    window.FinsweetAttributes.destroy();
    return window.FinsweetAttributes.load('list').then(() => {
      window.isFinsweetLoaded = true;
    });
  }

  // const [sideCsPreCleanup, sideCsCleanup] = sideCsCase();

  setTimeout(() => {
    // sideCsPreCleanup();

    window.FinsweetAttributes.destroy();
    window.FinsweetAttributes.load('list').then((res) => {
      console.log(res);
      // sideCsCleanup();
    });
  }, 300);
}

function sideCsCase() {
  const sideCs = document.querySelector('.side_cs');
  const clearEls = sideCs.querySelectorAll('[fs-list-element="clear"]');
  const sidebarCs = document.querySelector(
    '[fs-list-element="filters"][fs-list-instance="sidebar-cs"]'
  );

  const tempClone = sideCs.cloneNode(true);
  tempClone.querySelectorAll('[fs-list-element][fs-list-instance]').forEach((t) => {
    t.removeAttribute('fs-list-element');
    t.removeAttribute('fs-list-instance');
  });

  sideCs.style.display = 'none';
  sideCs.insertAdjacentElement('afterend', tempClone);
  // tempClone.style.display = '';

  const checkeds = sidebarCs.querySelectorAll('input:checked');
  clearEls.forEach((c) => c.click());
  return [
    () => {
      checkeds.forEach((c) => {
        c.checked = 'checked';
      });
    },
    () => {
      setTimeout(() => {
        // tempClone.style.display = 'none';
        sideCs.style.display = '';
        tempClone.remove();
      }, 300);
    },
  ];
}

export { handleFinsweet };
