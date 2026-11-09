(function () {
  if (location.hash) return;
  const quick = document.querySelector('.catalog-quick');
  const originalSections = Array.from(document.querySelectorAll('.catalog-section[id]'));
  const sourceCards = Array.from(document.querySelectorAll('.catalog-product-card'));
  const container = document.createElement('section');
  container.className = 'catalog-enhanced';
  container.innerHTML = '<div class="preview-controls"><div><label for="enhanced-search">Поиск по названию или артикулу</label><input id="enhanced-search" type="search" placeholder="Например, плед или 071"></div><div><label for="category">Вид изделия</label><select id="category"><option value="">Все изделия</option></select></div><div><label for="order">Порядок</label><select id="order"><option value="category">По видам</option><option value="sku">По артикулам</option></select></div><button id="reset" type="button">Сбросить</button></div><p id="enhanced-status" role="status"></p><div id="results"></div>';
  quick.after(container);
  const groups = [
    ['Багажные ремни и стяжки', '032 wb9f5hz1w 046 065 050 055 068 074 060 064 066 070 072'],
    ['Переноски и стяжки для пледа', '071 078'],
    ['Ежедневники и блокноты', '034 041 044 054 061 057'],
    ['Очечники', '039 048 053 056'],
    ['Для кофе и напитков', '047 063 069 073 079'],
    ['Подставки под кружки', '076 077'],
    ['Держатели карт и пропусков', '082 083 084'],
    ['Чехлы, кошельки и органайзеры', '049 058 085'],
    ['Брелоки', '075 086'],
    ['Ручки для сумок', '059 062 067'],
    ['Бирки и хлястики', '081']
  ];
  const synonyms = {'071':'плед переноска ремень стяжка', '078':'плед стяжка ремень', '063':'термос напитки чехол', '081':'бирка бирки хлястик шильд', '082':'доступ пропуск карта', '083':'доступ пропуск карта', '084':'доступ пропуск карта', '086':'доступ метка ключ'};
  const cards = sourceCards.map(card => {
    const sku = card.querySelector('.catalog-product-meta span').textContent.replace('Артикул:', '').trim();
    const group = groups.find(item => item[1].split(' ').includes(sku));
    const link = card.querySelector('.catalog-product-actions a').getAttribute('href');
    return {sku, group: group ? group[0] : 'Другие изделия', card, link, search: (card.textContent + ' ' + (synonyms[sku] || '') + ' ' + (group ? group[0] : '')).toLowerCase().replace(/ё/g,'е')};
  });
  if (cards.some(item => item.group === 'Другие изделия')) groups.push(['Другие изделия', '']);
  const search = document.querySelector('#enhanced-search'), category = document.querySelector('#category'), order = document.querySelector('#order'), results = document.querySelector('#results'), status = document.querySelector('#enhanced-status');
  groups.forEach(([name]) => {const option = document.createElement('option'); option.value = name; option.textContent = name; category.append(option);});
  if (new URLSearchParams(location.search).get('order') === 'sku') order.value = 'sku';
  function render() {
    const words = search.value.toLowerCase().replace(/ё/g,'е').trim().split(/\s+/).filter(Boolean);
    const visible = cards.filter(item => (!category.value || item.group === category.value) && words.every(word => item.search.includes(word)));
    results.replaceChildren();
    status.textContent = visible.length ? 'Показано моделей: ' + visible.length + ' из ' + cards.length : 'Ничего не найдено. Попробуйте другое название или сбросьте фильтр.';
    if (order.value === 'sku') {
      const list = document.createElement('div'); list.className = 'sku-list';
      visible.sort((a,b) => /^\d+$/.test(a.sku) && /^\d+$/.test(b.sku) ? Number(a.sku)-Number(b.sku) : /^\d+$/.test(a.sku) ? -1 : /^\d+$/.test(b.sku) ? 1 : a.sku.localeCompare(b.sku));
      visible.forEach(item => {const row = document.createElement('a'); row.className='sku-row'; row.href=item.link; const img=item.card.querySelector('img').cloneNode(); const sku=document.createElement('strong'); sku.textContent=item.sku; const name=document.createElement('span'); name.textContent=item.card.querySelector('h3').textContent; row.append(img,sku,name); list.append(row);});
      results.append(list);
    } else {
      groups.forEach(([name]) => {const items=visible.filter(item => item.group===name); if(!items.length)return; const section=document.createElement('section'); section.className='preview-group'; const heading=document.createElement('h2'); heading.textContent=name; const grid=document.createElement('div'); grid.className='catalog-grid'; items.forEach(item => grid.append(item.card.cloneNode(true))); section.append(heading,grid); results.append(section);});
    }
  }
  search.addEventListener('input',render); category.addEventListener('change',render); order.addEventListener('change',() => {history.replaceState(null,'',order.value==='sku'?'?order=sku':location.pathname); render();});
  document.querySelector('#reset').addEventListener('click',()=>{search.value='';category.value='';order.value='category';history.replaceState(null,'',location.pathname);render();});
  quick.hidden = true;
  originalSections.forEach(section => { section.hidden = true; });
  window.addEventListener('hashchange', () => { if (location.hash) location.reload(); });
  render();
})();
