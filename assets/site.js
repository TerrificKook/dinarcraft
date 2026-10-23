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
    ['Email', 'mailto:b2b@dinarcraft.ru']
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
    '<input class="site-search-input ym-disable-keys ym-hide-content" id="site-search-input" type="search" autocomplete="off" placeholder="Например: капхолдер, ежедневник А5, 032">',
    '<div class="site-search-results ym-hide-content" aria-live="polite"></div>',
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

// Keep an enquiry on the selected page; native links remain the fallback.
(function(){
  if (!document.querySelector('.nav') || typeof HTMLDialogElement === 'undefined') return;
  var dialog = document.createElement('dialog');
  if (typeof dialog.showModal !== 'function') return;
  dialog.className = 'enquiry-dialog';
  dialog.setAttribute('aria-labelledby', 'enquiry-title');
  dialog.innerHTML = '<button type="button" class="enquiry-close" aria-label="Закрыть контакты">×</button>' +
    '<h2 id="enquiry-title">Обсудить заказ</h2><p class="enquiry-context"></p>' +
    '<p>Укажите количество, пожелания к материалу и логотипу, город доставки и желаемый срок.</p>' +
    '<div class="enquiry-links"><a href="https://t.me/mrdinar" target="_blank" rel="noopener">Написать в Telegram</a>' +
    '<a href="https://max.ru/u/f9LHodD0cOKdKxpZWRTf6opqWFE4_FBbFln83YGEvx6yfmukrq7u5bdn0Wg" target="_blank" rel="noopener">Написать в MAX</a>' +
    '<a class="enquiry-email" href="mailto:b2b@dinarcraft.ru">Написать на email</a>' +
    '<a href="tel:+79958815095">Позвонить: +7 (995) 881-50-95</a></div>' +
    '<button type="button" class="enquiry-copy">Скопировать товар и ссылку</button><p class="enquiry-status" role="status"></p>';
  document.body.appendChild(dialog);
  var dock = document.createElement('div');
  dock.className = 'enquiry-dock';
  dock.setAttribute('role', 'group');
  dock.setAttribute('aria-label', 'Быстрая связь');
  dock.innerHTML = '<a href="tel:+79958815095">Позвонить</a><button type="button">Контакты и расчёт</button>';
  document.body.appendChild(dock);
  document.body.classList.add('has-enquiry-dock');
  var trigger, brief;
  function open(source){
    trigger = source;
    var card = source.closest('.catalog-product-card');
    var title = card ? card.querySelector('h3').textContent.trim() : document.querySelector('h1').textContent.trim();
    var link = card ? card.querySelector('a[href^="/catalog/"]') : null;
    var canonical = document.querySelector('link[rel="canonical"]');
    var url = link ? 'https://dinarcraft.ru' + link.getAttribute('href') : (canonical ? canonical.href : location.href.split('#')[0]);
    var sku = card && card.querySelector('.catalog-product-meta span');
    if (sku) title += ' · ' + sku.textContent.trim();
    brief = title + '\n' + url;
    dialog.querySelector('.enquiry-context').textContent = title;
    dialog.querySelector('.enquiry-email').href = 'mailto:b2b@dinarcraft.ru?subject=' + encodeURIComponent('Расчёт: ' + title) + '&body=' + encodeURIComponent(brief + '\n\nКоличество:\nМатериал и цвет:\nЛоготип:\nГород доставки:\nЖелаемый срок:');
    dialog.querySelector('.enquiry-status').textContent = '';
    dialog.showModal();
    dialog.querySelector('.enquiry-close').focus();
  }
  dock.querySelector('button').addEventListener('click', function(){ open(this); });
  document.addEventListener('click', function(event){
    var a = event.target.closest('a[href]');
    if (!a || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (!/^\/?#contacts$/.test(a.getAttribute('href')) || !/расч[её]т|обсудить/i.test(a.textContent)) return;
    event.preventDefault(); open(a);
  });
  dialog.querySelector('.enquiry-close').addEventListener('click', function(){dialog.close();});
  dialog.addEventListener('click', function(e){if(e.target === dialog){var r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close', function(){if(trigger)trigger.focus();});
  dialog.querySelector('.enquiry-copy').addEventListener('click', function(){
    var status=dialog.querySelector('.enquiry-status');
    if (!navigator.clipboard || !navigator.clipboard.writeText) {status.textContent=brief;return;}
    navigator.clipboard.writeText(brief).then(function(){status.textContent='Товар и ссылка скопированы. Вставьте их в сообщение.';},function(){status.textContent=brief;});
  });
})();

// Progressive enhancement: all catalog products and links remain in the HTML.
(function(){
  var field=document.querySelector('#catalog-find');
  if(!field)return;
  var controls=document.querySelector('.catalog-find'); controls.hidden=false;
  var cards=Array.prototype.slice.call(document.querySelectorAll('.catalog-product-card'));
  var sections=Array.prototype.slice.call(document.querySelectorAll('.catalog-section[id]'));
  var status=document.querySelector('#catalog-find-status');
  function normalize(s){return s.toLowerCase().replace(/ё/g,'е').replace(/[^а-яa-z0-9]+/gi,' ').trim();}
  function filter(){
    var words=normalize(field.value).split(/\s+/).filter(Boolean),count=0;
    cards.forEach(function(card){var text=normalize(card.textContent);card.hidden=!words.every(function(w){return text.indexOf(w)!==-1;});if(!card.hidden)count++;});
    sections.forEach(function(section){section.hidden=!section.querySelector('.catalog-product-card:not([hidden])');
      section.querySelectorAll('.catalog-subheading').forEach(function(h){var grid=h.nextElementSibling;h.hidden=!!grid && !grid.querySelector('.catalog-product-card:not([hidden])');});});
    status.textContent=count ? 'Показано моделей: '+count+' из '+cards.length : 'Ничего не найдено. Измените запрос или сбросьте поиск.';
  }
  field.addEventListener('input',filter);
  document.querySelector('.catalog-find-reset').addEventListener('click',function(){field.value='';filter();field.focus();});
  document.querySelectorAll('.catalog-quick-links a[href^="#"]').forEach(function(a){a.addEventListener('click',function(){field.value='';filter();});});
  filter();
})();

// First-party consent controller; the counter loads only after explicit consent.
(function(){if(document.querySelector('script[data-dinar-consent]'))return;var s=document.createElement("script");s.dataset.dinarConsent="1";s.src="/assets/consent-metrika.js?v=20261006-minimal";document.head.appendChild(s);})();
