document.querySelectorAll('[data-catalog-filters]').forEach(function(group){
  var products=document.querySelectorAll('[data-tags]');
  group.querySelectorAll('[data-filter]').forEach(function(button){
    button.addEventListener('click',function(){
      var filter=button.dataset.filter;
      group.querySelectorAll('[data-filter]').forEach(function(item){
        var active=item===button;
        item.classList.toggle('active',active);
        item.setAttribute('aria-pressed',active?'true':'false');
      });
      products.forEach(function(product){
        var tags=(product.dataset.tags||'').split(' ');
        product.hidden=filter!=='all'&&tags.indexOf(filter)===-1;
      });
    });
  });
});
