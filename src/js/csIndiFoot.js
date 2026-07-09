/**
 * Individual case study footer tags (.cs-indi_foot).
 *
 * Each item is a category label ("Sector", "Stage", "Skillset", ...) plus its
 * value. The CMS can render the same category more than once (e.g. two
 * "Stage" items for "Series A" and "Series B"). This merges every duplicate
 * category into the first occurrence — joining values with ", " — and
 * removes the rest, so each category shows once with all its values.
 */
function mergeCsIndiFoot() {
  const pageName =
    document.body.getAttribute('data-page') || document.documentElement.getAttribute('data-page');
  if (pageName !== 'individual-case-study') return;

  document.querySelectorAll('.cs-indi_foot').forEach((footEl) => {
    const items = Array.from(footEl.querySelectorAll(':scope > [role="listitem"]'));

    const groups = new Map();
    items.forEach((item) => {
      const label = item.querySelector('.text-size-medium.text-weight-medium')?.textContent.trim();
      if (!label) return;
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(item);
    });

    groups.forEach((groupItems) => {
      if (groupItems.length < 2) return;

      const [first, ...rest] = groupItems;
      const firstValueEl = first.querySelector(
        '.text-size-small.text-weight-medium.text-color-tertiary'
      );
      if (!firstValueEl) return;

      const values = [firstValueEl.textContent.trim()];
      rest.forEach((item) => {
        const valueEl = item.querySelector(
          '.text-size-small.text-weight-medium.text-color-tertiary'
        );
        if (valueEl) values.push(valueEl.textContent.trim());
        item.remove();
      });

      firstValueEl.textContent = values.join(', ');
    });
  });
}

export { mergeCsIndiFoot };
