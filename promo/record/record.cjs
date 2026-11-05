/*
 * Records footage of the Vector Field Sketchpad (../../index.html) for the promo video.
 *
 *   node record/record.cjs            # record every clip
 *   node record/record.cjs hopf loop  # record only some clips
 *
 * Each clip is written to public/clips/<name>.webm (1920 x 1080, 30 fps, VP9).
 *
 * How it works: the page's clock is replaced (see clock.js), so the script can
 * advance it exactly one video frame at a time and screenshot every frame.
 * The footage is smooth however slowly the machine renders. The page file on
 * disk is never changed: a few small patches are applied only to the copy that
 * is served to this browser (to expose the camera and coordinates, and to let
 * the axis gizmo be hidden).
 *
 * Needs Playwright with Chromium (npm i -D playwright && npx playwright install chromium)
 * and ffmpeg on the PATH.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.resolve(__dirname, '..', 'public', 'clips');
const TMP = path.resolve(__dirname, '.frames');
const FPS = 30;
/* CSS viewport 1440 x 810 at a real device scale of 4/3, so frames come out at 1920 x 1080.
   The scale is set when the browser starts (not emulated per page), which keeps screenshots fast. */
const VW = 1440, VH = 810, DPR = 4 / 3;

/* ---------- the page, patched in memory only ---------- */
function pageSource() {
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const patch = (anchor, extra) => {
    if (!html.includes(anchor)) throw new Error('index.html changed; anchor not found: ' + anchor.slice(0, 60));
    html = html.replace(anchor, anchor + extra);
  };
  patch('const cam={yaw:-2.3,pitch:0.45,zoom:1};',
    'window.__vf={S,cam,' +
    'setCam:(y,p,z)=>{cam.yaw=y;cam.pitch=p;if(z)cam.zoom=z;camT=null;camG=null;vel.yaw=0;vel.pitch=0;dirty=true;},' +
    'w2s:(x,y)=>{const r=cv.getBoundingClientRect();return[r.left+sx2(x),r.top+sy2(y)]},' +
    'probe:()=>{const r=cv.getBoundingClientRect(),q=probeScreen();return[r.left+q[0],r.top+q[1]]},' +
    'center2:()=>{const r=cv.getBoundingClientRect(),o=[r.left+sx2(0),r.top+sy2(0)];panBy(r.left+r.width/2-o[0],r.top+r.height/2-o[1])}};');
  patch('function drawGizmo(c){', 'if(window.__noGizmo)return;');
  /* with the interface hidden, the 3D box ignores the (hidden) bottom toolbar and centres in the whole frame */
  html = html.replace('const av=Math.max(80,H-TBH);\n  PJ.sc=Math.min(av*(TBH?0.29:0.26),',
    'const TBH_=window.__noGizmo?0:TBH,av=Math.max(80,H-TBH_);\n  PJ.sc=Math.min(av*(TBH_?0.29:0.26),');
  if (!html.includes('TBH_')) throw new Error('index.html changed; 3D layout anchor not found');
  return html;
}
const KATEX = require.resolve('katex/dist/katex.min.js', { paths: [path.resolve(__dirname, '..')] });
const CLOCK = fs.readFileSync(path.join(__dirname, 'clock.js'), 'utf8');

/* A fake cursor drawn in the page (headless screenshots have no real one) */
const CURSOR = `
window.__cursor = (x, y, down) => {
  let c = document.getElementById('__cur');
  if (!c) {
    c = document.createElement('div'); c.id = '__cur';
    c.innerHTML = '<svg width="26" height="26" viewBox="0 0 26 26"><path d="M3 2.5 L3 20.5 L7.6 16.4 L10.8 23.4 L14 22 L10.9 15.1 L17.2 15.1 Z" fill="#fff" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    c.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45));transform-origin:3px 2px';
    const ring = document.createElement('div'); ring.id = '__ring';
    ring.style.cssText = 'position:fixed;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:2px solid rgba(255,255,255,.75);background:rgba(255,255,255,.12);z-index:2147483646;pointer-events:none;opacity:0';
    document.body.append(ring, c);
  }
  c.style.translate = (x - 3) + 'px ' + (y - 2) + 'px';
  c.style.scale = down ? '0.86' : '1';
  const r = document.getElementById('__ring');
  r.style.translate = x + 'px ' + y + 'px';
  r.style.opacity = down ? '1' : '0';
};`;

const NO_ANIM = '*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important}#ttip{display:none!important}';
const HIDE_UI = '.tl,.lgcard,.tbar,.vbtns,#drL,.toast,.tip,.ptcard,.tt{display:none!important}';

/* ---------- recorder ---------- */
class Rec {
  constructor(browser) { this.browser = browser; this.mx = VW / 2; this.my = VH + 40; this.down = false; this.clip = null; }

  async open(hash, { fullscreen = false, hideUI = false, warm = 2 } = {}) {
    this.ctx = await this.browser.newContext({ viewport: null });
    await this.ctx.addInitScript(() => { localStorage.setItem('vf-tip', '1'); localStorage.setItem('vf-lang', 'en'); });
    await this.ctx.addInitScript({ content: CLOCK });
    /* No real Fullscreen API: the page then falls back to filling the window, which keeps the
       viewport at 1440 x 810 (headless full screen would resize it to the virtual screen) */
    await this.ctx.addInitScript(() => {
      for (const k of ['requestFullscreen', 'webkitRequestFullscreen']) Object.defineProperty(Element.prototype, k, { value: undefined, configurable: true });
    });
    if (hideUI) await this.ctx.addInitScript(() => { window.__noGizmo = true; });
    const p = this.page = await this.ctx.newPage();
    p.on('pageerror', (e) => console.error('  page error:', e.message));
    const html = pageSource(), kx = fs.readFileSync(KATEX);
    await p.route('**/*', (r) => {
      const u = r.request().url();
      if (u.startsWith('http://vf.local/')) return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
      if (u.includes('katex.min.js')) return r.fulfill({ body: kx, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } });
      return r.continue();
    });
    await p.goto('http://vf.local/#' + hash, { waitUntil: 'networkidle' });
    await p.waitForFunction(() => window.katex && window.__vf, null, { timeout: 30000 });
    await p.evaluate(() => document.fonts.ready);
    await p.addStyleTag({ content: NO_ANIM + (hideUI ? HIDE_UI : '') });
    await p.evaluate(CURSOR);
    this.cdp = await this.ctx.newCDPSession(p);
    if (fullscreen) {
      await this.tick(10); await p.mouse.move(VW / 2, VH / 2); await p.keyboard.press('f'); await this.tick(20);
      /* with the toolbars hidden, put the 2D origin back in the middle of the frame */
      if (!hash.match(/^(lorenz|aizawa|thomas|halvorsen|rossler|rotation-z|helix|radial|sink|grad-xyz|charge-3d|magnetic-dipole|wire|abc)$/)) await p.evaluate(() => window.__vf.center2());
    }
    await this.tick(Math.round(warm * FPS));
    /* the probe card pops up on first load and folds away on the first mouse move over the plot */
    if (!hideUI) { await p.mouse.move(VW / 2, VH / 2); await this.tick(4); await this.cursor(); }
  }

  async close() { await this.ctx.close(); }
  /* press the plot's full-screen button (bottom right) without filming it; the interface stays */
  async fullscreenUI() {
    await this.eval(() => document.querySelector('#fs').click());
    await this.tick(30);
    await this.page.mouse.move(VW / 2, VH / 2); await this.tick(4);
  }
  async tick(n = 1) { for (let i = 0; i < n; i++) await this.page.evaluate((dt) => window.__tick(dt), 1000 / FPS); }
  async cursor() { await this.page.evaluate(([x, y, d]) => window.__cursor(x, y, d), [this.mx, this.my, this.down]); }

  /* clips: every captured frame goes to the clip that was started last */
  start(name) {
    this.clip = { name, dir: path.join(TMP, name), n: 0 };
    fs.rmSync(this.clip.dir, { recursive: true, force: true });
    fs.mkdirSync(this.clip.dir, { recursive: true });
    console.log('  recording', name);
  }
  async frame(n = 1) {
    for (let i = 0; i < n; i++) {
      await this.tick();
      if (!this.clip) continue;
      const r = await this.cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 95, optimizeForSpeed: true });
      fs.writeFileSync(path.join(this.clip.dir, String(this.clip.n++).padStart(5, '0') + '.jpg'), Buffer.from(r.data, 'base64'));
    }
  }
  async hold(sec) { await this.frame(Math.round(sec * FPS)); }
  finish() {
    const c = this.clip; if (!c) return; this.clip = null;
    fs.mkdirSync(OUT, { recursive: true });
    const out = path.join(OUT, c.name + '.webm');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(c.dir, '%05d.jpg'),
      '-c:v', 'libvpx-vp9', '-crf', '18', '-b:v', '0', '-pix_fmt', 'yuv420p', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '3', out]);
    fs.rmSync(c.dir, { recursive: true, force: true });
    console.log('  wrote', path.relative(process.cwd(), out), (c.n / FPS).toFixed(1) + 's');
  }

  /* run fn(t) once per frame for sec seconds, t going 0 → 1 */
  async during(sec, fn) {
    const n = Math.max(1, Math.round(sec * FPS));
    for (let i = 1; i <= n; i++) { await fn(i / n); await this.frame(); }
  }
  async moveTo(x, y, sec = 0.45) {
    const x0 = this.mx, y0 = this.my;
    await this.during(sec, async (t) => {
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      this.mx = x0 + (x - x0) * e; this.my = y0 + (y - y0) * e;
      await this.page.mouse.move(this.mx, this.my); await this.cursor();
    });
  }
  async press() { this.down = true; await this.page.mouse.down(); await this.cursor(); }
  async release() { this.down = false; await this.page.mouse.up(); await this.cursor(); }
  async click(x, y, sec = 0.45) {
    await this.moveTo(x, y, sec); await this.frame(2);
    await this.press(); await this.frame(3); await this.release(); await this.frame(2);
  }
  /* drag along a list of points, reaching each in turn at a steady speed */
  async drag(pts, sec) {
    await this.moveTo(pts[0][0], pts[0][1], 0.45); await this.frame(2); await this.press(); await this.frame(2);
    const seg = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    await this.during(sec, async (t) => {
      let d = t * L, i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
      const f = seg[i] ? Math.min(1, d / seg[i]) : 1;
      this.mx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f; this.my = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
      await this.page.mouse.move(this.mx, this.my); await this.cursor();
    });
    await this.frame(2); await this.release(); await this.frame(2);
  }
  async type(text, cps = 11) {
    for (const ch of text) { await this.page.keyboard.type(ch); await this.frame(Math.max(1, Math.round(FPS / cps))); }
  }
  async key(k) { await this.page.keyboard.press(k); await this.frame(1); }
  async center(sel) {
    const b = await this.page.locator(sel).first().boundingBox();
    if (!b) throw new Error('not visible: ' + sel);
    return [b.x + b.width / 2, b.y + b.height / 2];
  }
  async clickSel(sel, sec) { const [x, y] = await this.center(sel); await this.click(x, y, sec); }
  /* x position of a range input's thumb for a value (standard 15px thumb); .y is the track's middle */
  async slider(sel) {
    const el = this.page.locator(sel).first(), b = await el.boundingBox();
    const [mn, mx] = await el.evaluate((s) => [+s.min, +s.max]);
    const f = (v) => b.x + 7.5 + ((v - mn) / (mx - mn)) * (b.width - 15);
    f.y = b.y + b.height / 2;
    return f;
  }
  async w2s(x, y) { return this.page.evaluate(([x, y]) => window.__vf.w2s(x, y), [x, y]); }
  async eval(fn, arg) { return this.page.evaluate(fn, arg); }
}

/* ---------- the clips ---------- */
const CLIPS = {
  /* Intro / outro background: particles only, no interface */
  async bg(r) {
    await r.open('dipole', { fullscreen: true, hideUI: true, warm: 3 });
    await r.eval(() => {
      document.querySelector('.mid .tg[data-k=arrows]').click();
      window.__vf.S.hover = { x: 1e3, y: 1e3 }; // the probe is clamped to the top-right corner, which the edit crops away
    });
    await r.tick(45);
    r.start('bg'); await r.hold(9); r.finish();
  },

  /* Typing a field (window), then switching how it is drawn (full screen) */
  async type(r) {
    await r.open('rotation');
    r.start('type');
    await r.hold(0.3);
    await r.clickSel('#fP', 0.5);
    await r.key('Control+A'); await r.type('sin(y)', 14);
    await r.hold(0.3);
    await r.clickSel('#fQ', 0.4);
    await r.key('Control+A'); await r.type('sin(x)', 14);
    await r.hold(1.5);
    r.finish();

    await r.fullscreenUI();
    r.mx = VW * 0.62; r.my = VH * 0.55; await r.cursor();
    r.start('styles');
    await r.hold(0.3);
    await r.clickSel('.mid .tg[data-k=stream]'); await r.hold(0.8);
    await r.clickSel('.mid .tg[data-k=arrows]', 0.35); await r.hold(0.8);
    /* (sin y, sin x) has zero divergence, so go straight to the curl heat-map */
    await r.clickSel('#bDrL', 0.5); await r.hold(0.2);
    await r.clickSel('#bgSeg button[data-bg=curl]'); await r.hold(0.3);
    await r.clickSel('#bDrL', 0.4); await r.hold(1.5);
    r.finish();
  },

  /* Shear flow, full screen: straight streamlines, yet the paddle wheel turns */
  async probe(r) {
    await r.open('shear');
    await r.eval(() => { const b = document.querySelectorAll('#acts2 button'); b[0].click(); b[1].click(); }); // curl background, paddle wheel
    await r.fullscreenUI();
    await r.tick(20);
    r.start('probe');
    await r.hold(0.3);
    const [px, py] = await r.eval(() => window.__vf.probe());
    const p = async (x, y) => r.w2s(x, y);
    const path = [[px, py], await p(1.4, 0.1), await p(0.3, -1.3), await p(-1.8, -0.5), await p(-0.8, 1.3)];
    await r.drag(path, 3.0);
    await r.hold(0.8);
    r.finish();
  },

  /* Hopf bifurcation (window, the slider is in the side panel): drag a and watch the limit cycle appear */
  async hopf(r) {
    await r.open('hopf');
    await r.eval(() => {
      document.querySelector('#acts2 button').click(); // nullclines
      const s = document.querySelector('#params input[type=range]');
      s.value = -0.6; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true }));
      document.querySelector('.mid .tg[data-k=sl]').click(); // streamline through the probe
    });
    await r.tick(20);
    /* put the probe just off the origin: its streamline spirals in for a < 0 and out onto the limit cycle for a > 0 */
    await r.drag([await r.eval(() => window.__vf.probe()), await r.w2s(0.18, 0.12)], 0.6);
    await r.moveTo(VW - 380, VH - 200, 0.4);
    await r.tick(40);
    r.start('hopf');
    await r.hold(0.3);
    const xAt = await r.slider('#params input[type=range]'), y = xAt.y;
    await r.drag([[xAt(-0.6), y], [xAt(0.05), y], [xAt(0.9), y]], 3.2);
    await r.hold(1.0);
    r.finish();
  },

  /* Point vortex, full screen: draw a loop around the origin */
  async loop(r) {
    await r.open('vortex');
    await r.fullscreenUI();
    r.mx = VW * 0.5; r.my = VH * 0.7; await r.cursor();
    r.start('loop');
    await r.hold(0.3);
    await r.clickSel('#bPen', 0.5);
    const pts = [];
    for (let k = 0; k <= 64; k++) {
      const a = -0.6 + (k / 64) * 2 * Math.PI, rr = 1.45 + 0.12 * Math.sin(3 * a + 0.4);
      pts.push(await r.w2s(0.1 + rr * Math.cos(a), 0.05 + rr * Math.sin(a)));
    }
    pts.push(pts[0]);
    await r.drag(pts, 2.3);
    await r.hold(0.4);
    await r.key('p'); // leave draw-path mode, so its banner goes away
    await r.hold(1.6);
    r.finish();
  },

  /* Green's theorem demo, full screen: step the grid from 1 cell to 16 x 16 */
  async green(r) {
    await r.open('rotation');
    await r.eval(() => { const d = document.querySelector('details[data-k=demo]'); d.open = true; });
    await r.tick(5);
    await r.eval(() => document.querySelector('button.demo-b:nth-child(2)').click());
    await r.tick(20);
    await r.fullscreenUI();
    await r.eval(() => { const s = document.querySelector('#dm input[type=range]'); s.value = 0; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
    await r.tick(30);
    r.mx = VW * 0.55; r.my = VH * 0.75; await r.cursor();
    r.start('green');
    await r.hold(0.3);
    const xAt = await r.slider('#dm input[type=range]'), y = xAt.y;
    await r.moveTo(xAt(0), y, 0.5); await r.frame(2); await r.press(); await r.hold(0.2);
    for (let v = 1; v <= 4; v++) { await r.moveTo(xAt(v), y, 0.3); await r.hold(0.75); }
    await r.release(); await r.hold(0.8);
    r.finish();
  },

  /* 3D: Lorenz, slow orbit, no interface */
  async lorenz(r) {
    await r.open('lorenz', { fullscreen: true, hideUI: true, warm: 4 });
    await r.eval(() => window.__vf.setCam(-0.95, 0.3, 0.92));
    await r.tick(30);
    r.start('lorenz');
    await r.during(9, (t) => r.eval((t) => window.__vf.setCam(-0.95 + 0.85 * t, 0.3 + 0.25 * Math.sin(Math.PI * t), 0.92), t));
    r.finish();
  },
};
/* Short 3D shots: [clip, example, camera yaw, show streamlines instead of arrows] */
for (const [name, hash, yaw, lines] of [
  ['halvorsen', 'halvorsen', -2.1, false],
  ['dipole3d', 'magnetic-dipole', -2.3, true],
  ['wire', 'wire', -2.3, true],
  ['helix', 'helix', -2.3, true],
]) {
  CLIPS[name] = async (r) => {
    await r.open(hash, { fullscreen: true, hideUI: true, warm: 4 });
    if (lines) await r.eval(() => {
      const t = (k) => document.querySelector('.mid .tg[data-k=' + k + ']');
      if (t('arrows').getAttribute('aria-pressed') === 'true') t('arrows').click();
      if (t('stream').getAttribute('aria-pressed') !== 'true') t('stream').click();
    });
    await r.eval((y) => window.__vf.setCam(y, 0.35, 0.92), yaw);
    await r.tick(lines ? 60 : 30);
    r.start(name);
    await r.during(4, (t) => r.eval(([y, t]) => window.__vf.setCam(y + 0.5 * t, 0.35 + 0.1 * t, 0.92), [yaw, t]));
    r.finish();
  };
}

(async () => {
  const want = process.argv.slice(2);
  const names = want.length ? want : Object.keys(CLIPS);
  for (const n of names) if (!CLIPS[n]) throw new Error('unknown clip: ' + n + ' (have: ' + Object.keys(CLIPS).join(', ') + ')');
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--force-device-scale-factor=' + DPR, `--window-size=${VW},${VH}`] });
  try {
    for (const n of names) {
      const t0 = Date.now();
      console.log(n);
      const r = new Rec(browser);
      try { await CLIPS[n](r); } finally { await r.close(); }
      console.log('  done in', Math.round((Date.now() - t0) / 1000) + 's');
    }
  } finally { await browser.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
