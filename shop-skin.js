/* GRAND Shop2000 前台皮膚 — 由 google_ana.aspx 注入一行 <script src> 載入。
   日後改版面只需編輯本檔 + git push，1~2 分鐘自動生效，無須再進 Shop2000。
   原則：不碰 #div_login（保留管理員登入小點），只美化前台。 */
(function () {
  'use strict';
  // 後台頁面不套用
  if (location.pathname.indexOf('/shop2000_prog') === 0) return;

  var STORE = 'https://jjahao.github.io/grand/';
  var LINE = 'https://line.me/ti/p/~@562spzag';

  // 全站缺 viewport meta → 手機用桌機寬度排版而溢出。補上讓全站手機自適應（最高槓桿的舒適化）
  function ensureViewport() {
    if (document.querySelector('meta[name=viewport]')) return;
    var mt = document.createElement('meta');
    mt.name = 'viewport';
    mt.content = 'width=device-width, initial-scale=1';
    (document.head || document.documentElement).appendChild(mt);
  }

  function injectCSS() {
    if (document.getElementById('grand-skin-css')) return;
    var css = document.createElement('style');
    css.id = 'grand-skin-css';
    css.textContent = [
      /* 全站字體 + 配色基底 */
      'body,td,th,select,input,textarea,button,a{font-family:-apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif!important}',
      'body{background:#f6f6f6!important;color:#111!important}',
      /* 版心置中 + 收掉左側工具列；不動 #div_login（保留登入） */
      '#main_width{max-width:1000px!important;margin:0 auto!important;background:#fff!important}',
      '.left_td{display:none!important}',
      '.right_td{width:100%!important;padding:0!important}',
      /* 手機防溢出：圖片/影片不超出畫面，整體允許自適應縮放 */
      'html{-webkit-text-size-adjust:100%}',
      '#main_width img,#main_width video,#main_width iframe{max-width:100%!important;height:auto}',
      '@media(max-width:1000px){#main_width,.right_td{max-width:100%!important;width:100%!important}}',
      /* 藏掉雜亂的大 banner 圖與舊圖片導覽列 */
      'img[src*="/banner.jpg"],img[src*="/banner.gif"]{display:none!important}',
      /* GRAND 自訂 hero */
      '#grand-hero{display:block!important;width:100%!important;box-sizing:border-box;background:#111!important;color:#fff!important;text-align:center!important;padding:30px 20px 26px!important;margin:0 0 8px!important;position:relative;z-index:1}',
      '#grand-hero .gh-inner{max-width:760px;margin:0 auto}',
      '#grand-hero .gh-eye{font-size:11px;letter-spacing:3px;color:#9a9a9a;margin:0 0 8px}',
      '#grand-hero .gh-title{font-size:30px;font-weight:900;letter-spacing:-1px;margin:0 0 6px}',
      '#grand-hero .gh-sub{font-size:13px;color:#cfcfcf;margin:0 0 20px;line-height:1.6}',
      '#grand-hero .gh-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}',
      '.gh-cta{display:inline-flex;align-items:center;gap:7px;border-radius:30px;padding:13px 26px;font-size:15px;font-weight:800;text-decoration:none;line-height:1}',
      '.gh-cta-main{background:#06C755;color:#fff!important}',
      '.gh-cta-line{background:#fff;color:#111!important}',
      /* 藏掉舊主題的導覽/裝飾 gif（首頁/加入會員等老式圖片鈕），商品圖不受影響 */
      '#main_width img[src*="/pattern/207097/"]{display:none!important}',
      /* 常駐浮動鈕：手機桌機都看得到 */
      '#grand-fab{position:fixed;left:50%;transform:translateX(-50%);bottom:16px;z-index:9999;background:#06C755;color:#fff!important;font-size:15px;font-weight:800;text-decoration:none;padding:14px 30px;border-radius:30px;box-shadow:0 6px 20px rgba(0,0,0,.28);display:flex;align-items:center;gap:8px}',
      '#grand-fab:active{transform:translateX(-50%) scale(.97)}',
      /* 隱密管理入口（左下角，淡灰，客人不會注意；老闆找得到） */
      '#grand-admin{position:fixed;left:6px;bottom:8px;z-index:60;font-size:11px;color:#c4c4c4;opacity:.6;cursor:pointer;padding:5px 8px;-webkit-user-select:none;user-select:none}',
      '#grand-admin:hover{opacity:1;color:#888}',
      /* 管理登入彈窗：把藏在 .left_td 裡的 #div_login 搬出來置中顯示 */
      '#grand-login-wrap{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:20px}',
      '#grand-login-wrap.hide{display:none!important}',
      '#grand-login-wrap #div_login{display:block!important;position:relative;z-index:9999;margin:0!important}'
    ].join('');
    (document.head || document.documentElement).appendChild(css);
  }

  function buildHero() {
    var mw = document.getElementById('main_width');
    if (!mw || document.getElementById('grand-hero')) return;
    var hero = document.createElement('div');
    hero.id = 'grand-hero';
    hero.innerHTML =
      '<div class="gh-inner">' +
      '<p class="gh-eye">日本直送・專業集運代購</p>' +
      '<h1 class="gh-title">GRAND 天倉</h1>' +
      '<p class="gh-sub">日本各大批店精選商品・MDM 進價・一站式跨境代付代購</p>' +
      '<div class="gh-btns">' +
        '<a class="gh-cta gh-cta-main" href="' + STORE + '">🛍 進入商品目錄（146 件）→</a>' +
        '<a class="gh-cta gh-cta-line" href="' + LINE + '" target="_blank" rel="noopener">LINE 詢問</a>' +
      '</div>' +
      '</div>';
    // 插在 #main_width 外面（前一個兄弟），避免被 Shop2000 的 table 版型擠壓
    mw.parentNode.insertBefore(hero, mw);
  }

  function buildFab() {
    if (document.getElementById('grand-fab')) return;
    var fab = document.createElement('a');
    fab.id = 'grand-fab';
    fab.href = STORE;
    fab.innerHTML = '🛍 看全部商品';
    document.body.appendChild(fab);
  }

  // 隱密管理入口：登入框 #div_login 原本被藏在 display:none 的 .left_td 裡，
  // 點「・管理」時把它搬到彈窗、強制顯示，老闆輸入密碼即可登入後台。
  function openAdmin() {
    var d = document.getElementById('div_login');
    if (!d) { alert('找不到登入框，請重新整理頁面'); return; }
    var wrap = document.getElementById('grand-login-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'grand-login-wrap';
      document.body.appendChild(wrap);
      wrap.addEventListener('click', function (e) { if (e.target === wrap) wrap.classList.add('hide'); });
    }
    wrap.classList.remove('hide');
    wrap.appendChild(d);                       // 搬出隱藏的 .left_td
    d.style.setProperty('display', 'block', 'important');
    var pw = d.querySelector('#pwboss');
    if (pw) setTimeout(function () { try { pw.focus(); } catch (e) {} }, 60);
  }

  function buildAdminEntry() {
    if (document.getElementById('grand-admin')) return;
    var a = document.createElement('div');
    a.id = 'grand-admin';
    a.textContent = '・管理';
    a.title = '網站管理登入';
    a.addEventListener('click', openAdmin);
    document.body.appendChild(a);
  }

  // 把 Shop2000 的浮動購物車(position:fixed, 內含「結帳」)移到右上角，避免壓住 hero 的 CTA
  function fixCart() {
    var nodes = document.querySelectorAll('div,span,a');
    for (var i = 0; i < nodes.length; i++) {
      var e = nodes[i];
      if (getComputedStyle(e).position === 'fixed' && /結帳/.test(e.textContent || '') && e.offsetHeight < 130) {
        e.style.setProperty('top', '6px', 'important');
        e.style.setProperty('right', '8px', 'important');
        e.style.setProperty('z-index', '50', 'important');
        break;
      }
    }
  }

  // 移除藏 banner 後殘留的空白小 logo 圖（pattern 目錄下的裝飾 gif）
  function cleanArtifacts() {
    var imgs = document.querySelectorAll('#main_width img[src*="/pattern/"]');
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].offsetHeight < 50 && imgs[i].offsetWidth < 90) imgs[i].style.display = 'none';
    }
  }

  // 是否首頁（hero 只在首頁顯示，內頁如會員/購物車/結帳不放 hero）
  function isHome() {
    var p = location.pathname.replace(/\/+$/, '');
    return p === '' || /\/(index|default)(\.\w+)?$/i.test(p);
  }

  function run() {
    ensureViewport();
    injectCSS();
    if (isHome()) buildHero();
    buildFab();
    buildAdminEntry();
    fixCart();
    cleanArtifacts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
