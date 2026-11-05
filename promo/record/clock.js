/* Injected before the page's own scripts. Replaces the page clock so the
   recorder can step it one video frame at a time: performance.now(),
   requestAnimationFrame and setTimeout/setInterval all run on virtual time,
   so the recording is smooth no matter how slowly the machine renders. */
(() => {
  let now = 1000, seq = 0;
  const raf = new Map(), timers = new Map();
  performance.now = () => now;
  window.requestAnimationFrame = (cb) => { raf.set(++seq, cb); return seq; };
  window.cancelAnimationFrame = (id) => { raf.delete(id); };
  const add = (fn, ms, args, every) => {
    const id = ++seq;
    timers.set(id, { due: now + Math.max(0, +ms || 0), fn, args, every: every ? Math.max(1, +ms || 0) : 0 });
    return id;
  };
  window.setTimeout = (fn, ms, ...args) => add(fn, ms, args, false);
  window.setInterval = (fn, ms, ...args) => add(fn, ms, args, true);
  window.clearTimeout = window.clearInterval = (id) => { timers.delete(id); };
  const run = (fn, args) => { try { typeof fn === 'function' ? fn(...args) : (0, eval)(String(fn)); } catch (e) { console.error(e); } };
  /* Advance the clock by dt milliseconds: fire due timers in order, then one animation frame. */
  window.__tick = (dt) => {
    const end = now + dt;
    for (let guard = 0; guard < 10000; guard++) {
      let next = null;
      for (const [id, t] of timers) if (t.due <= end && (!next || t.due < next[1].due)) next = [id, t];
      if (!next) break;
      const [id, t] = next;
      now = Math.max(now, t.due);
      if (t.every) t.due += t.every; else timers.delete(id);
      run(t.fn, t.args);
    }
    now = end;
    const cbs = [...raf.values()];
    raf.clear();
    for (const cb of cbs) run(cb, [now]);
  };
})();
