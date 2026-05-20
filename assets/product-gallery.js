(function(){
  var galleries = document.querySelectorAll('.product-gallery');
  if (!galleries.length) return;

  var lightbox = document.createElement('div');
  lightbox.className = 'product-lightbox';
  lightbox.hidden = true;
  lightbox.innerHTML = '<button class="product-lightbox-close" type="button" aria-label="Закрыть изображение">&times;</button><img alt="">';
  document.body.appendChild(lightbox);

  var lightboxImage = lightbox.querySelector('img');
  var closeButton = lightbox.querySelector('button');

  function openLightbox(src, alt){
    lightboxImage.src = src;
    lightboxImage.alt = alt || '';
    lightbox.hidden = false;
    document.body.classList.add('product-lightbox-open');
    closeButton.focus();
  }

  function closeLightbox(){
    lightbox.hidden = true;
    lightboxImage.removeAttribute('src');
    document.body.classList.remove('product-lightbox-open');
  }

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(event){
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function(event){
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  galleries.forEach(function(gallery){
    var mainImage = gallery.querySelector('.product-main-image img');
    var thumbs = gallery.querySelectorAll('.product-gallery-grid img');
    if (!mainImage || !thumbs.length) return;

    mainImage.tabIndex = 0;
    mainImage.setAttribute('role', 'button');
    mainImage.setAttribute('aria-label', 'Открыть изображение крупно');

    function setActive(thumb){
      thumbs.forEach(function(item){
        var figure = item.closest('figure');
        if (figure) figure.classList.toggle('is-active', item === thumb);
      });
    }

    function selectThumb(thumb){
      mainImage.src = thumb.currentSrc || thumb.src;
      mainImage.alt = thumb.alt || mainImage.alt;
      setActive(thumb);
    }

    thumbs.forEach(function(thumb, index){
      var figure = thumb.closest('figure');
      if (figure) {
        figure.tabIndex = 0;
        figure.setAttribute('role', 'button');
        figure.setAttribute('aria-label', thumb.alt || 'Показать фото');
        figure.addEventListener('click', function(){
          selectThumb(thumb);
        });
        figure.addEventListener('keydown', function(event){
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectThumb(thumb);
          }
        });
      }
      if (index === 0) setActive(thumb);
    });

    mainImage.addEventListener('click', function(){
      openLightbox(mainImage.currentSrc || mainImage.src, mainImage.alt);
    });
    mainImage.addEventListener('keydown', function(event){
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(mainImage.currentSrc || mainImage.src, mainImage.alt);
      }
    });
  });
})();
