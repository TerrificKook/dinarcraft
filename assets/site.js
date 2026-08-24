(function(){
  var nav = document.querySelector('.nav');
  if (!nav || nav.querySelector('.nav-toggle')) return;

  var links = [
    ['Главная', '/'],
    ['Каталог', '/catalog/'],
    ['Услуги', '/services/'],
    ['Сотрудничество', '/cooperation/'],
    ['Статьи', '/articles/'],
    ['Контакты', '/#contacts'],
    ['Telegram', 'https://t.me/mrdinar'],
    ['MAX', 'https://max.ru/u/f9LHodD0cOKdKxpZWRTf6opqWFE4_FBbFln83YGEvx6yfmukrq7u5bdn0Wg'],
    ['+7 (995) 881-50-95', 'tel:+79958815095'],
    ['Email', 'mailto:db@dinardb.ru']
  ];
  var panelId = 'mobile-nav-panel';
  var button = document.createElement('button');
  var panel = document.createElement('div');
  var openLabel = 'Открыть меню';
  var closeLabel = 'Закрыть меню';
  var menuTimer;
  var nextFrame = window.requestAnimationFrame || function(callback){
    return window.setTimeout(callback, 0);
  };

  button.className = 'nav-toggle';
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', openLabel);
  button.setAttribute('aria-controls', panelId);
  button.innerHTML = '<span></span><span></span><span></span>';

  panel.className = 'nav-mobile-panel';
  panel.id = panelId;
  panel.hidden = true;
  panel.innerHTML = '<ul>' + links.map(function(item){
    var external = item[1].indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '';
    return '<li><a href="' + item[1] + '"' + external + '>' + item[0] + '</a></li>';
  }).join('') + '</ul>';

  function getMenuDelay(){
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
    return 220;
  }

  function openMenu(){
    window.clearTimeout(menuTimer);
    panel.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', closeLabel);
    nextFrame(function(){
      panel.classList.add('is-open');
    });
  }

  function closeMenu(){
    window.clearTimeout(menuTimer);
    panel.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', openLabel);
    menuTimer = window.setTimeout(function(){
      if (!panel.classList.contains('is-open')) panel.hidden = true;
    }, getMenuDelay());
  }

  function toggleMenu(){
    if (panel.hidden || !panel.classList.contains('is-open')) {
      openMenu();
      return;
    }
    closeMenu();
  }

  button.addEventListener('click', function(event){
    event.stopPropagation();
    toggleMenu();
  });
  panel.addEventListener('click', function(event){
    if (event.target.tagName === 'A') closeMenu();
  });
  document.addEventListener('click', function(event){
    if (!panel.hidden && !nav.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', function(event){
    if (event.key === 'Escape' && !panel.hidden) closeMenu();
  });

  nav.appendChild(button);
  nav.appendChild(panel);
})();

(function(){
  var counterId = 109097580;
  var directContactGoals = {
    telegram: 'telegram_click',
    max: 'max_click',
    phone: 'phone_click',
    email: 'email_click'
  };

  function isContactHost(hostname){
    var host = (hostname || '').toLowerCase().replace(/^www\./, '');
    return host === 't.me' ||
      host.slice(-5) === '.t.me' ||
      host === 'max.ru' ||
      host.slice(-7) === '.max.ru';
  }

  function getDirectContactType(link){
    var href = (link.getAttribute('href') || '').trim().toLowerCase();
    if (href.indexOf('tel:') === 0) return 'phone';
    if (href.indexOf('mailto:') === 0) return 'email';

    var url = document.createElement('a');
    url.href = href;
    if (!isContactHost(url.hostname)) return '';

    var host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 't.me' || host.slice(-5) === '.t.me') return 'telegram';
    if (host === 'max.ru' || host.slice(-7) === '.max.ru') return 'max';
    return '';
  }

  function isContactSectionCta(link){
    var href = (link.getAttribute('href') || '').trim();
    if (href.indexOf('#contact') === -1) return false;

    var url = document.createElement('a');
    url.href = href;
    if (url.hash !== '#contacts' && url.hash !== '#contact') return false;

    return link.classList.contains('btn') ||
      link.classList.contains('card-link') ||
      !!link.closest('.contact-actions, .order-box');
  }

  function normalizeLinkText(link){
    var text = typeof link.innerText === 'string' ? link.innerText : link.textContent;
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function reachGoal(goalName, link, contactType){
    if (typeof window.ym === 'function') {
      window.ym(counterId, 'reachGoal', goalName, {
        pathname: location.pathname,
        link_text: normalizeLinkText(link),
        contact_type: contactType
      });
    }
  }

  document.addEventListener('click', function(event){
    if (!event.target || !event.target.closest) return;

    var link = event.target.closest('a[href]');
    if (!link) return;

    var contactType = getDirectContactType(link);
    if (contactType) {
      reachGoal('contact_click', link, contactType);
      reachGoal(directContactGoals[contactType], link, contactType);
      return;
    }

    if (isContactSectionCta(link)) {
      reachGoal('contact_section_open', link, 'contact_section');
    }
  });
})();

(function(){
  var counterId = 109097580;
  var inlineInitPattern = /(?:^|[^\w$.])(?:window\.)?ym\s*\(\s*109097580\s*,\s*['"]init['"]/;
  var scripts = Array.prototype.slice.call(document.scripts);
  var hasInlineInit = scripts.some(function(script){
    return !script.src && inlineInitPattern.test(script.textContent);
  });
  var hasQueuedInit = !!(window.ym && window.ym.a &&
    Array.prototype.some.call(window.ym.a, function(args){
      return args && args[0] === counterId && args[1] === 'init';
    }));
  if (hasInlineInit || hasQueuedInit) return;

  window.ym = window.ym || function(){
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = window.ym.l || Date.now();

  if (!document.querySelector('script[src*="mc.yandex.ru/metrika/tag.js"]')) {
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.appendChild(tag);
  }

  window.ym(counterId, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true
  });
})();

(function(){
  var measurementId = 'G-1JNWHT0M1N';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){
    window.dataLayer.push(arguments);
  };

  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(tag);
  }

  window.gtag('js', new Date());
  window.gtag('config', measurementId);
})();

(function(){
  var key = 'dinarcraft_cookie_accepted_v1';
  try {
    if (localStorage.getItem(key) === '1') return;
  } catch (error) {
    return;
  }

  var banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = '<p>Мы используем cookies, Яндекс Метрику и Google Analytics, чтобы анализировать посещаемость сайта и улучшать его работу. Продолжая пользоваться сайтом, вы соглашаетесь с обработкой данных. Подробнее — в <a href="/privacy/">Политике обработки данных</a>.</p><button type="button" class="btn">Понятно</button>';

  var close = function(){
    try {
      localStorage.setItem(key, '1');
    } catch (error) {}
    banner.remove();
    document.body.classList.remove('has-cookie-banner');
  };

  banner.querySelector('button').addEventListener('click', close);
  document.body.appendChild(banner);
  document.body.classList.add('has-cookie-banner');
})();

(function(){
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!items.length) return;

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(function(item){
      item.classList.add('is-visible');
    });
    return;
  }

  document.documentElement.classList.add('reveal-ready');
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -6% 0px'
  });

  items.forEach(function(item){
    observer.observe(item);
  });
})();

(function(){
  var nav = document.querySelector('.nav');
  if (!nav || nav.querySelector('.site-search-button')) return;

  var indexUrl = '/assets/search-index.json';
  var resultLimit = 12;
  var searchIndex = null;
  var indexPromise = null;
  var activeTrigger = null;
  var previousBodyOverflow = '';
  var typeLabels = {
    product: 'Товар',
    catalog: 'Каталог',
    page: 'Страница',
    article: 'Статья'
  };
  var typePriority = {
    product: 4,
    catalog: 3,
    page: 2,
    article: 1
  };

  var desktopButton = document.createElement('button');
  desktopButton.className = 'site-search-button';
  desktopButton.type = 'button';
  desktopButton.setAttribute('aria-label', 'Поиск по сайту');
  desktopButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.25 4.25"></path></svg>';

  var phone = nav.querySelector('.nav-phone');
  nav.insertBefore(desktopButton, phone || null);

  var mobilePanel = nav.querySelector('.nav-mobile-panel ul');
  var mobileButton = null;
  if (mobilePanel) {
    var mobileItem = document.createElement('li');
    mobileButton = document.createElement('button');
    mobileButton.className = 'site-search-mobile-button';
    mobileButton.type = 'button';
    mobileButton.setAttribute('aria-label', 'Поиск по сайту');
    mobileButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.25 4.25"></path></svg><span>Поиск</span>';
    mobileItem.appendChild(mobileButton);
    mobilePanel.insertBefore(mobileItem, mobilePanel.firstChild);
  }

  var overlay = document.createElement('div');
  overlay.className = 'site-search-overlay';
  overlay.hidden = true;
  overlay.innerHTML = [
    '<section class="site-search-dialog" role="dialog" aria-modal="true" aria-labelledby="site-search-title">',
    '<div class="site-search-header">',
    '<h2 id="site-search-title">Поиск</h2>',
    '<button class="site-search-close" type="button" aria-label="Закрыть поиск">&times;</button>',
    '</div>',
    '<label class="site-search-label" for="site-search-input">Поиск по сайту</label>',
    '<input class="site-search-input" id="site-search-input" type="search" autocomplete="off" placeholder="Например: капхолдер, ежедневник А5, 032">',
    '<div class="site-search-results" aria-live="polite"></div>',
    '</section>'
  ].join('');
  document.body.appendChild(overlay);

  var dialog = overlay.querySelector('.site-search-dialog');
  var closeButton = overlay.querySelector('.site-search-close');
  var input = overlay.querySelector('.site-search-input');
  var results = overlay.querySelector('.site-search-results');

  function normalize(value){
    return String(value || '')
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[^a-zа-я0-9]+/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function prepareEntry(entry){
    entry._search = {
      title: normalize(entry.title),
      sku: normalize(entry.sku),
      category: normalize(entry.category),
      description: normalize(entry.description),
      keywords: normalize(entry.keywords)
    };
    entry._all = [
      entry._search.title,
      entry._search.sku,
      entry._search.category,
      entry._search.description,
      entry._search.keywords
    ].join(' ');
    return entry;
  }

  function loadIndex(){
    if (searchIndex) return Promise.resolve(searchIndex);
    if (indexPromise) return indexPromise;

    indexPromise = fetch(indexUrl, { credentials: 'same-origin' })
      .then(function(response){
        if (!response.ok) throw new Error('Search index request failed');
        return response.json();
      })
      .then(function(data){
        if (!Array.isArray(data)) throw new Error('Search index format is invalid');
        searchIndex = data.map(prepareEntry);
        return searchIndex;
      });

    return indexPromise;
  }

  function wordScore(text, token, weights){
    if (!text || !token) return 0;
    var words = text.split(' ');
    if (words.indexOf(token) !== -1) return weights[0];
    if (words.some(function(word){ return word.indexOf(token) === 0; })) return weights[1];
    if (text.indexOf(token) !== -1) return weights[2];
    return 0;
  }

  function scoreEntry(entry, query, tokens){
    if (!tokens.every(function(token){ return entry._all.indexOf(token) !== -1; })) return 0;

    var fields = entry._search;
    var score = 1;
    if (fields.sku && fields.sku === query) score += 400;
    else if (fields.sku && fields.sku.indexOf(query) === 0) score += 150;
    else if (fields.sku && fields.sku.indexOf(query) !== -1) score += 80;

    if (fields.title === query) score += 220;
    else if (fields.title.indexOf(query) === 0) score += 145;
    else if (fields.title.indexOf(query) !== -1) score += 100;

    if (fields.category === query) score += 70;
    else if (fields.category.indexOf(query) !== -1) score += 45;
    if (fields.keywords.indexOf(query) !== -1) score += 34;
    if (fields.description.indexOf(query) !== -1) score += 24;

    tokens.forEach(function(token){
      score += wordScore(fields.title, token, [38, 25, 16]);
      score += wordScore(fields.sku, token, [100, 65, 35]);
      score += wordScore(fields.category, token, [16, 11, 7]);
      score += wordScore(fields.keywords, token, [12, 8, 5]);
      score += wordScore(fields.description, token, [9, 6, 4]);
    });
    return score;
  }

  function makeMessage(message, includeCatalogLink){
    results.replaceChildren();
    var text = document.createElement('p');
    text.className = 'site-search-message';
    text.appendChild(document.createTextNode(message));
    if (includeCatalogLink) {
      text.appendChild(document.createTextNode(' '));
      var link = document.createElement('a');
      link.href = '/catalog/';
      link.textContent = 'Посмотрите весь каталог.';
      text.appendChild(link);
    }
    results.appendChild(text);
  }

  function renderResults(query){
    var normalizedQuery = normalize(query);
    if (normalizedQuery.length < 2) {
      makeMessage('Введите название изделия, категорию или артикул.', false);
      return;
    }
    if (!searchIndex) {
      makeMessage('Загрузка поиска...', false);
      return;
    }

    var tokens = normalizedQuery.split(' ');
    var matches = searchIndex.map(function(entry){
      return {
        entry: entry,
        score: scoreEntry(entry, normalizedQuery, tokens)
      };
    }).filter(function(item){
      return item.score > 0;
    }).sort(function(a, b){
      return b.score - a.score ||
        (typePriority[b.entry.type] || 0) - (typePriority[a.entry.type] || 0) ||
        a.entry.title.localeCompare(b.entry.title, 'ru');
    }).slice(0, resultLimit);

    if (!matches.length) {
      makeMessage('Ничего не найдено.', true);
      return;
    }

    results.replaceChildren();
    var list = document.createElement('ul');
    list.className = 'site-search-list';
    matches.forEach(function(item){
      var entry = item.entry;
      var listItem = document.createElement('li');
      var link = document.createElement('a');
      var meta = document.createElement('span');
      var title = document.createElement('strong');
      var description = document.createElement('span');

      link.className = 'site-search-result';
      link.href = entry.url;
      meta.className = 'site-search-result-meta';
      meta.textContent = typeLabels[entry.type] || 'Страница';
      if (entry.type === 'product' && entry.sku) meta.textContent += ' - артикул ' + entry.sku;
      if (entry.type === 'product' && entry.category) meta.textContent += ' - ' + entry.category;
      title.className = 'site-search-result-title';
      title.textContent = entry.title;
      description.className = 'site-search-result-description';
      description.textContent = entry.description || '';

      link.appendChild(meta);
      link.appendChild(title);
      if (entry.description) link.appendChild(description);
      listItem.appendChild(link);
      list.appendChild(listItem);
    });
    results.appendChild(list);
  }

  function closeSearch(){
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove('site-search-open');
    document.body.style.overflow = previousBodyOverflow;
    if (activeTrigger && document.contains(activeTrigger)) {
      if (activeTrigger === mobileButton) {
        var mobileFocusTarget = activeTrigger;
        var closedMenuButton = nav.querySelector('.nav-toggle[aria-expanded="false"]');
        if (closedMenuButton) closedMenuButton.click();
        window.requestAnimationFrame(function(){ mobileFocusTarget.focus(); });
      } else {
        activeTrigger.focus();
      }
    }
    activeTrigger = null;
  }

  function openSearch(trigger){
    var menuButton = nav.querySelector('.nav-toggle[aria-expanded="true"]');
    if (menuButton) menuButton.click();

    activeTrigger = trigger;
    previousBodyOverflow = document.body.style.overflow;
    overlay.hidden = false;
    document.body.classList.add('site-search-open');
    document.body.style.overflow = 'hidden';
    renderResults(input.value);
    window.requestAnimationFrame(function(){ input.focus(); });

    loadIndex().then(function(){
      renderResults(input.value);
    }).catch(function(){
      makeMessage('Поиск временно недоступен.', true);
    });
  }

  function trapFocus(event){
    if (event.key !== 'Tab') return;
    var focusable = Array.prototype.slice.call(dialog.querySelectorAll('button, input, a[href]'))
      .filter(function(element){ return !element.disabled && element.offsetParent !== null; });
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  desktopButton.addEventListener('click', function(){ openSearch(desktopButton); });
  if (mobileButton) mobileButton.addEventListener('click', function(){ openSearch(mobileButton); });
  closeButton.addEventListener('click', closeSearch);
  input.addEventListener('input', function(){ renderResults(input.value); });
  overlay.addEventListener('click', function(event){
    if (event.target === overlay) closeSearch();
  });
  overlay.addEventListener('keydown', trapFocus);
  document.addEventListener('keydown', function(event){
    if (event.key === 'Escape' && !overlay.hidden) closeSearch();
  });
})();
