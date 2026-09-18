// ISSUE-202 隔離驗收：從 shop-skin.js 抽出真實的 gpDetailAddImage / gpDetailImgstrSeq / gpParseDetail
// 在無頭 Chromium 空白頁用 DOMParser 跑 fixture，不碰正式站、不打 Shop2000。
// 執行：node grand_store/test_issue202_detail_images.mjs
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
const bundle = ['gpDetailRow', 'gpDetailAddImage', 'gpDetailImgstrSeq', 'gpParseDetail'].map(extractFn).join('\n') +
  '\nwindow.__parse = function (html, psn, fallback) { var doc = new DOMParser().parseFromString(html, "text/html"); return gpParseDetail(doc, psn, fallback || {}).images; };';

const PSN = '52488689';
const BASE = 'https://img2.shop2000.com.tw/75210/p488/';
const staticImg = `<img class="shadow8" src="${BASE}${PSN}-5.jpg">`;
const page = (body, script) => `<html><head><title>ROOMMATE 輕巧型手部按摩機HEHDM001</title></head><body>${body}<div id="imgArea0"></div><script>${script}</script></body></html>`;
// 與正式站 2026-09-18 實測相同的 Shop2000 腳本片段（showPage 只在瀏覽器執行，DOMParser 不會跑）
const shop2000Script = (imgstr) => `function showPage(p0){ var imgHtml=''; for(var i=p0*10;i<(p0*10+10);i++){ if(i==imgCount){break;} var gno=noArr[i].replace(/\\|/g,''); imgHtml=imgHtml+'<br><img class=shadow8 src=${BASE}${PSN}-'+gno+'o.jpg >'; } $('#imgArea0').html(imgHtml); } var imgstr = '${imgstr}'; noArr = imgstr.split('||'); var imgCount = noArr.length; showPage(0);`;
const o = (n) => `${BASE}${PSN}-${n}o.jpg`;

const browser = await chromium.launch();
const pg = await browser.newPage();
await pg.goto('about:blank');
await pg.addScriptTag({ content: bundle });
const parse = (html, psn = PSN, fallback = {}) => pg.evaluate(([h, p, f]) => window.__parse(h, p, f), [html, psn, fallback]);

let passed = 0;
const it = async (name, fn) => { await fn(); passed++; console.log('✅', name); };

await it('1. 七圖 fixture：imgstr |5||1||2||3||4||6||7| → 7 張、順序相同、無重複', async () => {
  const imgs = await parse(page(staticImg, shop2000Script('|5||1||2||3||4||6||7|')));
  assert.deepEqual(imgs, ['5', '1', '2', '3', '4', '6', '7'].map(o));
});

await it('2. 主圖已是 5o 且 imgstr 第一張也是 5：只出現一次', async () => {
  const imgs = await parse(page(`<img src="${BASE}${PSN}-5o.jpg">`, shop2000Script('|5||1|')));
  assert.deepEqual(imgs, [o('5'), o('1')]);
  assert.equal(new Set(imgs).size, imgs.length);
});

await it('3. 單圖 HTML、沒有 imgstr：維持 1 張', async () => {
  const imgs = await parse(page(staticImg, 'var other = 1;'));
  assert.deepEqual(imgs, [o('5')]);
});

await it('3b. 單圖商品但 Shop2000 仍給 imgstr |1|：仍 1 張', async () => {
  const imgs = await parse(page(`<img src="${BASE}${PSN}-1.jpg">`, shop2000Script('|1|')));
  assert.deepEqual(imgs, [o('1')]);
});

await it('4. imgstr 空白／破損／夾非數字：不猜 URL，維持 1 張主圖', async () => {
  for (const bad of ['', '|', '|5||a||2|', '|5||2|;alert(1)', '|5||../../x|', '|5||' + '9'.repeat(8) + '|']) {
    const imgs = await parse(page(staticImg, `var imgstr = '${bad}'; noArr = imgstr.split('||');`));
    assert.deepEqual(imgs, [o('5')], `imgstr=${JSON.stringify(bad)}`);
  }
  // 超過 100 張 fail closed
  const huge = Array.from({ length: 101 }, (_, i) => `|${i + 1}|`).join('|');
  assert.deepEqual(await parse(page(staticImg, shop2000Script(huge))), [o('5')]);
});

await it('4b. imgstr 不是 var 宣告或不是純字串字面值：不執行、不採用', async () => {
  for (const s of [`var imgstr = getImgs();`, `imgstr = '|5||1|';`, `var imgstr = "|5" + "||1|";`]) {
    assert.deepEqual(await parse(page(staticImg, s)), [o('5')], s);
  }
});

await it('5. 他店／不同 psn 的圖片不得混入，也不得拿它當 base', async () => {
  const other = `<img src="https://img2.shop2000.com.tw/99999/p1/11111111-1.jpg">`;
  assert.deepEqual(await parse(page(other + staticImg, shop2000Script('|5||1|'))), [o('5'), o('1')]);
  // 頁面只有別商品的圖：別商品不可當 base；列表 fallback 主圖本身含 /psn- 才可推導，且主圖不重複
  const imgs = await parse(page(other, shop2000Script('|5||1|')), PSN, { img: `${BASE}${PSN}-5.jpg` });
  assert.deepEqual(imgs, [o('5'), o('1')]);
  // fallback 不是本商品圖（例如佔位圖）：不推導
  assert.deepEqual(await parse(page(other, shop2000Script('|5||1|')), PSN, { img: 'https://cdn.example/placeholder.jpg' }), ['https://cdn.example/placeholder.jpg']);
});

await it('6. 沒有任何同 psn 圖也沒 fallback：空陣列（原行為不變）', async () => {
  assert.deepEqual(await parse(page('', shop2000Script('|5||1|'))), []);
});

await browser.close();
console.log(`\n全部通過 ${passed} 組`);
