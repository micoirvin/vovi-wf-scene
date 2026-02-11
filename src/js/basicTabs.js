function basicTabs() {
  document.querySelectorAll('[tabs]').forEach((tabs) => {
    const tabButtons = tabs.querySelectorAll('[tabs-button]');
    const tabItems = tabs.querySelectorAll('[tabs-item]');

    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        tabButtons.forEach((btn, i) => {
          if (i === index) return;
          btn.classList.remove('is-active');
          btn.classList.add('is-inactive');
        });
        tabItems.forEach((item, i) => {
          if (i === index) return;
          item.classList.remove('is-active');
          item.classList.add('is-inactive');
        });
        button.classList.add('is-active');
        button.classList.remove('is-inactive');
        tabItems[index].classList.add('is-active');
        tabItems[index].classList.remove('is-inactive');
      });
    });
  });
}

export { basicTabs };
