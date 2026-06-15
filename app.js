(function () {
  'use strict';

  const grid = document.getElementById('grid');
  const emptyMsg = document.getElementById('emptyMsg');
  const loadingMsg = document.getElementById('loadingMsg');
  const searchInput = document.getElementById('search');
  const catBar = document.getElementById('catBar');
  const lb = document.getElementById('lb');
  const lbBackdrop = document.getElementById('lbBackdrop');
  const lbClose = document.getElementById('lbClose');
  const lbImg = document.getElementById('lbImg');
  const lbCode = document.getElementById('lbCode');
  const lbName = document.getElementById('lbName');
  const lbPrice = document.getElementById('lbPrice');
  const lbDesc = document.getElementById('lbDesc');
  const lbBuyBtn = document.getElementById('lbBuyBtn');
  const toastEl = document.getElementById('toast');

  let products = window.PRODUCTS || [];
  let activeCat = 'all';
  let query = '';

  // ── Build category tabs ──
  function buildCats() {
    const cats = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
    catBar.innerHTML = '';
    cats.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'cat-btn' + (cat === activeCat ? ' active' : '');
      btn.dataset.cat = cat;
      btn.textContent = cat === 'all' ? '全部' : cat;
      btn.addEventListener('click', () => {
        activeCat = cat;
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        render();
      });
      catBar.appendChild(btn);
    });
  }

  // ── Render grid ──
  function render() {
    const q = query.toLowerCase();
    const filtered = products.filter(p => {
      const matchCat = activeCat === 'all' || p.category === activeCat;
      const matchQ = !q || p.name.toLowerCase().includes(q) || (p.code || '').toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    grid.innerHTML = '';
    emptyMsg.hidden = filtered.length > 0;

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-img">
          ${p.img
            ? `<img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">`
            : `<div class="noimg">暫無圖片</div>`}
        </div>
        <div class="card-body">
          <div class="card-name">${esc(p.name)}</div>
          <div class="card-code">${esc(p.code || '')}</div>
          <div class="card-price">NT$${p.price}<small> 起</small></div>
          <button class="card-cta">查看詳情</button>
        </div>
      `;
      card.addEventListener('click', () => openLb(p));
      card.querySelector('.card-cta').addEventListener('click', e => { e.stopPropagation(); openLb(p); });
      grid.appendChild(card);
    });
  }

  // ── Lightbox ──
  function openLb(p) {
    lbImg.src = p.img || '';
    lbImg.style.display = p.img ? 'block' : 'none';
    lbCode.textContent = p.code || '';
    lbName.textContent = p.name;
    lbPrice.textContent = `NT$${p.price}`;
    lbDesc.textContent = p.desc || '';
    lbBuyBtn.href = p.shop2000_url || 'https://grand.shop2000.com.tw/';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', closeLb);
  lbBackdrop.addEventListener('click', closeLb);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  // ── Search ──
  searchInput.addEventListener('input', () => {
    query = searchInput.value.trim();
    render();
  });

  // ── Toast ──
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  // ── Init ──
  function init() {
    loadingMsg.hidden = true;
    if (!products.length) {
      emptyMsg.hidden = false;
      return;
    }
    buildCats();
    render();
  }

  init();

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
})();
