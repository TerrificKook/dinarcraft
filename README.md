# DINAR handmade site

Статический сайт для GitHub Pages и домена `dinarcraft.ru`.

## Что уже есть

- `index.html` - весь сайт: разметка, стили и небольшой JavaScript.
- `logo.png`, `favicon.png`, `favicon-32.png`, `apple-touch-icon.png` - брендовые изображения.
- `CNAME` - привязка GitHub Pages к `dinarcraft.ru`.
- `robots.txt`, `sitemap.xml` - служебные файлы для поисковых систем.

## Какие элементы нужно загрузить

Сейчас в каталоге и блоке "О нас" стоят визуальные заглушки. Для полноценного сайта стоит добавить реальные фотографии:

- фото мастерской для блока "О нас";
- фото товаров из стропы;
- фото кожаных ежедневников и блокнотов;
- фото аксессуаров: очечник, брелок, картхолдер, капхолдер, шильд/бирдекель.

Рекомендуемая структура:

```text
images/
  about/
    workshop.jpg
  products/
    bagazhnyy-remen-2m.jpg
    bagazhnyy-remen-27m.jpg
    turisticheskiy-remen.jpg
    compression-strap.jpg
    ezhednevnik-a5.jpg
    ezhednevnik-volna.jpg
    sketchbook-a5.jpg
    ochechnik.jpg
    brelok.jpg
    cardholder.jpg
    cupholder.jpg
    shild-birdekel.jpg
```

## Как подключить фото товара

1. Загрузить файл через GitHub: `Add file` -> `Upload files`.
2. Положить его в папку `images/products/`.
3. В `index.html` найти нужную карточку товара.
4. Заменить заглушку внутри `.product-img` на изображение.

Пример:

```html
<div class="product-img">
  <img src="images/products/bagazhnyy-remen-2m.jpg" alt="Багажный ремень с ручкой 2 м">
  <span class="product-label">Стропа</span>
</div>
```

## Важные проверки перед публикацией

- `CNAME`, canonical-ссылка в `index.html`, `robots.txt` и `sitemap.xml` должны указывать на один домен: `dinarcraft.ru`.
- Если появится страница `privacy.html`, нужно добавить файл в репозиторий. Если страницы не будет, строку `Disallow: /privacy.html` можно убрать из `robots.txt`.
- Код Яндекс.Вебмастера нужно вставить в закомментированный блок `yandex-verification` в `index.html`.
