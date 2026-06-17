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

  var STORE = '/product'; // 官網本站商品列表(漂亮格已套);原外部目錄 jjahao.github.io/grand 已淘汰
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
      /* 商品頁頂部會員列（全域，獨立於 buildPrettyList；電腦版顯示、手機隱藏因首頁已有 gh-mbar） */
      '#gp-topbar{display:none}',
      '@media(min-width:768px){#gp-topbar{display:flex!important;align-items:center;gap:0;background:#232F3E;padding:8px 18px;margin:0 0 8px;position:relative;z-index:100;max-width:1000px;margin-left:auto;margin-right:auto}}',
      '#gp-topbar a{color:#ddd!important;text-decoration:none;font-size:13px;padding:2px 14px;border-right:1px solid #445;white-space:nowrap}',
      '#gp-topbar a:last-child{border-right:0}',
      '#gp-topbar a:hover{color:#FFD814!important}',
      '#gp-topbar a.tb-home{color:#fff!important;font-weight:700}',
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
    var hideOnList = isProductListPage();
    // 商品列表頁：用 CSS 永久壓制原生「結帳 共X件」浮框 + #chkout_hint，避免它後注入或自亮。
    if (hideOnList && !document.getElementById('gp-hide-chkout')) {
      var st = document.createElement('style'); st.id = 'gp-hide-chkout';
      st.textContent = '#chkout_hint,#chkout_hint *{display:none!important;visibility:hidden!important}';
      document.head.appendChild(st);
    }
    function processOne(e) {
      try {
        if (getComputedStyle(e).position !== 'fixed') return;
        if (!/結帳/.test(e.textContent || '')) return;
        if (e.offsetHeight > 160 || e.offsetWidth > 260) return;
        if (e.id === 'gp-bar') return;
        if (hideOnList) {
          e.style.setProperty('display', 'none', 'important');
          e.style.setProperty('visibility', 'hidden', 'important');
        } else {
          e.style.setProperty('top', '6px', 'important');
          e.style.setProperty('right', '8px', 'important');
          e.style.setProperty('z-index', '50', 'important');
        }
      } catch (er) {}
    }
    function sweep() { var ns = document.querySelectorAll('div,span,a'); for (var i = 0; i < ns.length; i++) processOne(ns[i]); }
    sweep();
    if (hideOnList) {
      // 它可能晚注入或自顯，持續監看；穩定後也加保險每 2 秒掃一次。
      try { new MutationObserver(sweep).observe(document.body || document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] }); } catch (er) {}
      setInterval(sweep, 2000);
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
  /* 分類樹（主分類 i=id n=名 s=[次分類id,名,件數]）。topcls 導向 /product/{主}/{次}。 */
  var GCATS=[{"i":"681206","n":"迪士尼","s":[["1541427","11/10新品-米奇雪精靈系列",55],["1541022","11/4新品-冬季系列",41],["1530358","8/28新品-達菲鳥舞落葉系列",38],["1523064","7/3新品-達菲甜甜圈系列",24],["1518357","6/5新品",35],["1518356","6/3新品",12],["1518355","達菲20週年系列",57],["1519704","其他",1187]]},{"i":"714061","n":"好市多現貨","s":[]},{"i":"653720","n":"日本好市多","s":[["1364630","藥品/保健類",304],["1364631","零食類",374],["1364632","食品/酒類",427],["1364633","生活用品類",510],["1364634","衣著類",86],["1364635","美妝用品類",113],["1364636","文具類",34],["1364637","沐浴類",57]]},{"i":"654002","n":"便利商店","s":[["1365721","7-11",772],["1365722","family mart",176],["1365723","lawson",35]]},{"i":"653722","n":"量販店","s":[["1364642","零食類",915],["1364643","調味料",99],["1364644","糖果/巧克力",226],["1364645","其他零嘴小吃",213],["1402772","酒類",2]]},{"i":"653718","n":"MDM批發","s":[["1536504","DHC保健食品",5],["1450733","調味料",6],["1579264","清潔用品",18],["1450734","防蚊防蟲",16],["1450730","食品零食",222],["1450731","美妝・美妝小物",53],["1450729","入浴球",9],["1463220","瑪利歐系列",19],["1464923","OK繃系列",4],["1464918","三麗鷗系列",27],["1464921","寶可夢系列",3],["1463222","吉伊卡哇系列",60],["1463225","星之卡比系列",0],["1464919","森林家族系列",0],["1463226","トミカ玩具車",0],["1463227","麵包超人系列",29],["1463224","盒玩",0],["1450732","其它",182]]},{"i":"653726","n":"日本藥妝","s":[["1364650","日本處方簽專區",53],["1364651","藥品類",229],["1528345","Atomy",14]]},{"i":"713983","n":"茅乃舍","s":[]},{"i":"654004","n":"百貨禮盒","s":[["1375358","小倉山莊",33],["1559106","GRAMERCY NEWYORK",9],["1439404","GOD BLESS BUTTER 神之手",3],["1415451","GALLETE au BEURRE",17],["1415450","NY紐約起司蛋捲",8],["1375359","Tulip Rose",10],["1376695","YOKU MOKU",37],["1375360","Audrey 花束餅乾",19],["1376693","Sugar Butter Tree",15],["1376694","鎌倉五郎(半月)",4],["1376696","GATEAU FESTA HARADA",9],["1376690","東京牛奶起司工廠 Tokyo Milk cheese factory",7],["1415453","AND THE FRIET薯條餅乾",13],["1375362","上野風月堂/東京風月堂/神戶風月堂",42],["1375363","桂新堂",9],["1376847","福砂屋",7],["1394180","東京芭娜娜/迪士尼聯名",28],["1428921","FRANCAJS",7],["1375361","其他品牌",216],["1376697","名古屋蝦餅",3],["1439407","Mary's 巧克力",13],["1439411","Number sugar",5],["1439412","一創堂",6],["1439413","Sable Michelle 周遊世界餅乾罐",25],["1439414","銀座菊廼舎",4],["1439415","銀座西",5],["1439416","東京巧克力工廠",4],["1439450","Press Butter Sand",13],["1439452","PARIS BUTTER CHOCOLAT",7],["1439453","神戶布丁",4],["1439454","BENIYA 松鼠核桃",2],["1439457","CoroCoro waffle cube",4],["1439458","Cream cheese cake",3],["1439487","TOKYO ひよこ",2],["1439488","captain sweets burger",13],["1439495","Tokyo Corne Fleuri玫瑰花巧克力",2],["1439496","Sabrina小花酥餅",16],["1439503","BRULEE MERIZE布蕾",7],["1459558","BUTTER STATE's",10],["1459559","Apple & Butter",3],["1459562","喫茶店",8],["1459564","calbee",23],["1552628","TOKYO RUSK",8],["1552656","Colombin",4],["1571623","RAMEN CLUB 拉麵餅乾",6]]},{"i":"684454","n":"台北現貨","s":[]}];
  // 多關鍵字過濾狀態：null = 不過濾；array = [token1, token2, ...]（全部 lowercase，AND 匹配）
  var gpFilter = null;
  function gpTokenize(v) {
    return (v || '').trim().split(/[\s　]+/).filter(Boolean).map(function (t) { return t.toLowerCase(); });
  }
  function gpApplyFilter(items) {
    if (!gpFilter || !gpFilter.length) return items;
    return items.filter(function (p) {
      var n = (p.name || '').toLowerCase();
      return gpFilter.every(function (t) { return n.indexOf(t) >= 0; });
    });
  }
  function gpCurCatLabel() {
    // 當前分類顯示名（給搜尋提示用）
    var m = location.pathname.match(/\/product\/(\d+)(?:\/(\d+))?/);
    if (!m) return '';
    var live = gpReadLiveCats();
    var mainId = m[1], subId = m[2] || '';
    var mainName = '', subName = '';
    var lm = live.mains.filter(function (x) { return x.id === mainId; })[0];
    if (lm) mainName = lm.name;
    else { var gc = GCATS.filter(function (c) { return c.i === mainId; })[0]; if (gc) mainName = gc.n; }
    if (subId) {
      var ls = live.subs.filter(function (x) { return x.id === subId; })[0];
      if (ls) subName = ls.name;
    }
    return gpCleanCat(mainId, mainName, false) + (subName ? ' ／ ' + gpCleanCat(subId, subName, true) : '');
  }
  function gpSearchBar() {
    var m = location.search.match(/[?&]kw=([^&]*)/);
    var cur = m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
    var catLabel = gpCurCatLabel();
    var ph = catLabel ? ('在「' + catLabel + '」內搜尋，可空格分多個關鍵字…') : '搜尋商品名稱（可空格分多個關鍵字）…';
    var tip = '';
    if (cur || gpFilter) {
      var shown = cur || (gpFilter ? gpFilter.join(' ') : '');
      tip = '<div class="gp-kw-tip">' + (catLabel ? '在「' + gpEsc(catLabel) + '」內搜尋「' : '搜尋「') + gpEsc(shown) + '」的結果</div>';
    }
    return '<div class="gp-search"><i class="gps-ic">🔍</i><input id="gp-kw" type="search" inputmode="search" placeholder="' + gpEsc(ph) + '" value="' + gpEsc(cur || (gpFilter ? gpFilter.join(' ') : '')) + '" autocomplete="off"><button id="gp-kw-go" type="button">搜尋</button>' + ((cur || gpFilter) ? '<a class="gp-kw-clear" href="javascript:void(0)" id="gp-kw-clear-btn">✕</a>' : '') + '</div>' + tip;
  }
  function gpDoSearch() {
    var inp = document.getElementById('gp-kw'); if (!inp) return;
    var v = (inp.value || '').trim();
    var m = location.pathname.match(/\/product\/(\d+)(?:\/(\d+))?/);
    var inCat = !!m;
    if (!v) {
      // 清空 → 重設過濾，回到當前分類首頁（或全部商品）
      gpFilter = null;
      if (location.search) location.href = inCat ? location.pathname : '/product';
      else { var items = gatherProducts(); renderPrettyGrid(items); refreshSearchBar(); }
      return;
    }
    gpFilter = gpTokenize(v);
    if (inCat) {
      // 已在分類內 → 鎖定當前分類，當頁客戶端 AND 過濾，不導頁
      var items2 = gatherProducts();
      renderPrettyGrid(items2);
      refreshSearchBar();
    } else {
      // 全部商品 → 用 Shop2000 原生搜尋導頁；多關鍵字之後在 render 階段二次 AND 過濾
      location.href = '/product?kw=' + encodeURIComponent(v);
    }
  }
  function refreshSearchBar() {
    var oldBar = document.querySelector('#gp-wrap .gp-search'); if (!oldBar) return;
    var tmp = document.createElement('div'); tmp.innerHTML = gpSearchBar();
    var newBar = tmp.querySelector('.gp-search'); if (newBar) oldBar.replaceWith(newBar);
    var oldTip = document.querySelector('#gp-wrap .gp-kw-tip');
    if (oldTip) oldTip.remove();
    var newTip = tmp.querySelector('.gp-kw-tip');
    if (newTip) document.querySelector('#gp-wrap .gp-search').after(newTip);
  }
  // 漂亮名稱對照(從 GCATS 取已知主/次分類的乾淨名)；新分類沒對照就清理原始名
  var GCAT_NAME = {}, GSUB_NAME = {};
  (function () {
    for (var i = 0; i < GCATS.length; i++) {
      GCAT_NAME[GCATS[i].i] = GCATS[i].n;
      for (var j = 0; j < GCATS[i].s.length; j++) GSUB_NAME[GCATS[i].s[j][0]] = GCATS[i].s[j][1];
    }
  })();
  function gpCleanCat(id, raw, isSub) {
    // James 規則：皮膚目錄名稱必須跟系統本頁一致——只去掉尾端商品計數（…2016/...1010），其餘原樣。
    var n = (raw || '').replace(/[\.．·・…]{2,}\s*\d+\s*$/, '').trim();
    return n || '分類';
  }
  // 即時讀官網現有分類選單(藏在頁面裡的 topcls)；後台上/下架→這裡自動同步
  // 同時記錄每個分類（含只出現在 sub 的父分類）第一次出現的順序，供排序用
  // 額外讀「虛擬分頁」：左側 sidebar 內非 topcls、卻指向商品清單的 a（例：爆款下單區🔥）
  function gpReadLiveCats() {
    var mains = [], mseen = {}, subs = [], sseen = {};
    var parentSeq = {}, seqIdx = 0; // 記錄每個 mainId 在 DOM 裡的出現順序
    var virtual = [], vseen = {};
    var els = document.querySelectorAll('[onclick]');
    for (var i = 0; i < els.length; i++) {
      var oc = els[i].getAttribute('onclick') || '';
      var m = oc.match(/topcls\(['"](\d+)['"]\s*,\s*['"]([^'"]*)['"]\)/);
      if (!m) continue;
      var main = m[1], sub = m[2], name = (els[i].innerText || els[i].textContent || '').trim();
      if (parentSeq[main] === undefined) parentSeq[main] = seqIdx++; // 首次出現記順序
      if (sub === '') { if (!mseen[main]) { mseen[main] = 1; mains.push({ id: main, name: name }); } }
      else { if (!sseen[sub]) { sseen[sub] = 1; subs.push({ id: sub, main: main, name: name }); } }
    }
    // 虛擬分頁（爆款下單區🔥 等）：Shop2000 用 <div class="pcls1" id="{vid}" onclick="...location.href='/home/{vid}'...">
    var pclsEls = document.querySelectorAll('.pcls1, .pcls2, .pcls3');
    for (var p = 0; p < pclsEls.length; p++) {
      var pel = pclsEls[p];
      var pid = pel.id || '';
      var nm = (pel.innerText || pel.textContent || '').trim().replace(/[\.．·・…]{2,}\s*\d+\s*$/, '').trim();
      if (!nm || nm.length < 2) continue;
      // URL 從 onclick 提取，抓不到就用 /home/{id}
      var pOc = pel.getAttribute('onclick') || '';
      var pLm = pOc.match(/location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/);
      var pHref = pLm ? pLm[1] : (pid ? '/home/' + pid : '');
      if (!pHref || vseen[pHref]) continue;
      vseen[pHref] = 1;
      virtual.push({ href: pHref, name: nm });
    }
    try { if (virtual.length) console.log('[grand-skin] 虛擬分頁:', virtual); } catch (_) {}
    return { mains: mains, subs: subs, seq: parentSeq, virtual: virtual };
  }
  function gpCatNav() {
    var m = location.pathname.match(/\/product\/(\d+)(?:\/(\d+))?/);
    var curMain = m ? m[1] : '', curSub = (m && m[2]) ? m[2] : '';
    var live = gpReadLiveCats();
    // 主分類：GCATS 永久分類 ＋ live 裡有但 GCATS 沒有的（批次上架分類），取聯集後依系統順序排序
    var gcatIdSet = {};
    GCATS.forEach(function (c) { gcatIdSet[c.i] = 1; });
    var mains = GCATS.map(function (c) { return { id: c.i, name: c.n }; });
    live.mains.forEach(function (lm) { if (!gcatIdSet[lm.id]) mains.push(lm); });
    // 依 live.seq（DOM 出現順序 = 後台系統順序）排序；不在 live 裡的排最後（保持 GCATS 相對順序）
    var fallback = mains.length + 1000;
    mains.sort(function (a, b) {
      var sa = (live.seq[a.id] !== undefined) ? live.seq[a.id] : fallback;
      var sb = (live.seq[b.id] !== undefined) ? live.seq[b.id] : fallback;
      return sa - sb;
    });
    var curPath = location.pathname + location.search;
    var mr = '<a class="gc-m' + (curMain ? '' : ' on') + '" href="/product">全部</a>';
    for (var i = 0; i < mains.length; i++) {
      mr += '<a class="gc-m' + (mains[i].id === curMain ? ' on' : '') + '" href="/product/' + mains[i].id + '">' + gpEsc(gpCleanCat(mains[i].id, mains[i].name, false)) + '</a>';
    }
    // 虛擬分頁（爆款下單區🔥 等）：URL 直接用 sidebar 原始 href，內容是 Shop2000 自己組（拉其他商品）
    if (live.virtual && live.virtual.length) {
      for (var v = 0; v < live.virtual.length; v++) {
        var vh = live.virtual[v].href;
        var isOn = (curPath === vh) || (curPath.indexOf(vh) === 0 && vh.length > 8);
        mr += '<a class="gc-m gc-virtual' + (isOn ? ' on' : '') + '" href="' + gpEsc(vh) + '">' + gpEsc(live.virtual[v].name) + '</a>';
      }
    }
    // 次分類：目前主分類的子分類，優先即時讀，後備 GCATS
    var sr = '';
    if (curMain) {
      var subList = live.subs.filter(function (s) { return s.main === curMain; });
      if (!subList.length) {
        var gc = GCATS.filter(function (c) { return c.i === curMain; })[0];
        if (gc) subList = gc.s.map(function (s) { return { id: s[0], main: curMain, name: s[1] }; });
      }
      if (subList.length) {
        sr = '<div class="gc-subrow"><a class="gc-s' + (curSub ? '' : ' on') + '" href="/product/' + curMain + '">全部</a>';
        for (var j = 0; j < subList.length; j++) {
          sr += '<a class="gc-s' + (subList[j].id === curSub ? ' on' : '') + '" href="/product/' + curMain + '/' + subList[j].id + '">' + gpEsc(gpCleanCat(subList[j].id, subList[j].name, true)) + '</a>';
        }
        sr += '</div>';
      }
    }
    return '<div class="gc-nav"><div class="gc-mainrow">' + mr + '</div>' + sr + '</div>';
  }
  // Windows 桌面瀏覽器無觸控滑 → 加滑鼠拖曳橫向滾動（pointer events 統一處理滑鼠/觸控板/觸控）
  function attachDragScroll(el) {
    if (!el || el.__gcDragBound) return; el.__gcDragBound = 1;
    var isDown = false, startX = 0, startScroll = 0, moved = 0;
    el.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return; // 只接左鍵
      isDown = true; startX = e.clientX; startScroll = el.scrollLeft; moved = 0;
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
    });
    el.addEventListener('pointermove', function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (!el.classList.contains('gc-dragging') && Math.abs(dx) > 4) el.classList.add('gc-dragging');
      el.scrollLeft = startScroll - dx;
      moved = Math.max(moved, Math.abs(dx));
    });
    function stop(e) {
      if (!isDown) return; isDown = false;
      try { el.releasePointerCapture(e.pointerId); } catch (_) {}
      if (moved > 5) {
        // 阻擋本次拖曳結束的 click（不要誤觸分類連結）
        var blocker = function (ev) { ev.preventDefault(); ev.stopPropagation(); };
        el.addEventListener('click', blocker, { capture: true, once: true });
      }
      setTimeout(function () { el.classList.remove('gc-dragging'); }, 0);
    }
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
    // 滾輪垂直 → 橫向滾（順手體驗，桌面無觸控板的 user 用得到）
    el.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY; e.preventDefault();
      }
    }, { passive: false });
  }
  function gatherProducts() {
    // 只抓 #plist_tb（真正的分類/全部商品清單）；plist_tb{數字} 是固定推薦區，排除。
    var root = document.getElementById('plist_tb') || document;
    var imgs = root.querySelectorAll('img.pimg'), items = [], seen = {};
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
    var pt = document.getElementById('plist_tb'); if (pt) return pt; // 真正的商品清單容器
    var img = document.querySelector('img.pimg'); if (!img) return null;
    var el = img; for (var i = 0; i < 6; i++) { el = el.parentElement; if (!el) break; if (el.querySelectorAll('img.pimg').length >= 4) return el; }
    return null;
  }
  function ensureBuyct(v) {
    var bc = document.getElementById('buyct');
    if (!bc) { bc = document.createElement('input'); bc.type = 'hidden'; bc.id = 'buyct'; document.body.appendChild(bc); }
    bc.value = v; return bc;
  }
  /* 商品規則(用隱藏iframe載單品頁、等JS填好#buyct才讀):min=最少件數,step=倍數,ask=詢價 */
  var gpRules = {}, gpPending = {};
  function gpFetchRule(psn) {
    if (gpRules[psn]) return Promise.resolve(gpRules[psn]);
    if (gpPending[psn]) return gpPending[psn];
    gpPending[psn] = new Promise(function (resolve) {
      var ifr = document.createElement('iframe');
      ifr.style.cssText = 'position:absolute;left:-9999px;width:600px;height:400px;border:0';
      ifr.src = '/product/p' + psn;
      var done = false, t;
      function finish(rule) {
        if (done) return; done = true; clearTimeout(t);
        gpRules[psn] = rule; delete gpPending[psn];
        try { ifr.parentNode.removeChild(ifr); } catch (e) {}
        resolve(rule);
      }
      function read() {
        try {
          var d = ifr.contentDocument; if (!d || !d.body) return;
          var bodyTxt = d.body.innerText || '';
          var loaded = /分類位置|加入到收藏匣|簡要說明|會員價/.test(bodyTxt);
          if (!loaded) return; // 單品頁還沒載好
          var bc = d.getElementById('buyct');
          var rule = { min: 1, step: 1, ask: false, brief: '' };
          if (bc) {
            var opts = [].map.call(bc.options, function (o) { return parseInt(o.value, 10); }).filter(function (v) { return v > 0; });
            if (opts.length === 0) return; // #buyct 存在但 JS 還沒填，再等
            rule.min = opts[0]; rule.step = opts.length > 1 ? (opts[1] - opts[0]) : opts[0];
            if (rule.step < 1) rule.step = rule.min;
          }
          // 沒 #buyct 的商品(例 AI 上架未開放訂購) → 仍可用 mycar_bk 加購，視為一般 min1/step1，不詢價
          var tiems = d.querySelectorAll('.p_tiem');
          if (tiems.length >= 2) { var bf = (tiems[1].innerText || '').trim(); if (bf && bf.length < 200) rule.brief = bf; }
          finish(rule);
        } catch (e) {}
      }
      ifr.onload = function () {
        var tries = 0;
        var iv = setInterval(function () { read(); if (done) clearInterval(iv); else if (tries++ > 25) { clearInterval(iv); finish({ min: 1, step: 1, ask: false, brief: '' }); } }, 200);
      };
      t = setTimeout(function () { finish({ min: 1, step: 1, ask: false, brief: '' }); }, 8000);
      document.body.appendChild(ifr);
    });
    return gpPending[psn];
  }
  function gpRoundQty(q, rule) {
    q = parseInt(q, 10); if (isNaN(q) || q < rule.min) q = rule.min;
    var off = (q - rule.min) % rule.step;
    if (off !== 0) q = q - off + rule.step; // 向上進位到合法
    if (q < rule.min) q = rule.min;
    return q;
  }
  function gpSyncCount() {
    var g = document.querySelector('#buyGs'), c = document.getElementById('gp-cnt');
    if (c) c.textContent = g ? (g.innerText.trim() || '0') : '0';
  }
  function renderPrettyGrid(items) {
    var grid = document.getElementById('gp-grid'); if (!grid) return;
    items = gpApplyFilter(items);
    if (!items.length && gpFilter) {
      grid.innerHTML = '<div style="grid-column:1/-1;padding:40px 16px;text-align:center;color:#666;font-size:14px;">本分類內找不到符合「' + gpEsc(gpFilter.join(' ')) + '」的商品</div>';
      gpSyncCount();
      return;
    }
    grid.innerHTML = items.map(function (p) {
      var price = p.nt ? ('NT$' + p.nt + '<small> 起</small>') : '<small>詢價</small>';
      var full = p.img.replace(/-(\d+)\.jpg/, '-$1o.jpg');
      return '<div class="gp-card" data-psn="' + gpEsc(p.psn) + '">' +
        '<div class="gp-imw"><img class="im" src="' + gpEsc(p.img) + '" data-full="' + gpEsc(full) + '" loading="lazy"></div>' +
        '<div class="gp-bd"><div class="gp-nm">' + gpEsc(p.name) + '</div><div class="gp-pr">' + price + '</div>' +
        '<div class="gp-dlv">日本直送・原裝到府</div>' +
        '<div class="gp-brief"></div>' +
        '<div class="gp-row"><div class="gp-qty"><button class="dec" type="button">−</button><input class="n" type="number" min="1" max="999" value="1" inputmode="numeric" title="可手打或點開選"><button class="inc" type="button">＋</button></div>' +
        '<button class="gp-add" type="button">加入購物車</button></div></div></div>';
    }).join('');
    // 已快取的卡片立即顯示 brief（不主動預抓，避免後端速率限制「請放慢操作速度」）
    [].forEach.call(grid.querySelectorAll('.gp-card'), function (c) {
      var psn = c.getAttribute('data-psn'), r = gpRules[psn];
      if (r) gpApplyBriefToCard(c, r);
    });
    gpSyncCount();
  }
  function gpApplyBriefToCard(card, rule) {
    var b = card.querySelector('.gp-brief'); if (!b) return;
    var txt = '';
    if (rule.brief) txt = '📌 ' + rule.brief;
    else if (rule.step > 1) txt = '📦 ' + rule.step + ' 個一組（最少 ' + rule.min + ' 件）';
    if (txt) { b.textContent = txt; b.classList.add('on'); }
  }
  /* 預抓已關閉(被 Shop2000 速率限制「請放慢操作速度」擋)。保留空函式避免舊呼叫炸錯。 */
  function gpKickPrefetch() {}
  function buildPrettyList() {
    if (document.getElementById('gp-wrap')) return;
    var items = gatherProducts(); if (items.length < 4) return; // 商品還沒載好就先不做
    // 若 URL 帶 ?kw=，初始化 gpFilter；之後 renderPrettyGrid 會做 AND 過濾（多關鍵字也能精確命中）
    if (gpFilter === null) {
      var kwM = location.search.match(/[?&]kw=([^&]*)/);
      if (kwM) gpFilter = gpTokenize(decodeURIComponent(kwM[1].replace(/\+/g, ' ')));
    }
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
        '.gp-brief{font-size:11.5px;color:#B12704;background:#FFF6E5;border:1px solid #FFE8B3;border-radius:6px;padding:4px 8px;margin:-2px 0 0;line-height:1.4;display:none}',
        '.gp-brief.on{display:block}',
        '.gp-row{display:flex;align-items:center;gap:8px;margin-top:auto}',
        '.gp-qty{display:flex;align-items:center;border:1px solid #d5d9d9;border-radius:8px}',
        '.gp-qty button{width:30px;height:34px;border:0;background:#f7f8f8;font-size:17px;font-weight:700;color:#0F1111;cursor:pointer}',
        '.gp-qty .n{width:42px;height:34px;text-align:center;font-size:14px;font-weight:700;border:0;border-left:1px solid #d5d9d9;border-right:1px solid #d5d9d9;background:#fff;color:#0F1111;-moz-appearance:textfield;outline:none;padding:0}',
        '.gp-qty .n::-webkit-outer-spin-button,.gp-qty .n::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}',
        '.gp-qty .n:focus{background:#FFF9E6}',
        /* 數字輪彈窗(1~500橫滑選) */
        '#gp-wheel{position:fixed;left:0;right:0;bottom:0;z-index:10001;background:#fff;border-top:1px solid #e3e6e6;box-shadow:0 -8px 22px rgba(0,0,0,.18);transform:translateY(100%);transition:transform .22s ease;padding:12px 0 14px}',
        '#gp-wheel.on{transform:translateY(0)}',
        '#gp-wheel-bd{display:none;position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.35)}#gp-wheel-bd.on{display:block}',
        '#gp-wheel-hd{display:flex;align-items:center;justify-content:space-between;padding:0 16px 10px}',
        '#gp-wheel-hd .t{font-size:14px;font-weight:800;color:#0F1111}',
        '#gp-wheel-hd .x{background:none;border:0;font-size:22px;line-height:1;color:#565959;cursor:pointer;padding:0 6px}',
        '#gp-wheel-strip{display:flex;gap:6px;overflow-x:auto;overflow-y:hidden;padding:6px 12px 4px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:thin}',
        '#gp-wheel-strip::-webkit-scrollbar{height:6px}#gp-wheel-strip::-webkit-scrollbar-thumb{background:#d5d9d9;border-radius:3px}',
        '#gp-wheel-strip .w{flex:0 0 auto;min-width:48px;height:46px;display:flex;align-items:center;justify-content:center;border:1px solid #e3e6e6;border-radius:10px;background:#fff;font-size:17px;font-weight:800;color:#0F1111;cursor:pointer;scroll-snap-align:center}',
        '#gp-wheel-strip .w:hover{background:#FFF9E6}',
        '#gp-wheel-strip .w.cur{background:#FFD814;border-color:#FFD814}',
        '#gp-wheel-hint{font-size:11.5px;color:#565959;text-align:center;margin-top:4px}',
        '.gp-add{flex:1;height:36px;border:0;border-radius:18px;background:#FFD814;color:#0F1111;font-weight:700;font-size:13px;cursor:pointer}',
        '.gp-add.added{background:#e7f6e7;color:#007600;border:1px solid #b6e0b6}',
        '#gp-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:9000;background:#FFD814;color:#0F1111;font-weight:800;font-size:15px;padding:13px 26px;border-radius:28px;box-shadow:0 8px 24px rgba(0,0,0,.28);border:0;cursor:pointer;display:flex;gap:10px;align-items:center}',
        '#gp-bar .c{background:#B12704;color:#fff;border-radius:20px;padding:2px 10px;font-size:13px}',
        '#gp-lb{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.88);display:none;align-items:center;justify-content:center;padding:16px;cursor:zoom-out}#gp-lb img{max-width:96%;max-height:92%;object-fit:contain;background:#fff;border-radius:8px}',
        /* 搜尋列 */
        '.gp-search{display:flex;align-items:center;gap:8px;padding:10px 0 6px;position:relative}',
        '.gp-search .gps-ic{position:absolute;left:12px;font-size:15px;font-style:normal;pointer-events:none}',
        '.gp-search input{flex:1;height:42px;border:1px solid #d5d9d9;border-radius:22px;padding:0 14px 0 36px;font-size:15px;outline:none;background:#fff;color:#0F1111}',
        '.gp-search input:focus{border-color:#FFB100;box-shadow:0 0 0 3px rgba(255,200,0,.18)}',
        '.gp-search #gp-kw-go{height:42px;padding:0 20px;border:0;border-radius:22px;background:#FFD814;color:#0F1111;font-weight:800;font-size:14px;cursor:pointer;flex:0 0 auto}',
        '.gp-search .gp-kw-clear{flex:0 0 auto;width:34px;height:42px;display:flex;align-items:center;justify-content:center;color:#888;text-decoration:none;font-size:16px}',
        '.gp-kw-tip{font-size:13px;color:#565959;padding:2px 2px 0}',
        /* 分類導覽列 */
        '.gc-nav{background:#fff;border-bottom:1px solid #eee;margin:0 -12px}',
        '.gc-mainrow,.gc-subrow{display:flex;gap:6px;overflow-x:auto;padding:8px 12px;-webkit-overflow-scrolling:touch;cursor:grab;user-select:none;-webkit-user-select:none;scroll-behavior:auto}',
        '.gc-mainrow.gc-dragging,.gc-subrow.gc-dragging{cursor:grabbing}',
        '.gc-mainrow.gc-dragging a,.gc-subrow.gc-dragging a{pointer-events:none}',
        '.gc-mainrow::-webkit-scrollbar,.gc-subrow::-webkit-scrollbar{height:0}',
        '.gc-m{flex:0 0 auto;padding:8px 15px;border-radius:20px;background:#f1f3f3;color:#0F1111!important;text-decoration:none;font-size:13.5px;font-weight:800;white-space:nowrap}',
        '.gc-m.on{background:#232F3E;color:#fff!important}',
        '.gc-m.gc-virtual{background:#FFF4E0;color:#B12704!important;border:1px dashed #FFB100}',
        '.gc-m.gc-virtual.on{background:#B12704;color:#fff!important;border-color:#B12704}',
        '.gc-subrow{border-top:1px solid #f3f3f3;background:#FAFAFA;padding-top:8px;padding-bottom:8px}',
        '.gc-s{flex:0 0 auto;padding:6px 12px;border-radius:16px;background:#fff;border:1px solid #e3e6e6;color:#565959!important;text-decoration:none;font-size:12.5px;white-space:nowrap}',
        '.gc-s.on{background:#FFD814;color:#0F1111!important;border-color:#FFD814;font-weight:700}',
        '.gc-s i{font-style:normal;color:#B12704;font-size:10px}'
      ].join('');
      document.head.appendChild(css);
    }
    // 隱藏所有原生商品清單(plist_tb 真清單 + plist_tb{數字}推薦區)，保留標題/排序/分頁
    var pls = document.querySelectorAll('[id^="plist_tb"]');
    for (var k = 0; k < pls.length; k++) pls[k].style.setProperty('display', 'none', 'important');
    var cont = productContainer();
    // 結構
    var mw = document.getElementById('main_width');
    var wrap = document.createElement('div'); wrap.id = 'gp-wrap';
    wrap.innerHTML =
      gpSearchBar() + gpCatNav() +
      '<div id="gp-head"><div class="t">精選商品</div><div class="s">選分類看主題 ・ 搜尋商品 ・ 點圖看大圖 ・ 選數量加入 ・ 總結帳一次結帳（換頁用本頁最下方頁碼）</div></div><div id="gp-grid"></div>';
    if (mw && mw.parentNode) mw.parentNode.insertBefore(wrap, mw); else document.body.appendChild(wrap);
    var bar = document.createElement('button'); bar.id = 'gp-bar'; bar.type = 'button';
    bar.innerHTML = '🛒 總結帳 <span class="c" id="gp-cnt">0</span> 件'; document.body.appendChild(bar);
    var lb = document.createElement('div'); lb.id = 'gp-lb'; lb.innerHTML = '<img>'; document.body.appendChild(lb);
    lb.addEventListener('click', function () { lb.style.display = 'none'; });
    bar.addEventListener('click', function () { try { if (typeof to_mycar1 === 'function') to_mycar1(); } catch (e) {} });

    // 數字輪(1~500 橫滑選)
    var wheelBd = document.createElement('div'); wheelBd.id = 'gp-wheel-bd';
    var wheel = document.createElement('div'); wheel.id = 'gp-wheel';
    wheel.innerHTML = '<div id="gp-wheel-hd"><div class="t">選數量</div><button class="x" type="button" aria-label="關閉">✕</button></div><div id="gp-wheel-strip"></div><div id="gp-wheel-hint">橫向滑動 → 點數字選取</div>';
    document.body.appendChild(wheelBd); document.body.appendChild(wheel);
    var wheelTarget = null; // 目前在編輯的 input.n
    function wheelClose() { wheel.classList.remove('on'); wheelBd.classList.remove('on'); wheelTarget = null; }
    wheelBd.addEventListener('click', wheelClose);
    wheel.querySelector('.x').addEventListener('click', wheelClose);
    function wheelOpen(input) {
      wheelTarget = input;
      var card = input.closest('.gp-card'); var psn = card ? card.getAttribute('data-psn') : '';
      var strip = document.getElementById('gp-wheel-strip');
      function render(rule) {
        var min = rule ? rule.min : 1, step = rule ? rule.step : 1;
        var cur = Math.max(min, +input.value || min);
        var html = ''; var count = 0;
        for (var v = min; v <= 999 && count < 500; v += step, count++) {
          html += '<div class="w' + (v === cur ? ' cur' : '') + '" data-v="' + v + '">' + v + '</div>';
        }
        strip.innerHTML = html;
        var hint = document.getElementById('gp-wheel-hint');
        if (hint) hint.textContent = step > 1 ? ('此商品 ' + step + ' 個一組 ・ 橫滑選數量') : '橫向滑動 → 點數字選取';
        setTimeout(function () {
          var c = strip.querySelector('.w.cur');
          if (c) strip.scrollLeft = c.offsetLeft - (strip.clientWidth / 2) + (c.offsetWidth / 2);
        }, 30);
      }
      strip.innerHTML = '<div style="padding:18px;color:#888;font-size:13px;">載入中…</div>';
      wheelBd.classList.add('on'); wheel.classList.add('on');
      if (psn) gpFetchRule(psn).then(render); else render(null);
    }
    document.getElementById('gp-wheel-strip').addEventListener('click', function (e) {
      var w = e.target.closest('.w'); if (!w || !wheelTarget) return;
      var v = +w.getAttribute('data-v'); wheelTarget.value = v;
      wheelClose();
    });

    function clampQty(v) { v = parseInt(v, 10); if (isNaN(v) || v < 1) v = 1; if (v > 500) v = 500; return v; }

    // 事件委派
    wrap.addEventListener('click', function (e) {
      var im = e.target.closest('.im');
      if (im) { lb.querySelector('img').src = im.getAttribute('data-full') || im.src; lb.style.display = 'flex'; return; }
      var card = e.target.closest('.gp-card'); if (!card) return;
      var n = card.querySelector('.n');
      if (e.target.classList.contains('inc') || e.target.classList.contains('dec')) {
        var psn1 = card.getAttribute('data-psn'), dir = e.target.classList.contains('inc') ? 1 : -1;
        gpFetchRule(psn1).then(function (rule) {
          gpApplyBriefToCard(card, rule);
          var step = rule.step || 1, min = rule.min || 1;
          var cur = +n.value || min, next;
          if (cur < min) next = min; // 還沒到最低門檻 → +/- 都先到 min
          else {
            var off = (cur - min) % step;
            if (off !== 0) next = dir > 0 ? (cur - off + step) : (cur - off); // 不在序列上先吸附
            else next = cur + dir * step;
          }
          if (next < min) next = min;
          n.value = clampQty(next);
        });
        return;
      }
      if (e.target === n) { wheelOpen(n); return; } // 點數字 → 開輪
      if (e.target.classList.contains('gp-add')) {
        var btn = e.target; if (btn.disabled) return;
        var psn = card.getAttribute('data-psn');
        var qty = clampQty(n.value || 1);
        // 若已知規則(用戶碰過數量)且需倍數 → 順手吸附到合法值，不阻擋、不詢問
        var cr = gpRules[psn];
        if (cr && cr.step > 1) { qty = gpRoundQty(qty, cr); n.value = qty; }
        // 直接加入：mycar_bk 對所有商品都有效(即使前台沒渲染訂購鈕)，不再判詢價
        ensureBuyct(qty);
        try { if (typeof mycar_bk === 'function') { mycar_bk(psn); if (typeof clear_buyTxt === 'function') setTimeout(clear_buyTxt, 900); } } catch (er) {}
        var origTxt = '加入購物車';
        btn.classList.add('added'); btn.textContent = '✓ 已加入 ' + qty + ' 件';
        setTimeout(function () { btn.classList.remove('added'); btn.textContent = origTxt; }, 1500);
        setTimeout(gpSyncCount, 1200);
      }
    });
    // 搜尋：Enter 或按鈕 → 在分類內客戶端 AND 過濾；不在分類內走 Shop2000 原生搜尋
    wrap.addEventListener('keydown', function (e) { if (e.target.id === 'gp-kw' && e.key === 'Enter') { e.preventDefault(); gpDoSearch(); } });
    wrap.addEventListener('click', function (e) {
      if (e.target.id === 'gp-kw-go') gpDoSearch();
      else if (e.target.id === 'gp-kw-clear-btn') {
        e.preventDefault();
        gpFilter = null;
        var inp = document.getElementById('gp-kw'); if (inp) inp.value = '';
        var m = location.pathname.match(/\/product\/(\d+)(?:\/(\d+))?/);
        if (location.search) location.href = m ? location.pathname : '/product';
        else { renderPrettyGrid(gatherProducts()); refreshSearchBar(); }
      }
    });
    // 手打數字後立刻規格化(失焦/按Enter)
    wrap.addEventListener('change', function (e) { if (e.target.classList.contains('n')) e.target.value = clampQty(e.target.value); });
    wrap.addEventListener('keydown', function (e) { if (e.target.classList.contains('n') && e.key === 'Enter') { e.target.value = clampQty(e.target.value); e.target.blur(); } });
    renderPrettyGrid(items);
    // 桌面拖曳橫向滾動分類列（Windows 無觸控滑修補）
    [].forEach.call(wrap.querySelectorAll('.gc-mainrow, .gc-subrow'), attachDragScroll);
    setInterval(gpSyncCount, 1500);
    // 不再做卡片預抓/捲動補抓（被 Shop2000 速率限制擋住）；brief 改為使用者按 +/- 或加入時順手抓單筆
    // #plist_tb(真正商品清單)常晚於推薦區載入/換頁也會換 → 觀察整個 #main_width，
    // 一變動就重新隱藏原生清單 + 用 #plist_tb 重建格子。(#gp-wrap 在 #main_width 外，不會觸發迴圈)
    var watch = document.getElementById('main_width') || document.body;
    var t; var obs = new MutationObserver(function () {
      clearTimeout(t); t = setTimeout(function () {
        var pls2 = document.querySelectorAll('[id^="plist_tb"]');
        for (var k = 0; k < pls2.length; k++) pls2[k].style.setProperty('display', 'none', 'important');
        var it = gatherProducts(); if (it.length) renderPrettyGrid(it);
      }, 300);
    });
    try { obs.observe(watch, { childList: true, subtree: true }); } catch (e) {}
  }
  function tryPrettyList() {
    // 商品(img.pimg)常較晚載入，輪詢最多 ~8 秒
    var tries = 0;
    var iv = setInterval(function () {
      if (document.getElementById('gp-wrap')) { clearInterval(iv); return; }
      if ((document.getElementById('plist_tb') || document).querySelectorAll('img.pimg').length >= 4) { clearInterval(iv); buildPrettyList(); }
      else if (tries++ > 16) clearInterval(iv);
    }, 500);
  }

  // 商品頁通用頂部會員列：未登入也能看到首頁/查訂單/會員登入入口（不依賴有沒有商品）
  function buildProductTopbar() {
    if (document.getElementById('gp-topbar')) return;
    var mw = document.getElementById('main_width');
    if (!mw || !mw.parentNode) return;
    var bar = document.createElement('div');
    bar.id = 'gp-topbar';
    bar.innerHTML =
      '<a class="tb-home" href="https://grand.shop2000.com.tw/">🏠 首頁</a>' +
      '<a href="' + ORDER + '">📋 查訂單</a>' +
      '<a href="' + LOGIN + '">👤 會員登入 ／ 加入會員</a>';
    mw.parentNode.insertBefore(bar, mw);
  }

  function run() {
    ensureViewport();
    // 店長已登入 → 皮膚讓位，直接用舊系統管理（含工具列較晚載入，下方再輪詢補偵測）
    if (isBoss()) { bossStepAside(); return; }
    injectCSS();
    if (isHome()) buildLanding();
    else if (isProductListPage()) { buildProductTopbar(); tryPrettyList(); }
    else buildMemberPanel();
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
