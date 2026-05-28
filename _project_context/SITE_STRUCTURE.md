# SITE STRUCTURE

## Краткое дерево проекта

```text
dinarcraft/
  index.html
  catalog/
    index.html
    [21 папка товарных страниц]
    [6 старых SEO-страниц]
  services/
    index.html
  cooperation/
    index.html
  articles/
    index.html
    [5 папок статей]
  privacy/
    index.html
  assets/
    site.css
    site.js
    product-gallery.js
    catalog.js
    images/
      hero/
      products/  (21 папка товаров, подробно не расписывать)
  sitemap.xml
  robots.txt
  CNAME
  logo.png
  favicon.png
  favicon-32.png
  apple-touch-icon.png
  yandex_8c6bf607b65193e7.html
  yandex_b28c22483554a6c.html
  privacy.html
```

Примечание: `privacy.html` - отдельный файл-переход на актуальную страницу `/privacy/`. В `sitemap.xml` указана именно `/privacy/`.

## Структура сайта по страницам

- `/` - главная страница. Объясняет, что такое DINAR handmade, показывает основные направления, условия опта, возможности производства и контакты.
- `/catalog/` - общий каталог B2B-позиций с категориями и карточками товаров.
- `/catalog/[product-folder]/` - отдельные товарные страницы с фото, описанием, условиями заказа, ссылками на расчет.
- `/services/` - производственные услуги: тиснение, вырубка, нарезка, фурнитура, детали под заказ.
- `/cooperation/` - условия и форматы сотрудничества для B2B-заказчиков.
- `/articles/` - раздел статей и материалов для оптовых заказчиков.
- `/privacy/` - политика обработки данных.

## Товарные страницы

- `/catalog/032-bagazhnyy-remen-ruchka-2m/` - Багажный ремень с ручкой 2 метра
- `/catalog/wb95hz1w-bagazhnyy-remen-ruchka-27m/` - Багажный ремень с ручкой 2,7 метра
- `/catalog/046-bagazhnyy-remen-ruchka-2m/` - Багажный ремень с ручкой 2 метра, вариант 046
- `/catalog/060-remen-bagazhnyy-fasteks-2m/` - Ремень багажный фастекс 2 метра
- `/catalog/064-remen-ryzhiy-25m-acetal-fasteks/` - Ремень рыжий 2,5 метра ацетал фастекс
- `/catalog/065-remen-ryzhiy-25m-derevo-ruchka/` - Ремень рыжий 2,5 метра дерево ручка
- `/catalog/066-komplekt-styazhek-12-detali-poliester/` - Комплект стяжек 1,2 ацеталь и полиэстер
- `/catalog/034-ezhednevnik-kozhanyy-a5/` - Ежедневник кожаный А5
- `/catalog/044-ezhednevnik-kozhanyy-a5-sketch-buk/` - Ежедневник кожаный А5 скетч бук
- `/catalog/054-ezhednevnik-kozhanyy-a5-s-prorezyami/` - Ежедневник кожаный А5 с прорезями
- `/catalog/061-ezhednevnik-a5-volna/` - Ежедневник А5 ВОЛНА
- `/catalog/039-ochechnik/` - Очечник кожаный
- `/catalog/047-kapkholder/` - Капхолдер
- `/catalog/048-ochechnik-bezhevyy/` - Очечник бежевый
- `/catalog/049-chehol-karty-taro/` - Чехол и карты таро
- `/catalog/053-ochechnik-oranzh/` - Очечник оранж
- `/catalog/056-ochechnik-mini/` - Очечник мини
- `/catalog/063-chehol-dlya-termosa/` - Чехол для термоса
- `/catalog/059-ruchki-dlya-sumki-kozhanye/` - Ручки для сумки кожаные
- `/catalog/062-ruchka-dlya-sumki-naplechnaya/` - Ручка для сумки наплечная
- `/catalog/067-ruchki-dlya-sumki-karabiny/` - Ручки для сумки кожаные с карабинами

## Старые SEO-страницы каталога

В каталоге есть отдельные SEO-страницы под старые или более широкие поисковые запросы:

- `/catalog/bagazhnye-remni-optom/` - багажные ремни оптом;
- `/catalog/remni-iz-stropy-optom/` - ремни из стропы оптом;
- `/catalog/ezhednevniki-kozha-optom/` - кожаные ежедневники А5 оптом;
- `/catalog/ochechniki-kozha-optom/` - кожаные очечники оптом;
- `/catalog/breloki-kozha-optom/` - кожаные брелоки оптом;
- `/catalog/shildy-birdekel-kozha/` - кожаные шильды и бирдекели.

Их нельзя удалять или менять без отдельной SEO-проверки, потому что они есть в `sitemap.xml`.

## Статьи

Фактически существуют 5 страниц статей:

- `/articles/kak-zakazat-kozhanie-izdeliya-optom/` - Как заказать кожаные изделия оптом;
- `/articles/kak-podgotovit-logotip-dlya-tisneniya/` - Как подготовить логотип для тиснения;
- `/articles/chto-vliyaet-na-cenu-kozhanyh-izdeliy/` - Что влияет на цену кожаных изделий;
- `/articles/remni-iz-stropy-optom/` - Ремни из стропы оптом;
- `/articles/ezhednevniki-s-tisneniem-optom/` - Ежедневники с тиснением оптом.

На странице `/articles/` также есть карточки будущих материалов с пометкой "Материал в подготовке".

## Страницы в sitemap.xml

В `sitemap.xml` указаны:

- главная: `https://dinarcraft.ru/`;
- основные разделы: `/catalog/`, `/services/`, `/cooperation/`, `/articles/`, `/privacy/`;
- 6 старых SEO-страниц каталога;
- 5 статей;
- 21 товарная страница.

Всего в sitemap сейчас 38 URL.

## Роль разделов

- Главная - короткая презентация мастерской, условий опта и контактов.
- Каталог - основная витрина товаров.
- Товарные страницы - страницы для SEO и подробного объяснения каждой позиции.
- Услуги - производственные возможности и работы под заказ.
- Сотрудничество - условия работы с B2B-клиентами.
- Статьи - информационный SEO-раздел.
- Политика - страница про обработку данных, cookies и Метрику.
