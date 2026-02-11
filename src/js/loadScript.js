function loadScript(src, attrs = []) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      console.log(`Script already loaded: ${src}`);
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    attrs.forEach(([name, value]) => {
      s[name] = value;
    });
    document.head.appendChild(s);
  });
}

export { loadScript };
