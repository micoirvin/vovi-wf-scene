function cycleClock() {
  const cycleClockEl = document.querySelector('[cycle-clock]');
  if (!cycleClockEl) return;
  const locEl = cycleClockEl.querySelector('[cycle-clock-loc]');
  const timeEl = cycleClockEl.querySelector('[cycle-clock-time]');
  const listEl = cycleClockEl.querySelector('[cycle-clock-list]');
  const items = listEl.querySelectorAll('li');
  let rand = Math.random();
  if (rand === 1) rand = 0.99;
  let index = Math.floor(items.length * rand);

  function makeTime() {
    let data = items[index].textContent.split(':');
    let loc = data[0].trim();

    let options = {
      timeZone: data[1].trim(),
      hourCycle: 'h23',
      hour: '2-digit',
      minute: '2-digit',
    };
    let formatter = new Intl.DateTimeFormat([], options);
    const date = formatter.format(new Date());
    console.log(date);

    const update = () => {
      locEl.innerText = loc;
      timeEl.innerText = date;
    };

    if (window.gsap) {
      gsap.to([locEl, timeEl], {
        opacity: 0,
        onComplete: () => {
          update();
          gsap.to([locEl, timeEl], {
            opacity: 1,
          });
        },
      });
    } else update();
    index = index + 1 >= items.length ? 0 : index + 1;
  }

  makeTime();

  setInterval(() => {
    makeTime();
  }, 30 * 1000);
}

export { cycleClock };
