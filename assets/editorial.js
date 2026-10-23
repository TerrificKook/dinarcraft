(function () {
  'use strict';
  var directory = document.querySelector('.articles-directory');
  if (directory) {
    var tools = directory.querySelector('.article-directory-tools');
    var search = directory.querySelector('#article-search');
    var groups = Array.from(directory.querySelectorAll('.article-index-group'));
    var filters = Array.from(directory.querySelectorAll('[data-topic]'));
    var topic = 'all';
    var normalize = function (value) { return value.toLowerCase().replace(/ё/g, 'е').trim(); };
    function filterArticles() {
      var terms = normalize(search.value).split(/\s+/).filter(Boolean);
      var count = 0;
      groups.forEach(function (group) {
        var visible = 0;
        group.querySelectorAll('.article-card').forEach(function (card) {
          var text = normalize(card.textContent);
          card.hidden = (topic !== 'all' && topic !== group.id) || !terms.every(function (term) { return text.includes(term); });
          if (!card.hidden) visible++;
        });
        group.hidden = !visible;
        count += visible;
      });
      filters.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.topic === topic)); });
      directory.querySelector('#article-search-status').textContent = count ? 'Найдено статей: ' + count : 'Ничего не найдено. Попробуйте другое слово или сбросьте фильтры.';
    }
    tools.hidden = false;
    directory.classList.add('directory-ready');
    search.addEventListener('input', filterArticles);
    filters.forEach(function (button) { button.addEventListener('click', function () { topic = button.dataset.topic; filterArticles(); }); });
    directory.querySelector('#article-search-reset').addEventListener('click', function () { topic = 'all'; search.value = ''; filterArticles(); search.focus(); });
    filterArticles();
  }
  var body = document.querySelector('.article-page .article-body');
  if (!body) return;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var headings = Array.from(body.querySelectorAll('h2[id]'));
  var toc = document.querySelector('.article-toc');
  var links = toc ? Array.from(toc.querySelectorAll('a[href^="#"]')) : [];
  var meta = body.querySelector('.article-meta');
  if (meta) {
    var words = body.textContent.trim().split(/\s+/).length;
    var time = document.createElement('span');
    time.className = 'article-reading-time';
    time.textContent = 'Около ' + Math.max(1, Math.ceil(words / 180)) + ' мин чтения';
    meta.appendChild(time);
  }
  if (toc) {
    var list = toc.querySelector('ol, ul');
    if (list) {
      var disclosure = document.createElement('details');
      disclosure.className = 'article-toc-disclosure';
      var summary = document.createElement('summary');
      summary.textContent = 'Содержание статьи';
      disclosure.appendChild(summary);
      disclosure.appendChild(list);
      toc.appendChild(disclosure);
      var mobile = window.matchMedia('(max-width: 1000px)');
      function setDisclosure() { disclosure.open = !mobile.matches; }
      setDisclosure();
      if (mobile.addEventListener) mobile.addEventListener('change', setDisclosure);
      links.forEach(function (link) {
        link.addEventListener('click', function () {
          if (mobile.matches) disclosure.open = false;
        });
      });
    }
  }
  var progress = document.createElement('div');
  progress.className = 'article-reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  var queued = false;
  function updateReading() {
    queued = false;
    var rect = body.getBoundingClientRect();
    var distance = Math.max(1, rect.height - window.innerHeight + 100);
    var fraction = Math.min(1, Math.max(0, (100 - rect.top) / distance));
    progress.style.transform = 'scaleX(' + fraction + ')';
    var active = '';
    headings.forEach(function (heading) {
      if (heading.getBoundingClientRect().top <= window.innerHeight * 0.38) active = heading.id;
    });
    links.forEach(function (link) {
      if (link.hash === '#' + active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleReading() {
    if (!queued) { queued = true; window.requestAnimationFrame(updateReading); }
  }
  window.addEventListener('scroll', scheduleReading, { passive: true });
  window.addEventListener('resize', scheduleReading);
  updateReading();
  // Content is visible even if JavaScript/observers fail. Motion never gates reading.
  if (!reducedMotion.matches && 'IntersectionObserver' in window && Element.prototype.animate) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (!reducedMotion.matches) entry.target.animate([
          { opacity: 0.65, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 460, easing: 'cubic-bezier(.2,.7,.2,1)' });
      });
    }, { threshold: 0.05 });
    body.querySelectorAll(':scope > h2, :scope > figure').forEach(function (element) { observer.observe(element); });
  }
})();
