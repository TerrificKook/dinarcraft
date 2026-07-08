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
  var openLabel = '\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e';
  var closeLabel = '\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e';
  var menuTimer;
  var nextFrame = window.requestAnimationFrame || function(callback){
    return window.setTimeout(callback, 0);
  };

  button.className = 'nav-toggle';
  button.type = 'button';
  button.setAttribute('aria-label', 'Открыть меню');
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
  var goalName = 'contact_click';

  function isContactHost(hostname){
    var host = (hostname || '').toLowerCase().replace(/^www\./, '');
    return host === 't.me' ||
      host.slice(-5) === '.t.me' ||
      host === 'max.ru' ||
      host.slice(-7) === '.max.ru';
  }

  function isDirectContactLink(link){
    var href = (link.getAttribute('href') || '').trim().toLowerCase();
    if (href.indexOf('tel:') === 0 || href.indexOf('mailto:') === 0) return true;

    var url = document.createElement('a');
    url.href = href;
    return isContactHost(url.hostname);
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

  function reachContactGoal(){
    if (typeof ym === 'function') {
      ym(counterId, 'reachGoal', goalName);
    }
  }

  document.addEventListener('click', function(event){
    if (!event.target || !event.target.closest) return;

    var link = event.target.closest('a[href]');
    if (!link) return;

    if (isDirectContactLink(link) || isContactSectionCta(link)) {
      reachContactGoal();
    }
  });
})();

(function(){
  var counterId = 109097580;
  var scripts = Array.prototype.slice.call(document.scripts);
  var hasInlineInit = scripts.some(function(script){
    return !script.src && script.textContent.indexOf('ym(109097580') !== -1;
  });
  if (hasInlineInit) return;

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
  var key = 'dinarcraft_cookie_accepted_v1';
  try {
    if (localStorage.getItem(key) === '1') return;
  } catch (error) {
    return;
  }

  var banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = '<p>Мы используем cookies и Яндекс Метрику, чтобы анализировать посещаемость сайта и улучшать его работу. Продолжая пользоваться сайтом, вы соглашаетесь с обработкой данных. Подробнее - в <a href="/privacy/">Политике обработки данных</a>.</p><button type="button" class="btn">Понятно</button>';

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
