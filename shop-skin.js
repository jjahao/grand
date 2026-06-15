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

  function openGrandLogin(event){
    if(event && event.preventDefault){
      event.preventDefault();
    }
    try{
      if(typeof show_hs === 'function'){
        show_hs('iframe','/shop2000_prog/member/mem_login_pop.aspx?vdir=','320','400');
        return false;
      }
    }catch(e){}
    location.href = LOGIN;
    return false;
  }

  function interceptLoginLinks(){
    try{
      var anchors = document.querySelectorAll('a[href*="/shop2000_prog/member/mem_login_pop.aspx"]');
      for(var i=0;i<anchors.length;i++){
        var a = anchors[i];
        if(!a.dataset.grandLoginBound){
          a.dataset.grandLoginBound = '1';
          a.addEventListener('click', function(e){
            openGrandLogin(e);
          }, false);
        }
      }
    }catch(e){}
  }

  /* === 登入循環修復（2026-06-15）===
     舊版在 mem_login_pop 與 top-level 都有「偵測頁面出現『會員/登入/歡迎』字樣 →
     自動跳轉 /member/my_order」的邏輯，再加 setInterval 每秒重跑。
     但「會員」二字在登入頁與幾乎每個頁面選單都存在，未登入時就狂觸發：
     跳 /member/my_order → 未登入被踢回登入頁 → 又偵測到「會員」→ 再跳 = 無限循環。
     已整段移除。登入後去向改由 Shop2000 原生 http_ref 處理，皮膚不再強制跳轉。 */
  if (location.pathname.indexOf('/shop2000_prog/member/mem_login_pop.aspx') === 0) {
    (function () {
      // 只做一件安全的事：若登入後去向(http_ref)是空的，預設回乾淨首頁(已登入態)。
      // 不做任何關鍵字偵測、不設 interval，避免循環。
      function setHttpRefIfEmpty() {
        try {
          var form = document.forms['form_login_mem'] || document.querySelector('form[name="form_login_mem"]') || document.querySelector('form');
          if (!form) return;
          var http = form.elements['http_ref'];
          if (http && !http.value) http.value = '/';
          var vdir = form.elements['vdir'];
          if (vdir && !vdir.value) vdir.value = '';
        } catch (e) {}
      }
      window.addEventListener('load', setHttpRefIfEmpty);
      try { document.addEventListener('DOMContentLoaded', setHttpRefIfEmpty); } catch (e) {}
    })();
  }

  // 攔截站內會員登入連結（改用原生彈窗，若可用）。純綁定，不跳轉。
  (function () {
    interceptLoginLinks();
    try { document.addEventListener('DOMContentLoaded', interceptLoginLinks); } catch (e) {}
  })();

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
      '#grand-login-wrap #div_login{display:block!important;position:relative;z-index:9999;margin:0!important}',
      /* ===== 新首頁：乾淨專業大公司風（與商品頁同套） ===== */
      '#grand-landing{background:#fff!important}',
      '.gh-top{background:#232F3E;color:#fff;text-align:center;font-size:12px;padding:7px 12px;letter-spacing:.5px}',
      '#gh-hero{background:linear-gradient(180deg,#fff,#F7F4EF);padding:34px 18px 30px;text-align:center;border-bottom:1px solid #eee}',
      '#gh-hero .brand{font-size:13px;letter-spacing:4px;color:#B8860B;font-weight:800;margin:0}',
      '#gh-hero h1{font-size:30px;font-weight:900;margin:8px 0 6px;letter-spacing:-.5px;color:#0F1111}',
      '#gh-hero .sub{font-size:14px;color:#565959;line-height:1.7;margin:0 0 20px}',
      '.gh-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}',
      '.gh-cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:50px;padding:0 34px;border-radius:25px;font-size:16px;font-weight:800;text-decoration:none;border:0;cursor:pointer;white-space:nowrap}',
      '.gh-cta.buy{background:#FFD814;color:#0F1111!important;box-shadow:0 6px 18px rgba(255,153,0,.35)}',
      '.gh-cta.buy:active{transform:scale(.98)}',
      '.gh-cta.line{background:#06C755;color:#fff!important}',
      '.gh-mbar{display:flex;gap:8px;justify-content:center;margin:16px auto 0;max-width:430px}',
      '.gh-mbar a{flex:1;text-align:center;padding:10px 6px;border:1px solid #d5d9d9;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;color:#0F1111!important;background:#fff}',
      '.gh-mbar a.j{background:#0F1111;color:#fff!important;border-color:#0F1111}',
      '.gh-sec{padding:30px 18px;max-width:1180px;margin:0 auto}',
      '.gh-h2{font-size:20px;font-weight:900;text-align:center;margin:0 0 4px;color:#0F1111}',
      '.gh-h2 .en{display:block;font-size:11px;letter-spacing:3px;color:#B8860B;font-weight:800;margin-bottom:6px}',
      '.gh-cats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:760px;margin:18px auto 0}',
      '@media(min-width:620px){.gh-cats{grid-template-columns:repeat(6,1fr)}}',
      '.gh-cat{display:flex;flex-direction:column;align-items:center;gap:7px;padding:16px 8px;border:1px solid #e3e6e6;border-radius:12px;text-decoration:none;color:#0F1111!important;background:#fff}',
      '.gh-cat:hover{box-shadow:0 4px 14px rgba(0,0,0,.1)}',
      '.gh-cat .ic{font-size:28px;line-height:1}.gh-cat .nm{font-size:12.5px;font-weight:700}',
      '.gh-trust{background:#F7F8F8;border-top:1px solid #eee;border-bottom:1px solid #eee;max-width:none}',
      '.gh-tg{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;max-width:680px;margin:0 auto}',
      '@media(min-width:620px){.gh-tg{grid-template-columns:repeat(4,1fr)}}',
      '.gh-ti{text-align:center}.gh-ti .ic{font-size:26px}.gh-ti .t{font-size:14px;font-weight:800;margin:6px 0 3px;color:#0F1111}.gh-ti .d{font-size:11.5px;color:#565959;line-height:1.5}',
      '.gh-band{background:#232F3E;color:#fff;text-align:center;padding:34px 18px}',
      '.gh-band .t{font-size:21px;font-weight:900;margin:0 0 16px;line-height:1.4}',
      '.gh-band .gh-cta.buy{box-shadow:0 6px 18px rgba(0,0,0,.3)}',
      '.gh-line{background:linear-gradient(180deg,#F1FBF5,#E6F7EC);max-width:none;text-align:center}',
      '.gh-linedesc{font-size:13px;color:#565959;margin:0 0 6px}',
      '.gh-qrs{display:flex;gap:18px;justify-content:center;margin:18px 0 0;flex-wrap:wrap}',
      '.gh-qr{background:#fff;border-radius:12px;padding:10px;width:146px;box-shadow:0 3px 12px rgba(6,150,70,.12)}',
      '.gh-qr img{width:126px;height:126px;object-fit:contain;display:block;border-radius:6px}',
      '.gh-qr .lb{font-size:12px;font-weight:700;margin-top:7px;color:#0F1111}.gh-qr .lb b{color:#06C755}',
      '#gh-foot{text-align:center;color:#565959;font-size:12.5px;line-height:1.9;padding:26px 18px;border-top:1px solid #eee}',
      '#gh-foot b{color:#0F1111}',
      '#gh-fab{position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:9000;background:#FFD814;color:#0F1111!important;font-weight:800;font-size:16px;padding:14px 34px;border-radius:28px;box-shadow:0 8px 24px rgba(255,153,0,.45);text-decoration:none;white-space:nowrap}',
      '#gh-fab:active{transform:translateX(-50%) scale(.97)}'
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
    var SHOP = '/product'; // 官網本站商品頁(已美化、可直接選購下單)
    var cats = [['🛒', '好市多'], ['💊', '日本藥妝'], ['🍫', '零食爆品'], ['🎁', '百貨禮盒'], ['🏪', '便利商店'], ['📦', 'MDM 批發']];
    var catHTML = cats.map(function (c) {
      return '<a class="gh-cat" href="' + SHOP + '"><span class="ic">' + c[0] + '</span><span class="nm">' + c[1] + '</span></a>';
    }).join('');
    return '' +
    '<div class="gh-top">日本直送・正品保證　|　已含代購服務　|　LINE 專人即時客服</div>' +
    '<section id="gh-hero">' +
      '<p class="brand">GRAND ・ JAPAN BUYING</p>' +
      '<h1>GRAND 天倉</h1>' +
      '<p class="sub">日本各大百貨・量販・批店精選<br>原裝直送台灣到府　每日上新</p>' +
      '<div class="gh-ctas">' +
        '<a class="gh-cta buy" href="' + SHOP + '">🛒 立即選購</a>' +
        '<a class="gh-cta line" href="' + LINE + '" target="_blank" rel="noopener">加 LINE 看新貨</a>' +
      '</div>' +
      '<div class="gh-mbar">' +
        '<a class="j" href="' + MEMBER + '">✨ 加入會員</a>' +
        '<a href="' + LOGIN + '">👤 會員登入</a>' +
        '<a href="' + ORDER + '">📋 會員中心</a>' +
      '</div>' +
    '</section>' +

    '<section class="gh-sec">' +
      '<h2 class="gh-h2"><span class="en">SHOP BY CATEGORY</span>熱門分類</h2>' +
      '<div class="gh-cats">' + catHTML + '</div>' +
    '</section>' +

    '<section class="gh-sec gh-trust">' +
      '<div class="gh-tg">' +
        '<div class="gh-ti"><div class="ic">🗾</div><div class="t">日本直送</div><div class="d">百貨量販原裝<br>直送台灣到府</div></div>' +
        '<div class="gh-ti"><div class="ic">✅</div><div class="t">正品保證</div><div class="d">實體天倉<br>天天收發貨</div></div>' +
        '<div class="gh-ti"><div class="ic">🤝</div><div class="t">代提代付</div><div class="d">免費代提代付<br>您只要挑</div></div>' +
        '<div class="gh-ti"><div class="ic">💬</div><div class="t">專人客服</div><div class="d">LINE 即時回覆<br>下單詢問都方便</div></div>' +
      '</div>' +
    '</section>' +

    '<section class="gh-band">' +
      '<p class="t">日本精選・每日上新<br>手刀選購不錯過 🛒</p>' +
      '<a class="gh-cta buy" href="' + SHOP + '">立即選購 →</a>' +
    '</section>' +

    '<section class="gh-sec gh-line">' +
      '<h2 class="gh-h2"><span class="en">STAY CONNECTED</span>加 LINE・第一手看新品</h2>' +
      '<p class="gh-linedesc">新品到貨第一時間通知，也能直接在 LINE 下單詢問</p>' +
      '<div class="gh-qrs">' +
        '<div class="gh-qr"><img src="' + QR_LINE + '" alt="LINE QR"><div class="lb"><b>LINE</b><br>@562spzag</div></div>' +
        '<div class="gh-qr"><img src="' + QR_WECHAT + '" alt="WeChat QR"><div class="lb">微信<br>james3338</div></div>' +
      '</div>' +
    '</section>' +

    '<section id="gh-foot">' +
      '<div><b>營業時間</b>　週一～週五 09:00–18:00（六日及例假休）</div>' +
      '<div>回訊息時間　每天 12:00–22:00</div>' +
      '<div><b>日本天倉</b>　東京都千代田区岩本町 2-1-8 NAビル1階</div>' +
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
    // 常駐選購鈕
    if (!document.getElementById('gh-fab')) {
      var fab = document.createElement('a');
      fab.id = 'gh-fab'; fab.href = '/product'; fab.textContent = '🛒 立即選購';
      document.body.appendChild(fab);
    }
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
      '<a class="gm-secondary" href="' + MEMBER + '">👤 會員中心</a>' +
      '<a class="gm-secondary" href="' + ORDER + '">🧾 我的訂單</a>';
    document.body.appendChild(panel);
  }

  // 把原生登入框 #div_login 搬出來置中顯示
  function showBossBox(d) {
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
  // 切到電腦版（手機版才有登入框與 boss_login）
  function switchToPc() {
    if (typeof chg_device === 'function') {
      try { sessionStorage.setItem('grand_open_admin', '1'); } catch (e) {}
      chg_device('pc');
      return true;
    }
    return false;
  }
  function setAdminText(t) {
    var a = document.getElementById('grand-admin');
    if (a) a.textContent = t;
  }
  function openAdmin() {
    var d = document.getElementById('div_login');
    if (d) { showBossBox(d); return; }
    // 窄版(手機)且無登入框 → 直接切電腦版（boss 登入是桌機限定）
    if (window.innerWidth < 700) {
      if (!switchToPc()) alert('店長登入需電腦版。請在瀏覽器選「要求電腦版網站」後再點・管理登入。');
      return;
    }
    // 桌機：登入框是頁面較晚才載入的，輪詢等它出現（最多 ~5 秒），避免一點就誤判
    setAdminText('開啟中…');
    var tries = 0;
    (function wait() {
      var el = document.getElementById('div_login');
      if (el) { setAdminText('・管理'); showBossBox(el); return; }
      if (tries++ < 20) { setTimeout(wait, 250); return; }
      setAdminText('・管理');
      if (!switchToPc()) alert('登入框載入失敗，請重新整理頁面再試。');
    })();
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

  /* 店長(boss)登入偵測：店長工具列含「購物車設定/批次編輯商品/訂單管理」等只有店長看得到的項目。 */
  function isBoss() {
    try {
      var t = document.body ? document.body.innerText : '';
      return /購物車設定|批次編輯商品|店長工具|商品管理/.test(t);
    } catch (e) { return false; }
  }
  /* 店長登入後：皮膚整個讓位，還原成舊系統頁面，讓店長工具列可立即管理。 */
  function bossStepAside() {
    ['grand-skin-css', 'grand-landing', 'grand-fab', 'grand-member-panel', 'grand-admin', 'grand-login-wrap'].forEach(function (id) {
      var e = document.getElementById(id); if (e) e.remove();
    });
    var mw = document.getElementById('main_width'); if (mw) mw.style.removeProperty('display');
  }

  /* ===== 商品列表頁：Amazon JP 風格漂亮格 + 直接選購（接官網原生購物車） ===== */
  function isProductListPage() {
    if (!/\/product(\/|$)/.test(location.pathname)) return false; // 在 /product 下
    if (/\/product\/p\d+/.test(location.pathname)) return false;  // 排除單一商品內頁
    return true;
  }
  function gpEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function gatherProducts() {
    var imgs = document.querySelectorAll('img.pimg'), items = [], seen = {};
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i], psn = img.getAttribute('psn'); if (!psn || seen[psn]) continue; seen[psn] = 1;
      var td = img.closest('td') || (img.parentElement && img.parentElement.parentElement);
      var a = td ? td.querySelector('a[href*="/product/p"]') : null;
      var txt = td ? td.innerText : '';
      items.push({ psn: psn, img: img.getAttribute('src') || '', name: a ? a.textContent.trim() : '', nt: (txt.match(/台幣\s*([0-9,]+)/) || [])[1] || '' });
    }
    return items;
  }
  function productContainer() {
    var img = document.querySelector('img.pimg'); if (!img) return null;
    var el = img; for (var i = 0; i < 6; i++) { el = el.parentElement; if (!el) break; if (el.querySelectorAll('img.pimg').length >= 4) return el; }
    return null;
  }
  function ensureBuyct(v) {
    var bc = document.getElementById('buyct');
    if (!bc) { bc = document.createElement('input'); bc.type = 'hidden'; bc.id = 'buyct'; document.body.appendChild(bc); }
    bc.value = v; return bc;
  }
  function gpSyncCount() {
    var g = document.querySelector('#buyGs'), c = document.getElementById('gp-cnt');
    if (c) c.textContent = g ? (g.innerText.trim() || '0') : '0';
  }
  function renderPrettyGrid(items) {
    var grid = document.getElementById('gp-grid'); if (!grid) return;
    grid.innerHTML = items.map(function (p) {
      var price = p.nt ? ('NT$' + p.nt + '<small> 起</small>') : '<small>詢價</small>';
      var full = p.img.replace(/-(\d+)\.jpg/, '-$1o.jpg');
      return '<div class="gp-card" data-psn="' + gpEsc(p.psn) + '">' +
        '<div class="gp-imw"><img class="im" src="' + gpEsc(p.img) + '" data-full="' + gpEsc(full) + '" loading="lazy"></div>' +
        '<div class="gp-bd"><div class="gp-nm">' + gpEsc(p.name) + '</div><div class="gp-pr">' + price + '</div>' +
        '<div class="gp-dlv">日本直送・原裝到府</div>' +
        '<div class="gp-row"><div class="gp-qty"><button class="dec" type="button">−</button><span class="n">1</span><button class="inc" type="button">＋</button></div>' +
        '<button class="gp-add" type="button">加入購物車</button></div></div></div>';
    }).join('');
    gpSyncCount();
  }
  function buildPrettyList() {
    if (document.getElementById('gp-wrap')) return;
    var items = gatherProducts(); if (items.length < 4) return; // 商品還沒載好就先不做
    // 樣式
    if (!document.getElementById('gp-css')) {
      var css = document.createElement('style'); css.id = 'gp-css';
      css.textContent = [
        '#gp-wrap{max-width:1240px;margin:0 auto;padding:8px 12px 110px;background:#fff;font-family:-apple-system,"PingFang TC","Noto Sans TC",sans-serif}',
        '#gp-head{padding:10px 2px 12px}#gp-head .t{font-size:19px;font-weight:900;color:#0F1111}#gp-head .s{font-size:12px;color:#565959}',
        '#gp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}',
        '@media(min-width:760px){#gp-grid{grid-template-columns:repeat(4,1fr);gap:16px}}',
        '.gp-card{background:#fff;border:1px solid #e3e6e6;border-radius:10px;overflow:hidden;display:flex;flex-direction:column}',
        '.gp-card:hover{box-shadow:0 4px 14px rgba(0,0,0,.12)}',
        '.gp-imw{padding:10px}.gp-card .im{width:100%;aspect-ratio:1/1;object-fit:contain;cursor:zoom-in}',
        '.gp-bd{padding:0 12px 12px;display:flex;flex-direction:column;gap:7px;flex:1}',
        '.gp-nm{font-size:13px;line-height:1.4;color:#0F1111;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:36px}',
        '.gp-pr{color:#B12704;font-weight:800;font-size:19px}.gp-pr small{font-size:11px;color:#565959;font-weight:600}',
        '.gp-dlv{font-size:11px;color:#007600}',
        '.gp-row{display:flex;align-items:center;gap:8px;margin-top:auto}',
        '.gp-qty{display:flex;align-items:center;border:1px solid #d5d9d9;border-radius:8px}',
        '.gp-qty button{width:30px;height:34px;border:0;background:#f7f8f8;font-size:17px;font-weight:700;color:#0F1111;cursor:pointer}',
        '.gp-qty span{width:28px;text-align:center;font-size:14px;font-weight:700}',
        '.gp-add{flex:1;height:36px;border:0;border-radius:18px;background:#FFD814;color:#0F1111;font-weight:700;font-size:13px;cursor:pointer}',
        '.gp-add.added{background:#e7f6e7;color:#007600;border:1px solid #b6e0b6}',
        '#gp-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:9000;background:#FFD814;color:#0F1111;font-weight:800;font-size:15px;padding:13px 26px;border-radius:28px;box-shadow:0 8px 24px rgba(0,0,0,.28);border:0;cursor:pointer;display:flex;gap:10px;align-items:center}',
        '#gp-bar .c{background:#B12704;color:#fff;border-radius:20px;padding:2px 10px;font-size:13px}',
        '#gp-lb{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.88);display:none;align-items:center;justify-content:center;padding:16px;cursor:zoom-out}#gp-lb img{max-width:96%;max-height:92%;object-fit:contain;background:#fff;border-radius:8px}'
      ].join('');
      document.head.appendChild(css);
    }
    // 隱藏原生商品區（保留 #main_width 其餘部分＝標題/排序/下頁分頁，仍可換頁）
    var cont = productContainer(); if (cont) cont.style.setProperty('display', 'none', 'important');
    // 結構
    var mw = document.getElementById('main_width');
    var wrap = document.createElement('div'); wrap.id = 'gp-wrap';
    wrap.innerHTML = '<div id="gp-head"><div class="t">精選商品</div><div class="s">點圖看大圖 ・ 選好數量加入 ・ 最後按下方總結帳一次結帳（換頁請用本頁最下方頁碼）</div></div><div id="gp-grid"></div>';
    if (mw && mw.parentNode) mw.parentNode.insertBefore(wrap, mw); else document.body.appendChild(wrap);
    var bar = document.createElement('button'); bar.id = 'gp-bar'; bar.type = 'button';
    bar.innerHTML = '🛒 總結帳 <span class="c" id="gp-cnt">0</span> 件'; document.body.appendChild(bar);
    var lb = document.createElement('div'); lb.id = 'gp-lb'; lb.innerHTML = '<img>'; document.body.appendChild(lb);
    lb.addEventListener('click', function () { lb.style.display = 'none'; });
    bar.addEventListener('click', function () { try { if (typeof to_mycar1 === 'function') to_mycar1(); } catch (e) {} });
    // 事件委派
    wrap.addEventListener('click', function (e) {
      var im = e.target.closest('.im');
      if (im) { lb.querySelector('img').src = im.getAttribute('data-full') || im.src; lb.style.display = 'flex'; return; }
      var card = e.target.closest('.gp-card'); if (!card) return;
      var n = card.querySelector('.n');
      if (e.target.classList.contains('inc')) { n.textContent = (+n.textContent + 1); return; }
      if (e.target.classList.contains('dec')) { n.textContent = Math.max(1, +n.textContent - 1); return; }
      if (e.target.classList.contains('gp-add')) {
        var qty = +n.textContent, psn = card.getAttribute('data-psn');
        ensureBuyct(qty);
        try { if (typeof mycar_bk === 'function') { mycar_bk(psn); if (typeof clear_buyTxt === 'function') setTimeout(clear_buyTxt, 900); } } catch (er) {}
        var btn = e.target; btn.classList.add('added'); btn.textContent = '✓ 已加入 ' + qty + ' 件';
        setTimeout(function () { btn.classList.remove('added'); btn.textContent = '加入購物車'; }, 1800);
        setTimeout(gpSyncCount, 1200);
      }
    });
    renderPrettyGrid(items);
    setInterval(gpSyncCount, 1500);
    // 換頁（原生分頁可能用 AJAX 換掉商品）→ 觀察商品變動就重建格子
    if (cont) {
      var t; var obs = new MutationObserver(function () { clearTimeout(t); t = setTimeout(function () { var it = gatherProducts(); if (it.length) renderPrettyGrid(it); }, 350); });
      try { obs.observe(cont, { childList: true, subtree: true }); } catch (e) {}
    }
  }
  function tryPrettyList() {
    // 商品(img.pimg)常較晚載入，輪詢最多 ~8 秒
    var tries = 0;
    var iv = setInterval(function () {
      if (document.getElementById('gp-wrap')) { clearInterval(iv); return; }
      if (document.querySelectorAll('img.pimg').length >= 4) { clearInterval(iv); buildPrettyList(); }
      else if (tries++ > 16) clearInterval(iv);
    }, 500);
  }

  function run() {
    ensureViewport();
    // 店長已登入 → 皮膚讓位，直接用舊系統管理（含工具列較晚載入，下方再輪詢補偵測）
    if (isBoss()) { bossStepAside(); return; }
    injectCSS();
    if (isHome()) buildLanding();
    if (isProductListPage()) tryPrettyList(); else buildMemberPanel();
    buildAdminEntry();
    fixCart();
    enhanceMemberLogin();
    // 店長工具列常較晚載入：偵測到就讓位（最多監看 ~8 秒）
    var tries = 0;
    var iv = setInterval(function () {
      if (isBoss()) { clearInterval(iv); bossStepAside(); }
      else if (tries++ > 10) clearInterval(iv);
    }, 800);
    // 從手機切到電腦版後，自動把店長登入框打開（接續 openAdmin 的旗標）
    try {
      if (sessionStorage.getItem('grand_open_admin') === '1' && document.getElementById('div_login')) {
        sessionStorage.removeItem('grand_open_admin');
        setTimeout(openAdmin, 400);
      }
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
