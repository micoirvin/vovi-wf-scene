function cycleClock() {
  // Runs once per [cycle-clock] instance — supports multiple .side_clock
  // blocks (one per timezone) on the same page.
  document.querySelectorAll('[cycle-clock]').forEach((cycleClockEl, clockIndex) => {
    const locEl = cycleClockEl.querySelector('[cycle-clock-loc]');
    const timeEl = cycleClockEl.querySelector('[cycle-clock-time]');
    const listEl = cycleClockEl.querySelector('[cycle-clock-list]');
    if (!locEl || !timeEl || !listEl) return;
    const items = listEl.querySelectorAll('li');
    if (!items.length) return;

    // [cycle-clock-loc]'s static text is just the placeholder word
    // "Location" in Webflow, not an actual city — so there's nothing to
    // match against. Instead, assign each [cycle-clock] instance one city
    // from its own [cycle-clock-list] by POSITION: the 1st clock on the page
    // gets the 1st city in the list, the 2nd clock gets the 2nd city, etc.
    // Wraps around (modulo) if there are ever more clocks than cities.
    const index = clockIndex % items.length;

    // Recomputes this instance's current time and swaps it into the DOM.
    // Called once immediately below, then re-called every 30s by the
    // setInterval further down — that 30s cadence is the only thing that
    // triggers a swap; `index`/loc is fixed per instance and never changes.
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

      // Skip the swap entirely if nothing displayed would actually change —
      // this is what previously made the fade look like it fired "randomly":
      // it used to run on every 30s tick unconditionally, even when the
      // displayed minute hadn't advanced yet. Now it only fades on ticks
      // where the text is genuinely different.
      if (loc === locEl.innerText && date === timeEl.innerText) return;

      // The actual swap: overwrites the displayed text with the freshly
      // computed loc/time. Called either instantly (no GSAP) or from inside
      // the fade-out's onComplete below (with GSAP).
      const update = () => {
        locEl.innerText = loc;
        timeEl.innerText = date;
      };

      // Condition for the animated swap: only runs if GSAP (window.gsap) is
      // loaded on the page at all — otherwise it falls through to the plain
      // `update()` in the `else` below with no animation.
      // Sequence when GSAP IS available:
      //   1) fade locEl/timeEl to opacity 0 (default GSAP tween duration —
      //      no `duration` set here, so GSAP's default of 0.5s applies).
      //   2) once that fade-out finishes (onComplete), swap the text via
      //      update() while it's invisible.
      //   3) fade back to opacity 1 with the new text showing.
      // This is the "swap after a delay" — the delay is the fade-out
      // duration, not a separate timer; the outer 30s interval is what
      // decides *when* this whole sequence starts.
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
    }

    makeTime();

    // The only trigger for re-running makeTime() (and therefore the fade
    // swap above) — ticks every 30 seconds for as long as the page is open.
    setInterval(() => {
      makeTime();
    }, 30 * 1000);
  });

  cycleActiveClock();
}

// Cycles the is-active class across the .side_clock siblings, one at a time,
// every 20s: remove it from the current one, add it to the next, wrapping
// back to the first after the last. Starts from whichever .side_clock
// already has is-active in Webflow (the first one, currently).
//
// is-out trails one step behind is-active: whichever clock just lost
// is-active gets is-out added (for an exit animation), and whichever clock
// had is-out from the previous tick gets it removed — so exactly one clock
// has is-out at a time, same as is-active.
function cycleActiveClock() {
  const clocks = Array.from(document.querySelectorAll('.side_clock'));
  if (clocks.length < 2) return;

  let activeIndex = clocks.findIndex((clock) => clock.classList.contains('is-active'));
  if (activeIndex === -1) activeIndex = 0;

  let outIndex = -1;

  setInterval(() => {
    if (outIndex !== -1) clocks[outIndex].classList.remove('is-out');

    clocks[activeIndex].classList.remove('is-active');
    clocks[activeIndex].classList.add('is-out');
    outIndex = activeIndex;

    activeIndex = (activeIndex + 1) % clocks.length;
    clocks[activeIndex].classList.add('is-active');
  }, 10 * 1000); // TEMP: 10s for testing, revert to 20 * 1000
}

export { cycleClock };
