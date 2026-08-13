(() => {
  'use strict';
  // 正式串接時由商品頁 DOM 收集所有原圖網址；測試商品目前實查只有一張。
  const images = ['https://img2.shop2000.com.tw/75210/p596/61142954-1o.jpg'];
  const modal = document.getElementById('detailModal');
  const mainImage = document.getElementById('mainImage');
  const imageCount = document.getElementById('imageCount');
  const thumbs = document.getElementById('thumbs');
  const prev = document.getElementById('prevImage');
  const next = document.getElementById('nextImage');
  const favoriteButtons = [document.querySelector('.favorite-card'), document.getElementById('favoriteDetail')];
  const toast = document.getElementById('toast');
  let index = 0;
  let favorite = false;
  let touchStartX = 0;

  function drawGallery() {
    mainImage.src = images[index];
    mainImage.alt = `紐約完美起司商品照片 ${index + 1}`;
    imageCount.textContent = `${index + 1} / ${images.length}`;
    prev.disabled = images.length < 2;
    next.disabled = images.length < 2;
    [...thumbs.children].forEach((el, i) => el.classList.toggle('active', i === index));
  }

  images.forEach((src, i) => {
    const button = document.createElement('button');
    button.className = 'thumb';
    button.type = 'button';
    button.setAttribute('aria-label', `查看第 ${i + 1} 張照片`);
    button.innerHTML = `<img src="${src}" alt="">`;
    button.addEventListener('click', () => { index = i; drawGallery(); });
    thumbs.appendChild(button);
  });

  function openModal() {
    index = 0;
    drawGallery();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.close').focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-detail').forEach(el => el.addEventListener('click', openModal));
  document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  prev.addEventListener('click', () => { index = (index - 1 + images.length) % images.length; drawGallery(); });
  next.addEventListener('click', () => { index = (index + 1) % images.length; drawGallery(); });
  mainImage.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  mainImage.addEventListener('touchend', event => {
    if (images.length < 2) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 45) return;
    (distance < 0 ? next : prev).click();
  }, { passive: true });

  favoriteButtons.forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    favorite = !favorite;
    favoriteButtons.forEach(item => {
      item.classList.toggle('on', favorite);
      item.setAttribute('aria-pressed', String(favorite));
      item.querySelector('span') ? item.querySelector('span').textContent = favorite ? '♥' : '♡' : item.textContent = favorite ? '♥' : '♡';
    });
    toast.textContent = favorite ? '已加入收藏' : '已取消收藏';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1200);
  }));

  document.addEventListener('keydown', event => {
    if (modal.hidden) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowLeft' && images.length > 1) prev.click();
    if (event.key === 'ArrowRight' && images.length > 1) next.click();
  });
})();
