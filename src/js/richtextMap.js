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

    // Build the h3 groups: each h3 with the content (p, ul, ol) that follows it
    // until the next h3 or the end of the richtext element.
    const contentTags = ['P', 'UL', 'OL'];
    const groups = [];
    let currentGroup = null;

    Array.from(richtext.children).forEach((child) => {
      if (child.tagName === 'H3') {
        currentGroup = { heading: child, content: [] };
        groups.push(currentGroup);
      } else if (currentGroup && contentTags.includes(child.tagName)) {
        currentGroup.content.push(child);
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
        group.content.forEach((el) => {
          paragraphs.appendChild(el.cloneNode(true));
        });
      }

      blockList.appendChild(blockItem);
    });

    // The source richtext is only used as a data reference; remove it once mapped.
    richtext.remove();
  });

  // Template2: [richtext-map=richtext] and .cs-indi_story-card both live
  // inside .cs-indi_story-card-wrapper. .cs-indi_story-card is used as the
  // clone template (like block-item above), then removed once used. Each
  // group's icon comes from the <figure><img></figure> that precedes its h3
  // in the rich text, replacing whatever icon the template card already has.
  document.querySelectorAll('.cs-indi_story-card-wrapper').forEach((wrapper) => {
    const richtext = wrapper.querySelector('[richtext-map=richtext]');
    const cardTemplate = wrapper.querySelector('.cs-indi_story-card');

    if (!richtext || !cardTemplate) return;

    cardTemplate.remove();

    // .cs-indi_story-pag lives elsewhere in the same section, not inside
    // this wrapper — find it via the shared <section> ancestor.
    const pagList = wrapper.closest('section')?.querySelector('.cs-indi_story-pag');
    const pagTemplate = pagList?.querySelector('[richtext-map=title-num]');
    if (pagTemplate) pagTemplate.remove();

    const contentTags = ['P', 'UL', 'OL'];
    const groups = [];
    let currentGroup = null;
    let pendingIcon = null;

    Array.from(richtext.children).forEach((child) => {
      if (child.tagName === 'FIGURE') {
        pendingIcon = child.querySelector('img');
      } else if (child.tagName === 'H3') {
        currentGroup = { heading: child, content: [], icon: pendingIcon };
        pendingIcon = null;
        groups.push(currentGroup);
      } else if (currentGroup && contentTags.includes(child.tagName)) {
        currentGroup.content.push(child);
      }
    });

    groups.forEach((group, index) => {
      const card = cardTemplate.cloneNode(true);

      const title = card.querySelector('[richtext-map=title]');
      const text = card.querySelector('.cs-indi_story-card-text');
      const iconWrap = card.querySelector('.hero-1_card-svg-wrap');

      if (title) title.textContent = group.heading.textContent;
      if (text) {
        text.innerHTML = '';
        group.content.forEach((el) => {
          text.appendChild(el.cloneNode(true));
        });
      }
      if (iconWrap && group.icon) {
        iconWrap.innerHTML = '';
        iconWrap.appendChild(group.icon.cloneNode(true));
      }

      wrapper.appendChild(card);

      if (pagList && pagTemplate) {
        const pagItem = pagTemplate.cloneNode(true);
        const number = pagItem.querySelector('div') || pagItem;
        number.textContent = String(index + 1).padStart(2, '0');
        pagList.appendChild(pagItem);
      }
    });

    richtext.remove();
  });
}

/**
 * Template2 only: highlights the .cs-indi_story-pag pill matching whichever
 * .cs-indi_story-card is currently scrolled to, and toggles .is-sticking on
 * .section.for-story while .content.for-story is pinned.
 */
export function initStoryScrollSync() {
  window.addEventListener('load', () => {
    const storyCards = document.querySelectorAll('.cs-indi_story-card');
    const storyPills = document.querySelectorAll('.cs-indi_story-pag .pill-head');

    if (storyCards.length && storyPills.length) {
      const updateActiveCard = () => {
        let activeIndex = 0;

        storyCards.forEach((card, i) => {
          const rect = card.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5) {
            activeIndex = i;
          }
        });

        storyPills.forEach((p) => p.classList.remove('is-accent'));
        storyPills[activeIndex]?.classList.add('is-accent');
      };

      storyPills[0]?.classList.add('is-accent');

      let rafPending = false;
      window.addEventListener(
        'scroll',
        () => {
          if (rafPending) return;
          rafPending = true;
          requestAnimationFrame(() => {
            updateActiveCard();
            rafPending = false;
          });
        },
        { passive: true }
      );

      updateActiveCard();
    }

    const storyContent = document.querySelector('.content.for-story');
    const storySection = document.querySelector('.section.for-story');

    if (storyContent && storySection) {
      const checkSticky = () => {
        const rect = storyContent.getBoundingClientRect();
        const stickyTop = parseInt(getComputedStyle(storyContent).top) || 0;

        const isSticky = Math.round(rect.top) === stickyTop;
        storySection.classList.toggle('is-sticking', isSticky);
      };

      window.addEventListener('scroll', checkSticky, { passive: true });
      checkSticky();
    }
  });
}
