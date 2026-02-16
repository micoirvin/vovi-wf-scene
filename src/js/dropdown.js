function dropdown() {
  const dropdowns = document.querySelectorAll('.u-dropdown');
  dropdowns.forEach((el) => {
    if (el.hasAttribute('u-dropdown-initialized')) return;

    const btnEl = el.querySelector('.u-dropdown_btn');
    if (!btnEl) return;

    el.setAttribute('u-dropdown-initialized', '');
    btnEl.addEventListener('click', () => {
      el.classList.toggle('is-open');
    });

    if (el.hasAttribute('u-dropdown-form-select')) {
      const form = el.querySelector('form');
      if (form) {
        form.addEventListener('change', () => {
          const activeRadio = form.querySelector('input:checked');
          const dropdownLabelText = el.querySelector('.u-dropdown_btn-text');
          if (!activeRadio || !dropdownLabelText) return;
          dropdownLabelText.textContent =
            activeRadio.parentElement.querySelector('.w-form-label').textContent;
          btnEl.click();
        });
      }
    }
  });
}

export { dropdown };
