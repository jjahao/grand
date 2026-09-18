// ISSUE-203 隔離驗收：從 shop-skin.js 抽出真實的分頁解析／adapter／renderer／手勢函式，
// 在無頭 Chromium 的 DOM fixture 上跑；不連正式站、不打 Shop2000、不碰購物車。
// 原生分頁模擬 2026-09-18 正式站實測結構：<ul class="pgNo"><li class="dis" to_p="1">1</li><li to_p="2">2</li>…
// 每個 li 綁 click → p=to_p; sendPage()（正式站是 jQuery 綁的，這裡用原生 addEventListener 等價模擬並計數）。
// 手勢測試分兩層：一般 dx/dy 門檻與 overlay 情境用 JS 建構的 Touch 事件（swipe，touchmove/touchend 全程沿用
// touchstart 的同一個 target，如實反映裝置行為，不再偽造終點 target）；終點是否落在互動元件則用真 Chromium/CDP
// 觸控輸入（realSwipe，Input.dispatchTouchEvent）讓瀏覽器對座標做真實 hit-test，對應 ISSUE-203 覆核抓到的
// P0 缺口：touchend.target 恆等於起點，程式必須用 document.elementFromPoint(x,y) 才認得出手指實際放開的位置。
// 執行：node grand_store/test_issue203_pagination.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, 'shop-skin.js'), 'utf8');

function extractFn(name) {
  const start = src.indexOf(`  function ${name}(`);
  assert.ok(start >= 0, `找不到 ${name}`);
  const end = src.indexOf('\n  }\n', start);
  return src.slice(start, end + 4);
}
function extractVar(re) { const m = src.match(re); assert.ok(m, `找不到變數 ${re}`); return m[0]; }

const bundle = [
  'var gpFilter = null; var __diag = []; function gpDiag(tag, data) { __diag.push({ tag: tag, data: data }); }',
  extractVar(/  var GP_PG_JUMP_KEY = [^\n]+/), extractVar(/  var gpPageNavBusy = [^\n]+/),
  extractVar(/  var GP_SWIPE_MIN = [^\n]+/), extractVar(/  var GP_SWIPE_SKIP = [^\n]+/),
  ...['gpNativeTotal', 'gpReadNativePaging', 'gpGoNativePage', 'gpPagerHTML', 'gpRenderPagers', 'gpOverlayOpen', 'gpSwipeTargetOk', 'gpAttachListSwipe', 'gpAttachPagerClicks'].map(extractFn),
  `window.__gp = { read: function () { return gpReadNativePaging(document, window); }, go: gpGoNativePage, render: gpRenderPagers, attach: gpAttachListSwipe, attachClicks: gpAttachPagerClicks,
     setFilter: function (f) { gpFilter = f; }, resetBusy: function () { gpPageNavBusy = false; }, diag: __diag,
     parse: function (html) { var d = new DOMParser().parseFromString(html, 'text/html'); return gpReadNativePaging(d, {}); } };`
].join('\n');

const CARD = (psn) => `<div class="gp-card" data-psn="${psn}"><div class="gp-imw"><img class="im" src="x"><button class="gp-track" data-psn="${psn}">♡</button></div><div class="gp-bd"><button class="gp-nm" type="button">商品 ${psn}</button><div class="gp-dlv">日本直送</div><div class="gp-row"><div class="gp-qty"><button class="dec">−</button><input class="n" type="number" value="1"><button class="inc">＋</button></div><button class="gp-add">加入購物車</button></div></div></div>`;
const cards = (n) => Array.from({ length: n }, (_, i) => CARD(String(1000 + i))).join('');
function nativeUl(cur, max) {
  const li = [];
  for (let n = 1; n <= max; n++) li.push(`<li${n === cur ? ' class="dis"' : ''} to_p="${n}">${n}</li>`);
  if (cur < max) li.push(`<li to_p="${cur + 1}"><lg class="pt11">下頁</lg></li>`);
  return `<ul class="pgNo pgSet">${li.join('')}</ul>`;
}
function fixture({ cur = 1, max = 3, total = 86, native, extraBody = '' } = {}) {
  const ul = native !== undefined ? native : nativeUl(cur, max);
  return `<html><body>
  <div id="gp-wrap">
    <div class="gp-search"><input id="gp-kw"></div>
    <div class="gc-nav"><div class="gc-mainrow" style="width:200px;overflow-x:auto"><a class="gc-m" href="#">分類A</a><a class="gc-m" href="#">分類B</a></div><div class="gc-subrow"><a class="gc-s" href="#">小類</a></div></div>
    <div id="gp-head"><div class="t">精選商品</div></div>
    <div id="gp-pager-top"></div>
    <div id="gp-grid" style="height:400px">
      <div id="gp-probe-row" style="display:flex;align-items:center;height:56px;white-space:nowrap">
        <div id="gp-probe-blank" style="display:inline-block;width:120px;height:56px"></div>
        <img class="im" id="gp-probe-img" src="x" style="display:inline-block;width:40px;height:56px">
        <button class="gp-nm" id="gp-probe-nm" type="button" style="display:inline-block;width:60px;height:56px">名稱</button>
        <div class="gp-qty" id="gp-probe-qty" style="display:inline-block;width:50px;height:56px"><button class="inc" style="width:50px;height:56px">＋</button></div>
        <button class="gp-add" id="gp-probe-add" type="button" style="display:inline-block;width:80px;height:56px">加入購物車</button>
      </div>
      ${cards(8)}
    </div>
    <div id="gp-pager-bottom"></div>
  </div>
  <div id="main_width"><form name="form1"><div id="page_div">${ul}${max > 1 ? '' : ''}<div class="pgCount">${total ? `共 ${total} 筆` : ''}</div></div></form></div>
  <div id="gp-wheel"><div id="gp-wheel-strip"><div class="w">1</div><div class="w">2</div></div></div>
  <div id="gp-detail" hidden><div class="gpd-stage"><img src="x"></div></div>
  <div id="gp-lb" style="display:none"><img></div>
  ${extraBody}
  <script>
    window.p = '${cur}'; window.RecordCount = '${total}'; window.__sent = []; window.__nativeClicks = [];
    function sendPage(){ window.__sent.push(String(window.p)); }
    document.querySelectorAll('li[to_p]').forEach(function (li) { li.addEventListener('click', function () { window.p = this.getAttribute('to_p'); window.__nativeClicks.push(window.p); sendPage(); }); });
    // 分類列／數字輪／商品詳情各自的原生橫向行為計數（用來證明沒被商品分頁手勢攔截）
    window.__own = { cat: 0, wheel: 0, detail: 0 };
    document.querySelector('.gc-mainrow').addEventListener('touchend', function () { window.__own.cat++; }, { passive: true });
    document.getElementById('gp-wheel-strip').addEventListener('touchend', function () { window.__own.wheel++; }, { passive: true });
    document.querySelector('.gpd-stage').addEventListener('touchend', function () { window.__own.detail++; }, { passive: true });
  </script></body></html>`;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const pg = await ctx.newPage();
let passed = 0;
const it = async (name, fn) => { await fn(); passed++; console.log('✅', name); };

async function load(opts) {
  await pg.setContent(fixture(opts));
  await pg.addScriptTag({ content: bundle });
  await pg.evaluate(() => { window.__gp.render(); window.__gp.attachClicks(document.getElementById('gp-wrap')); window.__gp.attach(document.getElementById('gp-wrap'), function (n, s) { window.__gp.go(n, s); }); });
}
const pagerState = (pos) => pg.evaluate((pos) => {
  const nav = document.querySelector(`#gp-pager-${pos} .gp-pager`); if (!nav) return null;
  const q = (s) => nav.querySelector(s);
  return {
    merged: nav.classList.contains('gp-pager-merged'), text: nav.textContent.replace(/\s+/g, ' ').trim(),
    prevDisabled: q('.gp-pg-prev') ? q('.gp-pg-prev').disabled : null, nextDisabled: q('.gp-pg-next') ? q('.gp-pg-next').disabled : null,
    info: q('.gp-pg-info') ? q('.gp-pg-info').textContent : null,
    nums: [...nav.querySelectorAll('.gp-pg-num')].map((b) => b.textContent), current: (q('[aria-current="page"]') || {}).textContent || null,
    total: q('.gp-pg-total') ? q('.gp-pg-total').textContent : null
  };
}, pos);
const sent = () => pg.evaluate(() => ({ sent: window.__sent, native: window.__nativeClicks, p: window.p }));
const click = (pos, sel) => pg.evaluate(([pos, sel]) => { const b = document.querySelector(`#gp-pager-${pos} ${sel}`); if (!b) return 'missing'; b.click(); return b.disabled ? 'disabled' : 'clicked'; }, [pos, sel]);
// 用真 Touch 事件（clientX/Y）模擬手指：start 在 from、end 在 to；startSel 指定起手元素（touchstart 的
// e.target＝真實觸控起點，如實模擬）。touchmove/touchend 一律沿用同一個 Touch 物件的 target（等同真裝置：
// 同一指頭全程 target 不變），不再另外偽造終點 target——這正是 ISSUE-203 P0 缺口的根因：真實 touchend.target
// 永遠是起點元素，程式必須改用 elementFromPoint(x,y) 才能認出手指實際放開的位置。
const swipe = (from, to, startSel = '#gp-grid') => pg.evaluate(([from, to, startSel]) => {
  const mk = (type, el, x, y) => new TouchEvent(type, { bubbles: true, cancelable: true, touches: type === 'touchend' ? [] : [new Touch({ identifier: 7, target: el, clientX: x, clientY: y })], changedTouches: [new Touch({ identifier: 7, target: el, clientX: x, clientY: y })] });
  const s = document.querySelector(startSel);
  s.dispatchEvent(mk('touchstart', s, from[0], from[1]));
  s.dispatchEvent(mk('touchmove', s, (from[0] + to[0]) / 2, (from[1] + to[1]) / 2));
  s.dispatchEvent(mk('touchend', s, to[0], to[1]));
}, [from, to, startSel]);
const resetBusy = () => pg.evaluate(() => window.__gp.resetBusy());
// 真 Chromium/CDP 觸控輸入（非 JS 建構的 Touch 物件）：由瀏覽器對 (x,y) 做真實 hit-test，
// touchend 的 target／changedTouches 座標完全比照實機，用來驗證 elementFromPoint 那條修法。
let cdp;
async function realSwipe(from, to) {
  if (!cdp) cdp = await ctx.newCDPSession(pg);
  const pt = (x, y) => ({ x, y, radiusX: 5, radiusY: 5, force: 1 });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pt(from[0], from[1])] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [pt((from[0] + to[0]) / 2, (from[1] + to[1]) / 2)] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [pt(to[0], to[1])] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}
const probeRect = (sel) => pg.evaluate((sel) => {
  const r = document.querySelector(sel).getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}, sel);

await it('1. 86 筆／3 頁／第 1 頁：頂底同一組「上一頁 disabled｜第 1 / 3 頁｜1 2 3｜下一頁」', async () => {
  await load({ cur: 1, max: 3, total: 86 });
  const top = await pagerState('top'), bot = await pagerState('bottom');
  assert.deepEqual(top, bot);
  assert.equal(top.prevDisabled, true); assert.equal(top.nextDisabled, false);
  assert.equal(top.info, '第 1 / 3 頁'); assert.deepEqual(top.nums, ['1', '2', '3']); assert.equal(top.current, '1'); assert.equal(top.total, '共 86 筆');
});

await it('2. 點頂部下一頁／底部 3／上一頁：各只觸發對應原生 to_p 一次、同一頁壽命只送一次', async () => {
  await load({ cur: 1, max: 3 });
  assert.equal(await click('top', '.gp-pg-next'), 'clicked');
  assert.deepEqual(await sent(), { sent: ['2'], native: ['2'], p: '2' });
  assert.equal(await click('bottom', '.gp-pg-num[data-page="3"]'), 'clicked'); // busy 鎖：整頁 POST 中不再送
  assert.deepEqual((await sent()).sent, ['2']);
  await load({ cur: 2, max: 3 });
  assert.equal(await click('bottom', '.gp-pg-num[data-page="3"]'), 'clicked');
  assert.deepEqual((await sent()).native, ['3']);
  await load({ cur: 2, max: 3 });
  assert.equal(await click('bottom', '.gp-pg-prev'), 'clicked');
  assert.deepEqual((await sent()).native, ['1']);
  assert.equal(await click('top', '.gp-pg-num[data-page="2"]'), 'clicked'); // 目前頁不送
  assert.deepEqual((await sent()).native, ['1']);
});

await it('3. 第 3 頁：下一頁 disabled、左滑不循環；右滑只觸發第 2 頁一次', async () => {
  await load({ cur: 3, max: 3 });
  const top = await pagerState('top');
  assert.equal(top.nextDisabled, true); assert.equal(top.prevDisabled, false); assert.equal(top.current, '3');
  assert.equal(await click('top', '.gp-pg-next'), 'disabled');
  await swipe([300, 300], [100, 305]);
  assert.deepEqual((await sent()).native, []);
  await swipe([100, 300], [200, 310]);
  await swipe([100, 300], [200, 310]);
  assert.deepEqual((await sent()).native, ['2']);
});

await it('4. 只有 1 頁（無 [to_p]）：第 1 / 1 頁、兩側 disabled、任何方向滑都不翻頁', async () => {
  await load({ cur: 1, max: 1, total: 12, native: '' });
  const top = await pagerState('top'), bot = await pagerState('bottom');
  assert.deepEqual(top, bot);
  assert.equal(top.info, '第 1 / 1 頁'); assert.equal(top.prevDisabled, true); assert.equal(top.nextDisabled, true); assert.deepEqual(top.nums, ['1']);
  await swipe([300, 300], [100, 300]); await swipe([100, 300], [300, 300]);
  assert.deepEqual((await sent()).sent, []);
});

await it('5. 缺 RecordCount／缺部分 to_p／重複頁碼／非數字 to_p／讀不到目前頁：不猜錯頁、不白頁', async () => {
  const parse = (html) => pg.evaluate((h) => window.__gp.parse(h), html);
  // 缺 RecordCount 與「共 N 筆」：頁數仍對，total 0（不顯示筆數而非亂猜）
  let s = await parse('<ul><li class="dis" to_p="1">1</li><li to_p="2">2</li></ul>');
  assert.deepEqual({ ok: s.ok, cur: s.cur, max: s.max, total: s.total, pages: s.pages }, { ok: true, cur: 1, max: 2, total: 0, pages: [1, 2] });
  // 缺部分 to_p（正式站超過 10 頁只列部分頁碼 + >>17）：只畫存在的頁碼，總頁數取最大值
  s = await parse('<ul><li to_p="1">1</li><li class="dis" to_p="5">5</li><li to_p="6">6</li><li to_p="17">>>17</li></ul>');
  assert.deepEqual({ cur: s.cur, max: s.max, pages: s.pages }, { cur: 5, max: 17, pages: [1, 5, 6, 17] });
  // 重複頁碼（頂底兩組原生列）＋ 非數字 to_p：去重、忽略壞值
  s = await parse('<ul><li class="dis" to_p="1">1</li><li to_p="2">2</li><li to_p="abc">?</li></ul><ul><li class="dis" to_p="1">1</li><li to_p="2">2</li><li to_p="2">下頁</li></ul>');
  assert.deepEqual({ cur: s.cur, max: s.max, pages: s.pages }, { cur: 1, max: 2, pages: [1, 2] });
  // 讀不到目前頁（沒有 li.dis、沒有全域 p）且多頁：ok=false → 不畫可點頁碼、不接手勢
  s = await parse('<ul><li to_p="1">1</li><li to_p="2">2</li></ul>');
  assert.equal(s.ok, false);
  await load({ cur: 1, max: 3, native: '<ul class="pgNo"><li to_p="1">1</li><li to_p="2">2</li><li to_p="3">3</li></ul>' });
  await pg.evaluate(() => { window.p = undefined; window.__gp.render(); });
  assert.equal(await pagerState('top'), null); assert.equal(await pagerState('bottom'), null);
  await swipe([300, 300], [100, 300]);
  assert.deepEqual((await sent()).sent, []);
  assert.equal(await pg.evaluate(() => document.querySelectorAll('#gp-grid .gp-card').length), 8); // 商品列表仍在
  // 只有全域 p、沒有 li.dis：目前頁退用 p
  await load({ cur: 2, max: 3, native: '<ul class="pgNo"><li to_p="1">1</li><li to_p="2">2</li><li to_p="3">3</li></ul>' });
  assert.equal((await pagerState('top')).current, '2');
});

await it('6. 水平 60px 換頁；30px、垂直、斜滑、按住互動元件滑動皆不換頁', async () => {
  await load({ cur: 2, max: 3 });
  await swipe([200, 300], [170, 300]); // 30px
  await swipe([200, 300], [200, 100]); // 垂直
  await swipe([200, 300], [120, 220]); // 斜滑 80/80，不到 1.5 倍
  for (const sel of ['#gp-grid .gp-card .im', '#gp-grid .gp-nm', '#gp-grid .gp-track', '#gp-grid input.n', '#gp-grid .dec', '#gp-grid .inc', '#gp-grid .gp-add']) {
    await swipe([200, 300], [100, 300], sel);   // 起點在互動元件（真實 touchstart target）
  }
  assert.deepEqual((await sent()).sent, []);
  // 終點在互動元件的情形改用真實 CDP 觸控座標驗證，見測項 10。
  await swipe([200, 300], [140, 305]); // 60px 左滑 → 下一頁 3
  assert.deepEqual((await sent()).native, ['3']);
  await resetBusy(); await load({ cur: 2, max: 3 });
  await swipe([100, 300], [160, 290]); // 60px 右滑 → 上一頁 1
  assert.deepEqual((await sent()).native, ['1']);
  // 兩指觸控不算
  await load({ cur: 2, max: 3 });
  await pg.evaluate(() => {
    const g = document.getElementById('gp-grid');
    const t = (id, x) => new Touch({ identifier: id, target: g, clientX: x, clientY: 300 });
    g.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [t(1, 200), t(2, 220)], changedTouches: [t(1, 200), t(2, 220)] }));
    g.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [t(1, 100)] }));
  });
  assert.deepEqual((await sent()).sent, []);
});

await it('7. 分類橫滑、數字輪橫滑、商品詳情多圖左右滑各自照舊，商品頁分頁計數 0', async () => {
  await load({ cur: 2, max: 3 });
  await swipe([180, 60], [40, 62], '.gc-mainrow');
  await pg.evaluate(() => document.getElementById('gp-wheel').classList.add('on'));
  await swipe([300, 800], [100, 800], '#gp-wheel-strip');
  await pg.evaluate(() => { document.getElementById('gp-wheel').classList.remove('on'); const d = document.getElementById('gp-detail'); d.hidden = false; document.body.classList.add('gpd-open'); });
  await swipe([300, 400], [100, 400], '.gpd-stage');
  await swipe([300, 300], [100, 300]); // overlay 開著時背景列表也不翻
  assert.deepEqual(await pg.evaluate(() => window.__own), { cat: 1, wheel: 1, detail: 1 });
  assert.deepEqual((await sent()).sent, []);
  // 燈箱開著也不翻
  await pg.evaluate(() => { document.getElementById('gp-detail').hidden = true; document.body.classList.remove('gpd-open'); document.getElementById('gp-lb').style.display = 'flex'; });
  await swipe([300, 300], [100, 300]);
  assert.deepEqual((await sent()).sent, []);
});

await it('8. 搜尋合併模式：不顯示可操作假頁碼，左右滑不觸發原生翻頁（合併結果不丟）', async () => {
  await load({ cur: 1, max: 3 });
  await pg.evaluate(() => { window.__gp.setFilter(['mdm', '禮盒']); window.__gp.render(); });
  const top = await pagerState('top'), bot = await pagerState('bottom');
  assert.equal(top.merged, true); assert.equal(bot.merged, true);
  assert.equal(await pg.evaluate(() => document.querySelectorAll('.gp-pager button').length), 0);
  await swipe([300, 300], [100, 300]);
  assert.deepEqual((await sent()).sent, []);
  assert.equal(await pg.evaluate(() => document.querySelectorAll('#gp-grid .gp-card').length), 8);
  await pg.evaluate(() => { window.__gp.setFilter(['mdm']); window.__gp.render(); });
  assert.equal((await pagerState('top')).merged, true); // 單關鍵字皮膚同樣背景合併分頁（gpExpandMultiPage 對任何 gpFilter 都跑）
});

await it('9. 390 寬不橫向溢出、上一頁／下一頁點擊區 ≥44px、aria-current 正確', async () => {
  await load({ cur: 2, max: 3 });
  await pg.addStyleTag({ content: src.match(/'\.gp-pager\{[^\n]+',\n[\s\S]*?'@media\(max-width:759px\)\{\.gp-pager[^\n]+',/)[0].replace(/^\s*'|',\s*$/gm, '').replace(/',\n\s*'/g, '\n').replace(/\/\*.*?\*\/\n?/g, '') });
  const m = await pg.evaluate(() => {
    const r = (s) => document.querySelector(s).getBoundingClientRect();
    return { scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth, prevH: r('#gp-pager-top .gp-pg-prev').height, nextH: r('#gp-pager-bottom .gp-pg-next').height, cur: document.querySelectorAll('[aria-current="page"]').length };
  });
  assert.ok(m.scrollW <= m.innerW, `橫向溢出 ${m.scrollW} > ${m.innerW}`);
  assert.ok(m.prevH >= 44 && m.nextH >= 44, `點擊區高度 ${m.prevH}/${m.nextH}`);
  assert.equal(m.cur, 2); // 頂底各一個
});

await it('10. 真實 CDP 觸控（非 JS 偽造 target）：空白起手→終點精準落在加入購物車／照片／名稱／數量按鈕：0 次翻頁', async () => {
  await load({ cur: 2, max: 3 });
  const blank = await probeRect('#gp-probe-blank');
  for (const sel of ['#gp-probe-add', '#gp-probe-img', '#gp-probe-nm', '#gp-probe-qty .inc']) {
    const target = await probeRect(sel);
    await realSwipe([blank.x, blank.y], [target.x, target.y]);
  }
  assert.deepEqual((await sent()).sent, [], '終點落在互動元件上仍翻頁，ISSUE-203 P0 缺口未修好');
});

await it('11. 真實 CDP 觸控：空白區起手→空白區終點且水平 ≥50px：正常翻頁 1 次', async () => {
  await load({ cur: 2, max: 3 });
  const r = await pg.evaluate(() => {
    const b = document.getElementById('gp-probe-blank').getBoundingClientRect();
    return { left: b.left, right: b.right, y: b.top + b.height / 2 };
  });
  await realSwipe([r.right - 5, r.y], [r.left + 5, r.y]); // 左滑 → 下一頁
  assert.deepEqual((await sent()).native, ['3']);
});

await browser.close();
console.log(`\n全部通過：${passed} 項`);
