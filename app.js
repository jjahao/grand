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
  const lbAddBtn = document.getElementById('lbAddBtn');
  const toastEl = document.getElementById('toast');

  // cart elements
  const cartBar = document.getElementById('cartBar');
  const cartBarText = document.getElementById('cartBarText');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartClose = document.getElementById('cartClose');
  const cartItems = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartTotal = document.getElementById('cartTotal');
  const cartLineBtn = document.getElementById('cartLineBtn');

  const LINE_URL = 'https://line.me/ti/p/~@562spzag';
  const products = window.PRODUCTS || [];
  let activeCat = 'all';
  let query = '';
  let current = null; // product open in lightbox

  // ── Cart state (localStorage) ──
  const CART_KEY = 'grand_cart_v1';
  let cart = loadCart();

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function cartCount() {
    return Object.values(cart).reduce((s, it) => s + it.qty, 0);
  }
  function cartSum() {
    return Object.values(cart).reduce((s, it) => s + it.qty * (Number(it.price) || 0), 0);
  }
  function addToCart(p) {
    const k = p.id || p.code || p.name;
    if (cart[k]) cart[k].qty += 1;
    else cart[k] = { id: k, name: p.name, code: p.code || '', price: Number(p.price) || 0, img: p.img || '', qty: 1 };
    saveCart();
    syncCartBar();
    showToast('已加入購物車 🛒 共 ' + cartCount() + ' 件');
  }
  function setQty(k, delta) {
    if (!cart[k]) return;
    cart[k].qty += delta;
    if (cart[k].qty <= 0) delete cart[k];
    saveCart();
    syncCartBar();
    renderCart();
  }

  function syncCartBar() {
    const n = cartCount();
    if (n > 0) {
      cartBar.hidden = false;
      cartBarText.textContent = n + ' 件 ・ NT$' + cartSum().toLocaleString();
    } else {
      cartBar.hidden = true;
    }
  }

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
          <button class="card-cta" type="button">🛒 加入購物車</button>
        </div>
      `;
      card.querySelector('.card-img').addEventListener('click', () => openLb(p));
      card.querySelector('.card-name').addEventListener('click', () => openLb(p));
      card.querySelector('.card-cta').addEventListener('click', e => { e.stopPropagation(); addToCart(p); });
      grid.appendChild(card);
    });
  }

  // ── Lightbox ──
  function openLb(p) {
    current = p;
    lbImg.src = p.img || '';
    lbImg.style.display = p.img ? 'block' : 'none';
    lbCode.textContent = p.code || '';
    lbName.textContent = p.name;
    lbPrice.textContent = `NT$${p.price}`;
    lbDesc.textContent = p.desc || '';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = '';
  }
  lbClose.addEventListener('click', closeLb);
  lbBackdrop.addEventListener('click', closeLb);
  lbAddBtn.addEventListener('click', () => { if (current) { addToCart(current); closeLb(); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLb(); closeCart(); } });

  // ── Cart drawer ──
  function openCart() {
    renderCart();
    cartDrawer.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartDrawer.hidden = true;
    document.body.style.overflow = '';
  }
  function renderCart() {
    const items = Object.values(cart);
    cartEmpty.hidden = items.length > 0;
    cartItems.innerHTML = '';
    items.forEach(it => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="ci-img">${it.img ? `<img src="${esc(it.img)}" alt="">` : ''}</div>
        <div class="ci-info">
          <div class="ci-name">${esc(it.name)}</div>
          <div class="ci-price">NT$${it.price}</div>
        </div>
        <div class="ci-qty">
          <button class="ci-btn" data-act="dec" type="button">−</button>
          <span class="ci-n">${it.qty}</span>
          <button class="ci-btn" data-act="inc" type="button">＋</button>
        </div>`;
      row.querySelector('[data-act=dec]').addEventListener('click', () => setQty(it.id, -1));
      row.querySelector('[data-act=inc]').addEventListener('click', () => setQty(it.id, +1));
      cartItems.appendChild(row);
    });
    cartTotal.textContent = 'NT$' + cartSum().toLocaleString();
  }

  // ── LINE order: copy summary + open LINE ──
  function orderText() {
    const items = Object.values(cart);
    let t = '【GRAND 訂購單】\n';
    items.forEach((it, i) => {
      t += `${i + 1}. ${it.name}`;
      if (it.code) t += `（${it.code}）`;
      t += ` x${it.qty} = NT$${it.qty * it.price}\n`;
    });
    t += `合計：NT$${cartSum().toLocaleString()}\n— 請協助確認與報價，謝謝！`;
    return t;
  }
  cartLineBtn.addEventListener('click', () => {
    if (cartCount() === 0) { showToast('購物車是空的'); return; }
    const txt = orderText();
    const done = () => {
      showToast('訂單已複製！貼到 LINE 送出即可 📩');
      setTimeout(() => window.open(LINE_URL, '_blank', 'noopener'), 700);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, done);
    } else {
      const ta = document.createElement('textarea');
      ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      ta.remove(); done();
    }
  });

  cartBar.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartBackdrop.addEventListener('click', closeCart);

  // ── Search ──
  searchInput.addEventListener('input', () => { query = searchInput.value.trim(); render(); });

  // ── Toast ──
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  // ── Init ──
  function init() {
    loadingMsg.hidden = true;
    if (!products.length) { emptyMsg.hidden = false; return; }
    buildCats();
    render();
    syncCartBar();
  }
  init();

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
