function handleFinsweet() {
  if (!window.isFinsweetLoaded) {
    window.FinsweetAttributes.destroy();
    return window.FinsweetAttributes.load('list').then((res) => {
      window.isFinsweetLoaded = true;
    });
  }

  setTimeout(() => {
    window.FinsweetAttributes.destroy();
    window.FinsweetAttributes.load('list').then((res) => {});
  }, 300);
}

export { handleFinsweet };
