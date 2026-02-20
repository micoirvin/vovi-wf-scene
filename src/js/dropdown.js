window.siteDropdownsCloseListener = false;

function dropdown() {
  const dropdowns = document.querySelectorAll('.u-dropdown');
  dropdowns.forEach((el) => {
    if (el.hasAttribute('u-dropdown-initialized')) return;

    const btnEl = el.querySelector('.u-dropdown_btn');
    if (!btnEl) return;

    el.setAttribute('u-dropdown-initialized', '');
    btnEl.addEventListener('click', () => {
      el.classList.toggle('is-closed');
    });

    if (el.hasAttribute('u-dropdown-form-single-select')) {
      const form = el.querySelector('form');

      if (form) {
        function singleSelectHandler() {
          const activeRadio = form.querySelector('input:checked');
          const dropdownLabelText = el.querySelector('.u-dropdown_btn-text');
          if (!activeRadio || !dropdownLabelText) return;
          dropdownLabelText.textContent =
            activeRadio.parentElement.querySelector('.w-form-label').textContent;
          btnEl.click();
        }

        form.addEventListener('change', (e) => {
          singleSelectHandler();
        });
      }
    }
  });

  if (window.siteDropdownsCloseListener) return;
  window.siteDropdownsCloseListener = true;
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.u-dropdown')) return;
    dropdowns.forEach((el) => {
      el.classList.add('is-closed');
    });
  });
}

export { dropdown };
