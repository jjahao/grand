/* ============================================================
   GRAND 天倉 — Shop2000 前台轉換型皮膚
   由 google_ana.aspx 注入一行 <script src> 載入。
   改版只需編輯本檔 + git push，1~2 分鐘自動生效。
   設計目標：安心信任 + 購買慾望 + 連續導購不猶豫。
   原則：不刪除 #div_login（保留管理員登入）。
   ============================================================ */
(function () {
  'use strict';
  if (location.pathname.indexOf('/shop2000_prog') === 0) return; // 後台不套

  var STORE = 'https://jjahao.github.io/grand/';
  var LINE = 'https://line.me/ti/p/~@562spzag';
  var QR_LINE = 'https://img2.shop2000.com.tw/75210/self/j20251111100158_o.jpg';
  var QR_WECHAT = 'https://img2.shop2000.com.tw/75210/self/j20230428133953_o.jpg';

  function isHome() {
    var p = location.pathname.replace(/\/+$/, '');
    return p === '' || /\/(index|default)(\.\w+)?$/i.test(p);
  }

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
      /* ---- 配色變數（色彩心理：暖白安心 + 橙紅催單 + 綠色信任） ---- */
      ':root{--bg:#FBF6F0;--ink:#241A12;--ink2:#7A6B5D;--buy:#F4511E;--buy2:#FF7A45;--line:#06C755;--gold:#C99A3B;--card:#fff;--hair:#EFE5D9}',
      /* ---- 全站基底 ---- */
      'body,td,th,select,input,textarea,button,a{font-family:-apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif!important}',
      'body{background:var(--bg)!important;color:var(--ink)!important}',
      'html{-webkit-text-size-adjust:100%}',
      '#main_width{max-width:1000px!important;margin:0 auto!important;background:var(--bg)!important}',
      '.left_td{display:none!important}',
      '.right_td{width:100%!important;padding:0!important}',
      '#main_width img,#main_width video,#main_width iframe{max-width:100%!important;height:auto}',
      'img[src*="/banner.jpg"]{display:none!important}',
      '#main_width img[src*="/pattern/207097/"]{display:none!important}',
      /* 全站 QR 統一縮小尺寸（非首頁內頁也適用） */
      '#main_width img[src*="/self/"]{width:128px!important;height:128px!important;object-fit:contain;border:1px solid var(--hair);border-radius:10px;background:#fff;padding:4px}',
      '@media(max-width:1000px){#main_width,.right_td{max-width:100%!important;width:100%!important}}',

      /* ============ 首頁 LANDING ============ */
      '#grand-landing{max-width:760px;margin:0 auto;padding:0 0 96px}',
      '#grand-landing *{box-sizing:border-box}',
      '.gl-sec{padding:30px 18px}',
      '.gl-h2{font-size:20px;font-weight:900;text-align:center;margin:0 0 4px;letter-spacing:-.3px}',
      '.gl-h2 small{display:block;font-size:12px;font-weight:600;color:var(--gold);letter-spacing:2px;margin-bottom:8px}',
      /* HERO */
      '#gl-hero{background:linear-gradient(160deg,#2A1A11 0%,#43271A 60%,#5A3220 100%);color:#fff;text-align:center;padding:40px 22px 34px}',
      '#gl-hero .eye{font-size:12px;letter-spacing:3px;color:var(--gold);font-weight:700;margin:0 0 10px}',
      '#gl-hero h1{font-size:34px;font-weight:900;letter-spacing:-1px;margin:0 0 8px}',
      '#gl-hero .sub{font-size:14px;color:#E9DCCF;margin:0 0 22px;line-height:1.6}',
      /* 按鈕 */
      '.gl-cta{display:flex;align-items:center;justify-content:center;gap:8px;border-radius:32px;padding:16px 24px;font-size:16px;font-weight:900;text-decoration:none;line-height:1;border:0;cursor:pointer;width:100%;max-width:340px;margin:0 auto}',
      '.gl-buy{background:linear-gradient(135deg,var(--buy),var(--buy2));color:#fff!important;box-shadow:0 8px 22px rgba(244,81,30,.4)}',
      '.gl-buy:active{transform:scale(.98)}',
      '.gl-lineb{background:var(--line);color:#fff!important;box-shadow:0 6px 16px rgba(6,199,85,.32)}',
      '.gl-ghost{background:transparent;color:#fff!important;border:1.5px solid rgba(255,255,255,.5)}',
      '.gl-btns{display:flex;flex-direction:column;gap:10px;align-items:center}',
      /* 信任徽章 */
      '#gl-trust{background:#fff;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}',
      '.gl-badges{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;max-width:520px;margin:0 auto}',
      '.gl-badge{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:700;color:var(--ink)}',
      '.gl-badge .ic{font-size:20px;flex:0 0 auto}',
      /* 價值卡 */
      '.gl-cards{display:grid;gap:12px;max-width:560px;margin:14px auto 0}',
      '.gl-card{background:#fff;border:1px solid var(--hair);border-radius:14px;padding:16px 16px;display:flex;gap:13px;align-items:flex-start}',
      '.gl-card .ic{font-size:26px;flex:0 0 auto;line-height:1}',
      '.gl-card .tt{font-size:15px;font-weight:900;margin:0 0 3px}',
      '.gl-card .ds{font-size:13px;color:var(--ink2);line-height:1.55;margin:0}',
      /* 橙色 CTA 帶 */
      '#gl-band{background:linear-gradient(135deg,var(--buy),var(--buy2));color:#fff;text-align:center;padding:34px 22px}',
      '#gl-band .bt{font-size:19px;font-weight:900;margin:0 0 16px;line-height:1.4}',
      '#gl-band .gl-cta{background:#fff;color:var(--buy)!important;box-shadow:0 8px 22px rgba(0,0,0,.18)}',
      /* LINE / QR */
      '#gl-line{background:#0B3D26;color:#fff;text-align:center}',
      '#gl-line .gl-h2{color:#fff}',
      '#gl-line .gl-h2 small{color:#8FE9B6}',
      '#gl-line .desc{font-size:13px;color:#CdeBD7;margin:0 0 18px}',
      '.gl-qrs{display:flex;gap:18px;justify-content:center;margin:18px 0 0;flex-wrap:wrap}',
      '.gl-qr{background:#fff;border-radius:12px;padding:8px;width:140px}',
      '.gl-qr img{width:124px;height:124px;object-fit:contain;display:block;border-radius:6px}',
      '.gl-qr .lb{font-size:12px;font-weight:700;color:var(--ink);margin-top:7px;line-height:1.3}',
      '.gl-qr .lb b{color:var(--line)}',
      /* 資訊頁尾 */
      '#gl-info{text-align:center;color:var(--ink2);font-size:13px;line-height:1.9}',
      '#gl-info .row{margin:2px 0}',
      '#gl-info b{color:var(--ink)}',
      /* 底部常駐購買 bar */
      '#grand-fab{position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:9000;background:linear-gradient(135deg,var(--buy),var(--buy2));color:#fff!important;font-size:16px;font-weight:900;text-decoration:none;padding:15px 34px;border-radius:32px;box-shadow:0 8px 24px rgba(244,81,30,.5);display:flex;align-items:center;gap:9px;white-space:nowrap}',
      '#grand-fab:active{transform:translateX(-50%) scale(.97)}',
      /* 隱密管理入口 */
      '#grand-admin{position:fixed;left:6px;bottom:8px;z-index:60;font-size:11px;color:#c4c4c4;opacity:.55;cursor:pointer;padding:5px 8px;-webkit-user-select:none;user-select:none}',
      '#grand-admin:hover{opacity:1;color:#888}',
      '#grand-login-wrap{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:20px}',
      '#grand-login-wrap.hide{display:none!important}',
      '#grand-login-wrap #div_login{display:block!important;position:relative;z-index:9999;margin:0!important}'
    ].join('');
    (document.head || document.documentElement).appendChild(css);
  }

  function landingHTML() {
    return '' +
    '<section id="gl-hero">' +
      '<p class="eye">日本直送 ・ 正品保證</p>' +
      '<h1>GRAND 天倉</h1>' +
      '<p class="sub">日本各大批店精選零食<br>每日上新 ・ 原裝直送台灣到府</p>' +
      '<div class="gl-btns">' +
        '<a class="gl-cta gl-buy" href="' + STORE + '">🛒 立即逛商品（146 件）</a>' +
        '<a class="gl-cta gl-ghost" href="' + LINE + '" target="_blank" rel="noopener">加 LINE 看新貨</a>' +
      '</div>' +
    '</section>' +

    '<section id="gl-trust" class="gl-sec">' +
      '<div class="gl-badges">' +
        '<div class="gl-badge"><span class="ic">🏬</span>實體天倉・天天收發</div>' +
        '<div class="gl-badge"><span class="ic">🗾</span>日本正品・批店直送</div>' +
        '<div class="gl-badge"><span class="ic">💴</span>MDM 進價・透明公開</div>' +
        '<div class="gl-badge"><span class="ic">💬</span>LINE 專人・快速回覆</div>' +
      '</div>' +
    '</section>' +

    '<section class="gl-sec">' +
      '<h2 class="gl-h2"><small>WHY GRAND</small>為什麼選 GRAND</h2>' +
      '<div class="gl-cards">' +
        '<div class="gl-card"><span class="ic">🆕</span><div><p class="tt">每日上新</p><p class="ds">統整日本最夯零食，第一手看到貨、不錯過。</p></div></div>' +
        '<div class="gl-card"><span class="ic">🤝</span><div><p class="tt">代提代付</p><p class="ds">免費代提貨、代付款，您只要挑、其餘交給我們。</p></div></div>' +
        '<div class="gl-card"><span class="ic">📦</span><div><p class="tt">直送到府</p><p class="ds">日本天倉直送台灣，送到您指定的地址。</p></div></div>' +
      '</div>' +
    '</section>' +

    '<section id="gl-band">' +
      '<p class="bt">146 件日本精選零食<br>手刀下單，挑到停不下來 🤤</p>' +
      '<a class="gl-cta" href="' + STORE + '">🛒 現在就逛 →</a>' +
    '</section>' +

    '<section id="gl-line" class="gl-sec">' +
      '<h2 class="gl-h2"><small>STAY CONNECTED</small>加 LINE・第一手看新品</h2>' +
      '<p class="desc">新品到貨第一時間通知，也能直接在 LINE 下單詢問。</p>' +
      '<div class="gl-btns"><a class="gl-cta gl-lineb" href="' + LINE + '" target="_blank" rel="noopener">➕ 加入 LINE 好友</a></div>' +
      '<div class="gl-qrs">' +
        '<div class="gl-qr"><img src="' + QR_LINE + '" alt="LINE QR"><div class="lb"><b>LINE</b><br>@562spzag</div></div>' +
        '<div class="gl-qr"><img src="' + QR_WECHAT + '" alt="WeChat QR"><div class="lb">微信<br>james3338</div></div>' +
      '</div>' +
    '</section>' +

    '<section id="gl-info" class="gl-sec">' +
      '<div class="row"><b>營業時間</b>　週一～週五 09:00–18:00（六日及例假休）</div>' +
      '<div class="row">回訊息時間　每天 12:00–22:00</div>' +
      '<div class="row"><b>日本天倉</b>　東京都千代田区岩本町 2-1-8 NAビル1階</div>' +
    '</section>';
  }

  function buildLanding() {
    var mw = document.getElementById('main_width');
    if (!mw || document.getElementById('grand-landing')) return;
    mw.style.setProperty('display', 'none', 'important'); // 隱藏原本雜亂內容（保留在 DOM，#div_login 仍可被搬出登入）
    var wrap = document.createElement('div');
    wrap.id = 'grand-landing';
    wrap.innerHTML = landingHTML();
    mw.parentNode.insertBefore(wrap, mw);
  }

  function buildFab() {
    if (document.getElementById('grand-fab')) return;
    var fab = document.createElement('a');
    fab.id = 'grand-fab';
    fab.href = STORE;
    fab.innerHTML = '🛒 立即逛商品';
    document.body.appendChild(fab);
  }

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
    wrap.appendChild(d);
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

  function run() {
    ensureViewport();
    injectCSS();
    if (isHome()) buildLanding();
    buildFab();
    buildAdminEntry();
    fixCart();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
