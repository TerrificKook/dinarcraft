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
