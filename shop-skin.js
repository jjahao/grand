/* ============================================================
   GRAND 天倉 — Shop2000 前台轉換型皮膚
   由 google_ana.aspx 注入一行 <script src> 載入。
   改版只需編輯本檔 + git push，1~2 分鐘自動生效。
   設計目標：安心信任 + 購買慾望 + 喜悅好逛 + 連續導購不猶豫。
   原則：不刪除 #div_login（保留管理員登入）。
   ============================================================ */
(function () {
  'use strict';
  // 後台大多不套用皮膚，但允許 mem_login_pop.aspx 執行（用來處理登入後的 top-level 導向）
  if (location.pathname.indexOf('/shop2000_prog') === 0 && location.pathname.indexOf('/shop2000_prog/member/mem_login_pop.aspx') !== 0) return; // 後台不套

  var STORE = 'https://jjahao.github.io/grand/';
  var LINE = 'https://line.me/ti/p/~@562spzag';
  var MEMBER = 'https://grand.shop2000.com.tw/member'; // 會員中心
  var ORDER = 'https://grand.shop2000.com.tw/member/my_order'; // 訂單歷史
  var LOGIN = 'https://grand.shop2000.com.tw/shop2000_prog/member/mem_login_pop.aspx?vdir='; // 會員登入頁

  /* === mem_login_pop.aspx 專用：若在登入彈窗/iframe 偵測到已登入，強制 top 導向我的訂單，
     用來打斷登入後被導回首頁的死循環。此段只在 mem_login_pop.aspx 執行。 === */
  if (location.pathname.indexOf('/shop2000_prog/member/mem_login_pop.aspx') === 0) {
    (function(){
      function tryRedirectParent(){
        try{
          var t = document.body && document.body.innerText || '';
          if (/登入成功|歡迎|已登入|登出|會員/.test(t)){
            try{ top.location.href = '/member/my_order'; }catch(e){}
          }
        }catch(e){}
      }
      var obs = new MutationObserver(tryRedirectParent);
      try{ obs.observe(document.body || document.documentElement, {childList:true, subtree:true}); }catch(e){}
      setInterval(tryRedirectParent, 1000);
      // 立即嘗試一次
      setTimeout(tryRedirectParent, 300);
    })();
  }

  // 從目錄帶 ?gm=join/login 過來 → 在 Shop2000 網域內同站轉址到會員頁，
  // 避免「跨站(jjahao→shop2000)註冊/登入後又被導回靜態目錄」造成 405。
  (function () {
    var gm = (location.search.match(/[?&]gm=(join|login|center)/) || [])[1];
    if (gm) {
      // 先把網址的 ?gm 清掉，否則登入頁的 http_ref(=來源頁) 會帶 ?gm，
      // 登入完跳回 ?gm 又被轉去登入 → 死循環(看似「登入後不動」)。
      try { history.replaceState(null, '', '/'); } catch (e) {}
      location.replace(gm === 'login' ? LOGIN : MEMBER);
    }
  })();
  var QR_LINE = 'https://img2.shop2000.com.tw/75210/self/j20251111100158_o.jpg';
  var QR_WECHAT = 'https://img2.shop2000.com.tw/75210/self/j20230428133953_o.jpg';

  /* 精品分類 showcase 版位（先用精緻漸層底圖佔位；日後把 img 換成真照片即可）
     要換真照片：把該分類的 img 設成你的圖片網址（建議放 jjahao.github.io/grand/showcase/xxx.jpg）。 */
  var SHOW = 'https://jjahao.github.io/grand/showcase/';
  var CATS = [
    { name: '日本百貨禮品', en: 'DEPARTMENT GIFTS', ic: '🎁', img: SHOW + 'gift.jpg', g: 'linear-gradient(150deg,#5A1F2B,#8E3247)' },
    { name: 'MDM 直購', en: 'MDM DIRECT', ic: '🛍️', img: SHOW + 'shopping.jpg', g: 'linear-gradient(150deg,#3A2415,#6B4423)' },
    { name: '好市多代購', en: 'COSTCO', ic: '📦', img: SHOW + 'costco.jpg', g: 'linear-gradient(150deg,#123A2E,#1E6B52)' },
    { name: '名牌精品', en: 'LUXURY', ic: '👜', img: SHOW + 'luxury.jpg', g: 'linear-gradient(150deg,#1A1A1F,#3A3A45)' },
    { name: '美妝藥妝', en: 'BEAUTY', ic: '💄', img: SHOW + 'beauty.jpg', g: 'linear-gradient(150deg,#5A2540,#9E4470)' },
    { name: '零食爆品', en: 'SNACKS', ic: '🍫', img: SHOW + 'snacks.jpg', g: 'linear-gradient(150deg,#6B3410,#C25E1E)' }
  ];

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
      /* ---- 配色（暖白安心底 + 珊瑚橙催單 + 綠信任 + 金精緻；更亮更喜悅） ---- */
      ':root{--bg:#FFF7EF;--ink:#2B201A;--ink2:#8A7A6C;--buy:#FF5B2E;--buy2:#FF8A5B;--line:#06C755;--gold:#CDA349;--card:#fff;--hair:#F1E7D9;--wine:#2E1C24}',
      'body,td,th,select,input,textarea,button,a{font-family:-apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif!important}',
      'body{background:var(--bg)!important;color:var(--ink)!important}',
      'html{-webkit-text-size-adjust:100%}',
      '#main_width{max-width:1000px!important;margin:0 auto!important;background:var(--bg)!important}',
      '.left_td{display:none!important}',
      '.right_td{width:100%!important;padding:0!important}',
      '#main_width img,#main_width video,#main_width iframe{max-width:100%!important;height:auto}',
      'img[src*="/banner.jpg"]{display:none!important}',
      '#main_width img[src*="/pattern/207097/"]{display:none!important}',
      '#main_width img[src*="/self/"]{width:128px!important;height:128px!important;object-fit:contain;border:1px solid var(--hair);border-radius:10px;background:#fff;padding:4px}',
      '@media(max-width:1000px){#main_width,.right_td{max-width:100%!important;width:100%!important}}',

      /* ============ 首頁 LANDING ============ */
      '#grand-landing{max-width:780px;margin:0 auto;padding:0 0 100px}',
      '#grand-landing *{box-sizing:border-box}',
      '.gl-sec{padding:30px 18px}',
      '.gl-h2{font-size:20px;font-weight:900;text-align:center;margin:0 0 4px;letter-spacing:-.3px}',
      '.gl-h2 small{display:block;font-size:11px;font-weight:700;color:var(--gold);letter-spacing:2.5px;margin-bottom:8px}',
      /* HERO（精緻暖酒紅，名牌感 + 溫暖） */
      '#gl-hero{background:radial-gradient(120% 90% at 50% 0%,rgba(205,163,73,.22),transparent 55%),linear-gradient(160deg,var(--wine) 0%,#4A2A22 55%,#6B3A28 100%);color:#fff;text-align:center;padding:40px 22px 32px}',
      '#gl-hero .eye{font-size:12px;letter-spacing:3px;color:var(--gold);font-weight:700;margin:0 0 10px}',
      '#gl-hero h1{font-size:33px;font-weight:900;letter-spacing:-1px;margin:0 0 8px}',
      '#gl-hero .sub{font-size:14px;color:#EDE0D2;margin:0 0 22px;line-height:1.6}',
      '.gh-member{display:flex;gap:9px;justify-content:center;margin:14px auto 0;max-width:340px}',
      '.ghm{flex:1;text-align:center;padding:11px 8px;border-radius:24px;font-size:14px;font-weight:800;text-decoration:none}',
      '.ghm-join{background:#fff;color:var(--wine)!important}',
      '.ghm-login{background:transparent;color:#fff!important;border:1.5px solid rgba(255,255,255,.55)}',
      '.gh-center{display:block;max-width:340px;margin:9px auto 0;text-align:center;padding:10px;border-radius:24px;font-size:13px;font-weight:800;text-decoration:none;background:rgba(205,163,73,.18);color:var(--gold)!important;border:1px solid rgba(205,163,73,.5)}',
      '.gl-cta{display:flex;align-items:center;justify-content:center;gap:8px;border-radius:34px;padding:16px 24px;font-size:16px;font-weight:900;text-decoration:none;line-height:1;border:0;cursor:pointer;width:100%;max-width:340px;margin:0 auto}',
      '.gl-buy{background:linear-gradient(135deg,var(--buy),var(--buy2));color:#fff!important;box-shadow:0 8px 22px rgba(255,91,46,.42)}',
      '.gl-buy:active{transform:scale(.98)}',
      '.gl-lineb{background:var(--line);color:#fff!important;box-shadow:0 6px 16px rgba(6,199,85,.32)}',
      '.gl-ghost{background:transparent;color:#fff!important;border:1.5px solid rgba(255,255,255,.55)}',
      '.gl-btns{display:flex;flex-direction:column;gap:10px;align-items:center}',
      /* 精品分類 showcase */
      '#gl-show{padding:22px 14px 8px}',
      '.gl-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:11px;max-width:700px;margin:0 auto}',
      '@media(min-width:620px){.gl-grid{grid-template-columns:repeat(3,1fr)}}',
      '.gl-tile{position:relative;aspect-ratio:4/3;border-radius:16px;overflow:hidden;text-decoration:none;display:block;box-shadow:0 4px 14px rgba(80,40,20,.12)}',
      '.gl-tile .bg{position:absolute;inset:0;background-size:cover;background-position:center}',
      '.gl-tile .ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.5))}',
      '.gl-tile .tx{position:absolute;left:0;right:0;bottom:0;padding:12px 13px;color:#fff;text-align:left}',
      '.gl-tile .ic{font-size:24px;line-height:1}',
      '.gl-tile .nm{font-size:15px;font-weight:900;margin-top:3px;text-shadow:0 1px 3px rgba(0,0,0,.4)}',
      '.gl-tile .en{font-size:9px;letter-spacing:1.5px;color:var(--gold);font-weight:700}',
      '.gl-tile .go{position:absolute;top:10px;right:10px;background:rgba(255,255,255,.92);color:var(--ink);font-size:10px;font-weight:800;padding:4px 9px;border-radius:20px}',
      '.gl-tile:active{transform:scale(.985)}',
      /* 軟性會員提示帶 */
      '#gl-gate{margin:16px auto 0;max-width:560px;background:#fff;border:1px dashed var(--gold);border-radius:14px;padding:16px 18px;text-align:center}',
      '#gl-gate .gt{font-size:14px;font-weight:800;margin:0 0 4px}',
      '#gl-gate .gd{font-size:12px;color:var(--ink2);margin:0 0 12px}',
      '#gl-gate .gbtns{display:flex;gap:9px;justify-content:center;flex-wrap:wrap}',
      '.gl-mini{font-size:13px;font-weight:800;text-decoration:none;border-radius:24px;padding:10px 18px}',
      '.gl-mini.j{background:var(--ink);color:#fff!important}',
      '.gl-mini.o{background:linear-gradient(135deg,var(--buy),var(--buy2));color:#fff!important}',
      /* 信任徽章 */
      '#gl-trust{background:#fff;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}',
      '.gl-badges{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;max-width:520px;margin:0 auto}',
      '.gl-badge{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:700;color:var(--ink)}',
      '.gl-badge .ic{font-size:20px;flex:0 0 auto}',
      /* 價值卡 */
      '.gl-cards{display:grid;gap:12px;max-width:560px;margin:14px auto 0}',
      '.gl-card{background:#fff;border:1px solid var(--hair);border-radius:14px;padding:16px;display:flex;gap:13px;align-items:flex-start}',
      '.gl-card .ic{font-size:26px;flex:0 0 auto;line-height:1}',
      '.gl-card .tt{font-size:15px;font-weight:900;margin:0 0 3px}',
      '.gl-card .ds{font-size:13px;color:var(--ink2);line-height:1.55;margin:0}',
      /* 橙色 CTA 帶 */
      '#gl-band{background:linear-gradient(135deg,var(--buy),var(--buy2));color:#fff;text-align:center;padding:34px 22px}',
      '#gl-band .bt{font-size:19px;font-weight:900;margin:0 0 16px;line-height:1.4}',
      '#gl-band .gl-cta{background:#fff;color:var(--buy)!important;box-shadow:0 8px 22px rgba(0,0,0,.18)}',
      /* LINE / QR（改淺色清爽，更乾淨亮眼） */
      '#gl-line{background:linear-gradient(180deg,#F1FBF5,#E6F7EC);text-align:center;border-top:1px solid #D6EFDD}',
      '#gl-line .gl-h2{color:var(--ink)}',
      '#gl-line .gl-h2 small{color:var(--line)}',
      '#gl-line .desc{font-size:13px;color:var(--ink2);margin:0 0 18px}',
      '.gl-qrs{display:flex;gap:18px;justify-content:center;margin:18px 0 0;flex-wrap:wrap}',
      '.gl-qr{background:#fff;border-radius:14px;padding:9px;width:140px;box-shadow:0 4px 14px rgba(6,150,70,.12)}',
      '.gl-qr img{width:124px;height:124px;object-fit:contain;display:block;border-radius:6px}',
      '.gl-qr .lb{font-size:12px;font-weight:700;color:var(--ink);margin-top:7px;line-height:1.3}',
      '.gl-qr .lb b{color:var(--line)}',
      /* 資訊頁尾 */
      '#gl-info{text-align:center;color:var(--ink2);font-size:13px;line-height:1.9}',
      '#gl-info .row{margin:2px 0}',
      '#gl-info b{color:var(--ink)}',
      /* 底部常駐購買 bar */
      '#grand-fab{position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:9000;background:linear-gradient(135deg,var(--buy),var(--buy2));color:#fff!important;font-size:16px;font-weight:900;text-decoration:none;padding:15px 34px;border-radius:32px;box-shadow:0 8px 24px rgba(255,91,46,.5);display:flex;align-items:center;gap:9px;white-space:nowrap}',
      '#grand-fab:active{transform:translateX(-50%) scale(.97)}',
      '#grand-member-panel{position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:9001;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;align-items:center;padding:10px 12px;border-radius:999px;background:rgba(255,255,255,.96);border:1px solid rgba(205,163,73,.35);box-shadow:0 18px 38px rgba(66,35,20,.12);max-width:calc(100% - 24px);min-height:52px}@media(max-width:520px){#grand-member-panel{bottom:86px;padding:8px;gap:8px}}',
      '#grand-member-panel a{display:inline-flex;align-items:center;justify-content:center;min-width:120px;padding:12px 16px;border-radius:999px;text-decoration:none;font-weight:800;font-size:13px;line-height:1.2;color:var(--ink);background:#fff;border:1px solid rgba(189,152,104,.35)}',
      '#grand-member-panel a.gm-primary{background:linear-gradient(135deg,var(--buy),var(--buy2));color:#fff!important;border-color:transparent;box-shadow:0 10px 22px rgba(255,91,46,.28)}',
      '#grand-member-panel a.gm-secondary{background:rgba(255,255,255,.96);color:var(--ink)!important}',
      '#grand-member-panel a.gm-secondary:hover{background:rgba(255,242,231,.95)}',
      '#grand-admin{position:fixed;left:6px;bottom:8px;z-index:60;font-size:11px;color:#c4c4c4;opacity:.55;cursor:pointer;padding:5px 8px;-webkit-user-select:none;user-select:none}',
      '#grand-admin{position:fixed;left:6px;bottom:8px;z-index:60;font-size:11px;color:#c4c4c4;opacity:.55;cursor:pointer;padding:5px 8px;-webkit-user-select:none;user-select:none}',
      '#grand-admin:hover{opacity:1;color:#888}',
      '#grand-login-wrap{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:20px}',
      '#grand-login-wrap.hide{display:none!important}',
      '#grand-login-wrap #div_login{display:block!important;position:relative;z-index:9999;margin:0!important}'
    ].join('');
    (document.head || document.documentElement).appendChild(css);
  }

  function tilesHTML() {
    return CATS.map(function (c) {
      // 預設用漸層底；日後換真照片：把 background 改成 url(...)
      var bg = c.img ? 'background-image:url(' + c.img + ')' : 'background:' + c.g;
      return '<a class="gl-tile" href="' + STORE + '">' +
        '<div class="bg" style="' + bg + '"></div><div class="ov"></div>' +
        '<span class="go">看貨 →</span>' +
        '<div class="tx"><div class="ic">' + c.ic + '</div><div class="en">' + c.en + '</div><div class="nm">' + c.name + '</div></div>' +
        '</a>';
    }).join('');
  }

  function landingHTML() {
    return '' +
    '<section id="gl-hero">' +
      '<p class="eye">日本直送 ・ 正品保證</p>' +
      '<h1>GRAND 天倉</h1>' +
      '<p class="sub">日本各大百貨・批店精選<br>每日上新 ・ 原裝直送台灣到府</p>' +
      '<div class="gl-btns">' +
        '<a class="gl-cta gl-buy" href="' + STORE + '">🛒 立即逛商品（2300+ 件）</a>' +
        '<a class="gl-cta gl-ghost" href="' + LINE + '" target="_blank" rel="noopener">加 LINE 看新貨</a>' +
      '</div>' +
      '<div class="gh-member">' +
        '<a class="ghm ghm-join" href="' + MEMBER + '">✨ 加入會員</a>' +
        '<a class="ghm ghm-login" href="' + LOGIN + '">👤 會員登入</a>' +
      '</div>' +
      '<div class="gl-cta gl-btns" style="margin-top:10px;gap:10px;justify-content:center;">' +
        '<a class="gl-ghost" href="' + ORDER + '">📋 會員中心</a>' +
        '<a class="gl-buy" href="' + ORDER + '">🧾 我的訂單</a>' +
      '</div>' +
      '<a class="gh-center" href="' + ORDER + '">📋 會員中心・我的訂單 / 點數 / 帳務</a>' +
    '</section>' +

    '<section id="gl-show">' +
      '<h2 class="gl-h2"><small>SHOP BY CATEGORY</small>精選代購分類</h2>' +
      '<div class="gl-grid">' + tilesHTML() + '</div>' +
      '<div id="gl-gate">' +
        '<p class="gt">🔓 加入會員，解鎖完整商品與會員批價</p>' +
        '<p class="gd">會員可看全部到貨照片、即時新品與專屬報價</p>' +
        '<div class="gbtns">' +
          '<a class="gl-mini o" href="/member">加入會員</a>' +
          '<a class="gl-mini j" href="' + STORE + '">先逛逛看</a>' +
          '<a class="gl-mini j" href="' + ORDER + '">我的訂單</a>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section id="gl-trust" class="gl-sec">' +
      '<div class="gl-badges">' +
        '<div class="gl-badge"><span class="ic">🏬</span>實體天倉・天天收發</div>' +
        '<div class="gl-badge"><span class="ic">🗾</span>日本正品・百貨直送</div>' +
        '<div class="gl-badge"><span class="ic">💴</span>MDM 進價・透明公開</div>' +
        '<div class="gl-badge"><span class="ic">💬</span>LINE 專人・快速回覆</div>' +
      '</div>' +
    '</section>' +

    '<section class="gl-sec">' +
      '<h2 class="gl-h2"><small>WHY GRAND</small>為什麼選 GRAND</h2>' +
      '<div class="gl-cards">' +
        '<div class="gl-card"><span class="ic">🆕</span><div><p class="tt">每日上新</p><p class="ds">統整日本最夯商品，第一手看到貨、不錯過。</p></div></div>' +
        '<div class="gl-card"><span class="ic">🤝</span><div><p class="tt">代提代付</p><p class="ds">免費代提貨、代付款，您只要挑、其餘交給我們。</p></div></div>' +
        '<div class="gl-card"><span class="ic">📦</span><div><p class="tt">直送到府</p><p class="ds">日本天倉直送台灣，送到您指定的地址。</p></div></div>' +
      '</div>' +
    '</section>' +

    '<section id="gl-band">' +
      '<p class="bt">日本精選・手刀下單<br>挑到停不下來 🤤</p>' +
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
    mw.style.setProperty('display', 'none', 'important');
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

  function buildMemberPanel() {
    if (document.getElementById('grand-member-panel')) return;
    var panel = document.createElement('div');
    panel.id = 'grand-member-panel';
    panel.innerHTML =
      '<a class="gm-primary" href="' + STORE + '">🛒 逛商品目錄</a>' +
      '<a class="gm-secondary" href="' + ORDER + '">👤 會員中心</a>' +
      '<a class="gm-secondary" href="' + ORDER + '">🧾 我的訂單</a>';
    document.body.appendChild(panel);
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

  /* 會員登入體驗：讓瀏覽器內建密碼管家能記住、並預設勾「記住我」自動登入。
     安全做法——不在前端儲存任何密碼，只設定 autocomplete 提示 + 勾選平台自身的記住選項。
     不動 #pwboss（管理員密碼，不主動記憶）。 */
  function enhanceMemberLogin() {
    var pws = document.querySelectorAll('input[type=password]');
    for (var i = 0; i < pws.length; i++) {
      var pw = pws[i];
      if (pw.id === 'pwboss') continue;
      pw.setAttribute('autocomplete', 'current-password');
      var form = pw.form;
      if (form) {
        var em = form.querySelector('input[type=email],input[type=text]:not([type=hidden])');
        if (em) em.setAttribute('autocomplete', 'username');
        var cbs = form.querySelectorAll('input[type=checkbox]');
        for (var j = 0; j < cbs.length; j++) {
          var lbl = (cbs[j].parentElement ? cbs[j].parentElement.textContent : '') || '';
          if (/記住|記得|保持|自動登入|remember|keep/i.test(lbl)) cbs[j].checked = true;
        }
      }
    }
  }

  function run() {
    ensureViewport();
    injectCSS();
    if (isHome()) buildLanding();
    buildFab();
    buildMemberPanel();
    buildAdminEntry();
    fixCart();
    enhanceMemberLogin();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
