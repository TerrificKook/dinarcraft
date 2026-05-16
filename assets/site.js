(function(){
  var key = 'dinarcraft_cookie_accepted_v1';
  if (localStorage.getItem(key) === '1') return;

  var banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = '<p>Мы используем cookies и Яндекс Метрику, чтобы анализировать посещаемость сайта и улучшать его работу. Продолжая пользоваться сайтом, вы соглашаетесь с обработкой данных. Подробнее - в <a href="/privacy/">Политике обработки данных</a>.</p><button type="button" class="btn">Понятно</button>';

  var close = function(){
    localStorage.setItem(key, '1');
    banner.remove();
    document.body.classList.remove('has-cookie-banner');
  };

  banner.querySelector('button').addEventListener('click', close);
  document.body.appendChild(banner);
  document.body.classList.add('has-cookie-banner');
})();
