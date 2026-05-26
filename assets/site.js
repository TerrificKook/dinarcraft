(function(){
  var nav = document.querySelector('.nav');
  if (!nav || nav.querySelector('.nav-toggle')) return;

  var links = [
    ['Главная', '/'],
    ['Каталог', '/catalog/'],
    ['Услуги', '/services/'],
    ['Сотрудничество', '/cooperation/'],
    ['Статьи', '/articles/'],
    ['Контакты', '/#contact'],
    ['+7 (995) 881-50-95', 'tel:+79958815095']
  ];
  var panelId = 'mobile-nav-panel';
  var button = document.createElement('button');
  var panel = document.createElement('div');

  button.className = 'nav-toggle';
  button.type = 'button';
  button.setAttribute('aria-label', 'Открыть меню');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', panelId);
  button.innerHTML = '<span></span><span></span><span></span>';

  panel.className = 'nav-mobile-panel';
  panel.id = panelId;
  panel.hidden = true;
  panel.innerHTML = '<ul>' + links.map(function(item){
    return '<li><a href="' + item[1] + '">' + item[0] + '</a></li>';
  }).join('') + '</ul>';

  function closeMenu(){
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Открыть меню');
  }

  function toggleMenu(){
    var isOpen = !panel.hidden;
    panel.hidden = isOpen;
    button.setAttribute('aria-expanded', String(!isOpen));
    button.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
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
