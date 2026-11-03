(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-embossing-process]').forEach((root) => {
    const steps = Array.from(root.querySelectorAll('[data-step]'));
    const controls = root.querySelector('[data-process-controls]');
    const play = root.querySelector('[data-process-play]');
    const stop = root.querySelector('[data-process-stop]');
    const status = root.querySelector('[data-process-status]');
    if (steps.length !== 3 || !controls || !play || !stop || !status) return;
    let timers = [];
    const clearTimers = () => {
      timers.forEach(window.clearTimeout);
      timers = [];
    };
    const showAll = () => {
      clearTimers();
      root.removeAttribute('data-playing');
      steps.forEach((step) => step.classList.add('is-shown'));
      status.textContent = 'Показаны все три этапа.';
    };
    const showStep = (count) => {
      steps.forEach((step, index) => step.classList.toggle('is-shown', index < count));
      const label = steps[count - 1].querySelector('[data-step-title]');
      status.textContent = `Этап ${count} из 3: ${label.textContent}.`;
    };
    play.addEventListener('click', () => {
      clearTimers();
      if (reducedMotion.matches) {
        showAll();
        return;
      }
      root.setAttribute('data-playing', '');
      showStep(1);
      timers.push(window.setTimeout(() => showStep(2), 2500));
      timers.push(window.setTimeout(() => showStep(3), 5500));
      timers.push(window.setTimeout(showAll, 8000));
    });
    stop.addEventListener('click', showAll);
    reducedMotion.addEventListener('change', showAll);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) showAll();
    });
    controls.hidden = false;
  });
})();
