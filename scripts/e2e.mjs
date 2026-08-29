import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const SS='/tmp/claude-0/-home-user-Cooking/cb874458-bcde-5ee3-943b-640fd66124e3/scratchpad/';
const BASE='http://localhost:4173';
const b = await chromium.launch();
const fails=[]; const ok=[];
function check(name, cond, extra=''){ (cond?ok:fails).push(name+(extra?` (${extra})`:'')); }

// ---------- desktop ----------
const p = await b.newPage({viewport:{width:1280,height:900}});
const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
await p.goto(BASE+'/',{waitUntil:'networkidle'});
check('dashboard renders', (await p.locator('h1').first().innerText()).includes('Kitchen Lab'));

// navigate to a module via sidebar
await p.click('a[href="/module/proteins"]');
await p.waitForTimeout(600);
check('module route', p.url().endsWith('/module/proteins'), p.url());
const h1 = await p.locator('main h1').first().innerText();
check('module content loaded (lazy chunk)', h1.length>5, h1);
const blocks = await p.locator('.block').count();
check('trackable blocks rendered', blocks>0, blocks+' blocks');
const figs = await p.locator('main figure svg').count();
check('SVG diagrams preserved', figs>0, figs+' svg');

// progress: mark done, reload, confirm persisted
const firstBlockId = await p.locator('.block').first().getAttribute('id');
await p.locator('.block').first().locator('button[aria-pressed]').click();
await p.waitForTimeout(150);
const pressed = await p.locator('.block').first().locator('button[aria-pressed]').getAttribute('aria-pressed');
check('mark done toggles', pressed==='true');
await p.reload({waitUntil:'networkidle'});
await p.waitForTimeout(700);
const stillDone = await p.locator(`[id="${firstBlockId}"]`).locator('button[aria-pressed]').getAttribute('aria-pressed').catch(()=>null);
check('progress survives reload', stillDone==='true', 'id='+firstBlockId);

// language switch keeps progress (same id) and translates content
await p.click('button:has-text("ES")');
await p.waitForTimeout(800);
const esH1 = await p.locator('main h1').first().innerText();
check('ES content differs from EN', esH1!==h1, `${h1} -> ${esH1}`);
const esDone = await p.locator(`[id="${firstBlockId}"]`).locator('button[aria-pressed]').getAttribute('aria-pressed').catch(()=>null);
check('progress shared across languages', esDone==='true');
const navEs = await p.locator('.nav__t').first().innerText();
check('nav labels translated', /Panel|Temario/.test(navEs), navEs);
await p.click('button:has-text("EN")');
await p.waitForTimeout(400);

// search
await p.keyboard.press('Control+k');
await p.waitForTimeout(300);
await p.fill('.search__input','carryover');
await p.waitForTimeout(700);
const hits = await p.locator('.search__hit').count();
check('search returns results', hits>0, hits+' hits');
const cats = await p.locator('.search__cat').first().innerText();
check('search shows category', cats.length>0, cats);
await p.locator('.search__hit').first().click();
await p.waitForTimeout(700);
check('search navigates', !p.url().endsWith('/'), p.url());

// other routes
for (const [path, expect] of [['/ingredients','Ingredient'],['/skills','Skill'],['/reference','Reference'],['/log','Logbook']]) {
  await p.goto(BASE+path,{waitUntil:'networkidle'});
  await p.waitForTimeout(300);
  const t = await p.locator('main h1').first().innerText();
  check(`route ${path}`, t.toLowerCase().includes(expect.toLowerCase()), t);
}
// ingredient detail + substitution distinction
await p.goto(BASE+'/ingredients/rice-vinegar',{waitUntil:'networkidle'});
await p.waitForTimeout(300);
const sub = await p.locator('main').innerText();
check('functional substitution shown', /Functional substitute/i.test(sub));
check('availability shown', /Specialty|Common|import/i.test(sub));

// legacy hash redirect
await p.goto(BASE+'/#m1',{waitUntil:'networkidle'});
await p.waitForTimeout(500);
check('legacy hash redirects', p.url().includes('/module/proteins'), p.url());

await p.screenshot({path:SS+'app_desktop.png'});
check('no page errors (desktop)', errs.length===0, errs.slice(0,2).join('|'));

// ---------- mobile ----------
const m = await b.newPage({viewport:{width:390,height:844}, isMobile:true, hasTouch:true});
const merrs=[]; m.on('pageerror',e=>merrs.push(String(e)));
await m.goto(BASE+'/module/bread-dough',{waitUntil:'networkidle'});
await m.waitForTimeout(700);
const scrollW = await m.evaluate(()=>document.documentElement.scrollWidth);
const clientW = await m.evaluate(()=>document.documentElement.clientWidth);
check('no horizontal page scroll on phone', scrollW<=clientW+1, `${scrollW}>${clientW}`);
const drawerHidden = await m.locator('.sidebar').evaluate(el=>el.getBoundingClientRect().right<=0);
check('sidebar hidden as drawer on phone', drawerHidden);
await m.click('button[aria-label="Menu"]');
await m.waitForTimeout(400);
const drawerOpen = await m.locator('.sidebar').evaluate(el=>el.getBoundingClientRect().left>=-1);
check('drawer opens', drawerOpen);
// touch targets
const small = await m.evaluate(()=>{
  const els=[...document.querySelectorAll('.nav__link, .iconbtn, .btn')];
  return els.filter(e=>{const r=e.getBoundingClientRect(); return r.height>0 && r.height<40;}).length;
});
check('touch targets >=40px', small===0, small+' too small');
await m.screenshot({path:SS+'app_mobile.png'});
check('no page errors (mobile)', merrs.length===0, merrs.slice(0,2).join('|'));

await b.close();
console.log('PASS ('+ok.length+'):'); ok.forEach(o=>console.log('  ✓',o));
if(fails.length){ console.log('FAIL ('+fails.length+'):'); fails.forEach(f=>console.log('  ✗',f)); process.exit(1);} 
console.log('\nALL CHECKS PASSED');
