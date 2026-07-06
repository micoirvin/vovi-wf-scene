export function richtextMap() {
  /*
    On the page, find all [richtext-map=root].
    Inside, find [richtext-map=richtext] and [richtext-map=block-list].
    Find all h3 in the richtext element.
    Find all paragraphs after each h3 but before the next h3 or the end of the richtext element.

    For each h3 group, it will be mapped to a [richtext-map=block-item]. This block item is a placeholder.
    It will be duplicated as a template for each h3 group.

    The h3 text content will be set as the [richtext-map=title] text content.
    Then find [richtext-map=title-num] and set its text content to the index of the h3 group + 1. Format it as '01' ,'02' etc.
    The paragraphs are gonna be copied inside [richtext-map=paragraphs].

  */

  document.querySelectorAll('[richtext-map=root]').forEach((root) => {
    const richtext = root.querySelector('[richtext-map=richtext]');
    const blockList = root.querySelector('[richtext-map=block-list]');
    const blockTemplate = root.querySelector('[richtext-map=block-item]');

    if (!richtext || !blockList || !blockTemplate) return;

    // Build the h3 groups: each h3 with the paragraphs that follow it
    // until the next h3 or the end of the richtext element.
    const groups = [];
    let currentGroup = null;

    Array.from(richtext.children).forEach((child) => {
      if (child.tagName === 'H3') {
        currentGroup = { heading: child, paragraphs: [] };
        groups.push(currentGroup);
      } else if (currentGroup && child.tagName === 'P') {
        currentGroup.paragraphs.push(child);
      }
    });

    // The template is a placeholder; remove it from the DOM but keep it as a clone source.
    blockTemplate.remove();

    groups.forEach((group, index) => {
      const blockItem = blockTemplate.cloneNode(true);

      const title = blockItem.querySelector('[richtext-map=title]');
      const titleNum = blockItem.querySelector('[richtext-map=title-num]');
      const paragraphs = blockItem.querySelector('[richtext-map=paragraphs]');

      if (title) title.textContent = group.heading.textContent;
      if (titleNum) titleNum.textContent = String(index + 1).padStart(2, '0');
      if (paragraphs) {
        paragraphs.innerHTML = '';
        group.paragraphs.forEach((p) => {
          paragraphs.appendChild(p.cloneNode(true));
        });
      }

      blockList.appendChild(blockItem);
    });

    // The source richtext is only used as a data reference; remove it once mapped.
    richtext.remove();
  });
}
