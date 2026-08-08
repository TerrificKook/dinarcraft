# Текущий стандарт статей DINAR handmade

Этот документ фиксирует уже используемый шаблон сайта. Он не предлагает новый дизайн, CMS, фреймворк, сборщик или библиотеку. Основные образцы: статьи о ремнях из стропы, ежедневниках с тиснением, капхолдере и цене ручной работы.

## 1. Базовые правила

- Одна статья — папка `/articles/<slug>/` с файлом `index.html`.
- Публичный URL заканчивается косой чертой: `https://dinarcraft.ru/articles/<slug>/`.
- Используются общие `/assets/site.css` и `/assets/site.js`; отдельные библиотеки и сборка не нужны.
- Шапка, подвал, контактные данные, Метрика и подключение общего JavaScript копируются из актуальной статьи без удаления существующей логики.
- URL существующей статьи не меняется при обновлении текста.

## 2. Фактическая HTML-структура

Сокращённый каркас текущих статей:

```html
<body class="article-page">
  <nav class="nav">...</nav>

  <header class="page-hero article-hero">
    <div class="article-hero-inner">
      <div class="eyebrow">Тема</div>
      <h1>Заголовок статьи</h1>
      <p>Короткое пояснение к статье.</p>
    </div>
  </header>

  <main class="article-main">
    <div class="article-layout">
      <article class="article-body">
        <div class="article-meta" aria-label="Информация о статье">...</div>
        <p>Вводный абзац.</p>
        <h2 id="slug-razdela">Заголовок раздела</h2>
        <p>Текст раздела.</p>
        <div class="contact-actions">...</div>
      </article>

      <aside class="article-sidebar" aria-label="Навигация по статье">
        <nav class="article-toc" aria-labelledby="article-toc-title">...</nav>
        <div class="article-side-cta">...</div>
      </aside>
    </div>
  </main>

  <footer>...</footer>
  <script src="/assets/site.js"></script>
</body>
```

Порядок основных блоков во всех 10 статьях одинаков: шапка → герой → основной текст и боковая колонка → подвал → скрипты.

## 3. Используемые CSS-классы

| Задача | Текущие классы |
|---|---|
| Страница статьи | `article-page` |
| Верхний экран | `page-hero article-hero`, `article-hero-inner`, `eyebrow` |
| Основная область | `article-main`, `article-layout`, `article-body` |
| Автор и даты | `article-meta` |
| Боковая колонка | `article-sidebar` |
| Содержание | `article-toc` |
| Боковой призыв | `article-side-cta`, `article-side-actions` |
| Нижние кнопки | `contact-actions`, `btn`, `secondary` |
| Изображение товара в статье | `product-main-image` |
| Список и карточка на странице статей | `article-list`, `article-card`, `card-link` |

Не следует создавать дублирующие классы, если существующие уже решают задачу.

## 4. Хлебные крошки

В текущих статьях нет видимого блока хлебных крошек. Они заданы только в JSON-LD как `BreadcrumbList`:

1. Главная — `https://dinarcraft.ru/`;
2. Статьи — `https://dinarcraft.ru/articles/`;
3. Текущая статья — её canonical URL.

Добавление видимых хлебных крошек будет изменением интерфейса, поэтому его нельзя считать частью текущего шаблона без отдельного решения.

## 5. Заголовки и содержание

- На странице один H1 внутри `article-hero-inner`.
- Над H1 используется короткий тематический `eyebrow`.
- Под H1 размещается один поясняющий абзац.
- Основные разделы статьи оформляются H2 с уникальным латинским `id`.
- Каждый H2 с `id` повторяется ссылкой в `article-toc`.
- Списки оформляются обычными `<ul>` или `<ol>`; отдельный компонент для них не нужен.
- Текущий полный формат — содержательный вводный блок, 9–12 разделов и практический финал. Три ранние статьи заметно короче и не являются ориентиром по глубине текста.
- Если раздел логически вложен в другой раздел, сначала проверяется иерархия заголовков; нельзя механически превращать все подзаголовки в H2 только ради внешнего вида.

## 6. Автор и даты

Блок `article-meta` содержит:

- «Материал подготовлен мастерской DINAR handmade»;
- дату публикации в `<time datetime="YYYY-MM-DD">`;
- дату обновления, если материал реально обновлялся.

`datePublished` и `dateModified` в Schema.org должны соответствовать этим данным. `lastmod` в sitemap меняется только при содержательном обновлении страницы.

## 7. Изображения

Видимые изображения сейчас используются в пяти статьях — о ремнях, капхолдере, мерче для кофейни, выборе очечника и блокноте на кольцах. Фактический шаблон:

```html
<figure class="product-main-image" style="margin:22px 0">
  <img src="/assets/images/products/<slug>/01-main.webp" alt="Понятное описание изображения">
</figure>
```

Правила текущего сайта:

- использовать существующее реальное изображение товара, относящееся к статье;
- путь в HTML — абсолютный от корня сайта;
- `alt` описывает изображение, а не повторяет набор ключевых слов;
- `og:image` и `Article.image` используют абсолютный URL `https://dinarcraft.ru/...`;
- если подходящего изображения нет, текущий запасной вариант — `https://dinarcraft.ru/logo.png`;
- не создавать новый формат галереи или декоративную обработку без отдельной задачи.

У статьи об ежедневниках товарное изображение уже указано в Open Graph и Schema.org, но не показано в основном тексте. Это существующее отличие, а не обязательный шаблон.

## 8. Внутренние ссылки

В полной статье обычно присутствуют ссылки трёх уровней:

1. на связанную SEO-страницу товарной группы;
2. на конкретные товары;
3. на полезные статьи, `/services/`, `/cooperation/` или общий каталог.

Используются корневые пути вида `/catalog/.../` и `/articles/.../`. Текст ссылки должен объяснять, куда она ведёт. Ссылка «Перейти» допустима в карточках каталога, но в основном тексте статьи лучше использовать название материала или товара.

Для внешних ссылок, открывающихся в новом окне, сохраняются `target="_blank"` и `rel="noopener"`.

Перед добавлением ссылки нужно проверить, что целевая страница существует и её роль не дублирует роль статьи.

## 9. CTA

Текущий шаблон содержит два CTA-блока.

Нижний CTA внутри `article-body`:

```html
<div class="contact-actions">
  <a class="btn" href="/catalog/.../">Посмотреть товары</a>
  <a class="btn secondary" href="/articles/.../">Связанный материал</a>
</div>
```

Боковой CTA внутри `article-sidebar`:

```html
<div class="article-side-cta">
  <h2>Нужна партия под ваш проект?</h2>
  <p>Короткое пояснение.</p>
  <div class="article-side-actions">
    <a class="btn" href="https://t.me/mrdinar" target="_blank" rel="noopener">Написать в Telegram</a>
    <a class="btn secondary" href="/catalog/">Перейти в каталог</a>
  </div>
</div>
```

Текст коммерческих условий нельзя менять на неподтверждённые цены, сроки, скидки или наличие.

## 10. SEO-теги

Для статьи используются:

- уникальный `<title>`;
- уникальный `<meta name="description">`;
- один H1;
- `<link rel="canonical" href="https://dinarcraft.ru/articles/<slug>/">`;
- `lang="ru"`, UTF-8 и viewport;
- favicon и `/assets/site.css` по существующему шаблону.

Title, H1 и description описывают один кластер, но не обязаны дословно повторять друг друга. Canonical, `og:url`, `Article.url`, `BreadcrumbList` и URL в sitemap должны совпадать.

## 11. Open Graph и Twitter Card

Фактический набор:

```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="article">
<meta property="og:url" content="https://dinarcraft.ru/articles/<slug>/">
<meta property="og:image" content="https://dinarcraft.ru/...">
<meta property="og:locale" content="ru_RU">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://dinarcraft.ru/...">
```

Тексты Open Graph и Twitter сейчас повторяют Title и meta description. Изображение должно существовать в репозитории и соответствовать материалу.

## 12. Schema.org

Статья содержит два отдельных блока `application/ld+json`.

`Article` включает:

- `headline`;
- `description`;
- `url`;
- `image`;
- `author` типа `Organization` с именем `DINAR handmade`;
- `datePublished`;
- `dateModified`;
- `publisher` типа `Organization` и `logo` типа `ImageObject`.

`BreadcrumbList` включает три уровня: главная, раздел статей, текущая статья.

Нельзя добавлять вымышленные отзывы, рейтинги, цены, наличие или другие коммерческие поля, которых нет в подтверждённых данных.

## 13. Карточка в `/articles/index.html`

Более полный текущий вариант карточки:

```html
<article class="article-card">
  <h2>Название статьи</h2>
  <p>Короткое описание пользы материала.</p>
  <a class="card-link" href="/articles/<slug>/">Читать статью</a>
</article>
```

На текущей странице 7 из 10 карточек имеют описание, а 3 ранние карточки состоят только из H2 и ссылки. Для новой или существенно обновлённой статьи следует использовать полный уже существующий вариант с кратким описанием, не меняя дизайн карточки.

Карточка добавляется только после появления рабочей страницы. Заглушек «Материал в подготовке» сейчас нет.

## 14. Обновление `sitemap.xml`

Для новой статьи добавляется один блок:

```xml
<url>
  <loc>https://dinarcraft.ru/articles/<slug>/</loc>
  <lastmod>YYYY-MM-DD</lastmod>
</url>
```

Для обновлённой статьи меняется только её достоверный `lastmod`. Нельзя добавлять URL несуществующей страницы или второй вариант одного canonical URL.

## 15. Проверка мобильной версии

Текущий CSS уже содержит две контрольные точки:

- до 1100 px: статья становится одноколоночной, боковая колонка перемещается перед текстом, sticky отключается;
- до 820 px: уменьшаются отступы и размер текста, H2 переносятся, метаданные становятся вертикальными, CTA занимает доступную ширину.

После добавления или расширения статьи вручную проверяются:

- H1 и длинные H2 не выходят за экран;
- меню открывается и не перекрывает страницу;
- все пункты содержания ведут к существующим `id`;
- боковой CTA перед текстом не делает начало страницы чрезмерно длинным;
- кнопки помещаются по ширине и остаются нажимаемыми;
- изображения не растягиваются и не вызывают горизонтальную прокрутку;
- ссылки и списки читаются при ширине около 360–390 px;
- страница нормально выглядит при 820, 1100 px и на широком экране.

## 16. Минимальная проверка перед публикацией

Из корня репозитория можно выполнить:

```powershell
$articleSlug = 'remni-iz-stropy-optom'
rg -n '<title>|meta name="description"|rel="canonical"|og:type|application/ld\+json|<h1' "articles\$articleSlug\index.html"
rg -n -F "/articles/$articleSlug/" articles\index.html sitemap.xml
git status --short
git diff --check
git diff -- "articles\$articleSlug\index.html" articles\index.html sitemap.xml
```

Новый файл до добавления в Git виден в `git status`, но обычный `git diff` его содержимое не показывает. При необходимости посмотреть такой файл как diff без добавления в индекс:

```powershell
git diff --no-index -- NUL "articles\$articleSlug\index.html"
```

Код возврата `1` для этой команды означает, что новый файл отличается от пустого файла; это ожидаемо.

Для просмотра через простой локальный сервер, если Python уже установлен:

```powershell
python -m http.server 8000
```

После запуска открыть `http://localhost:8000/articles/<slug>/`. Устанавливать зависимости или запускать сборку для этого сайта не требуется.
