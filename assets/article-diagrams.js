(() => {
  'use strict';
  document.querySelectorAll('.article-diagram__panel').forEach(panel => {
    const diagram = panel.querySelector('.article-diagram__diagram');
    const controls = panel.querySelector('.article-diagram__controls');
    if (!diagram || !controls) return;
    controls.querySelectorAll('button[data-focus]').forEach(button => {
      button.addEventListener('click', () => {
        diagram.dataset.focus = button.dataset.focus;
        controls.querySelectorAll('button').forEach(item => {
          item.setAttribute('aria-pressed', String(item === button));
        });
      });
    });
    controls.hidden = false;
  });
})();
