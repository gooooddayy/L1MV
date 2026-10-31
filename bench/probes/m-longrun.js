(async () => {
  const A = window.__app, st = A.state, out = { runs: [], heap: [] };
  A.loadDemo();
  await new Promise(r => setTimeout(r, 400));
  const oc = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {};
  document.getElementById('inRes').value = '720';
  document.getElementById('inMode').value = 'fast';
  const stEl = document.getElementById('status');
  const tabs = [...document.querySelectorAll('.mtab button')];

  const heapMB = () => performance.memory ? +(performance.memory.usedJSHeapSize / 1048576).toFixed(1) : null;

  for (let i = 0; i < 10; i++) {
    st.duration = 2; document.getElementById('inDur').value = 2;
    // 每轮中间穿插切页签 + 改参数，模拟真实使用
    for (let k = 0; k < 20; k++) tabs[k & 1].click();
    const fs = document.getElementById('inFs');
    fs.value = String(30 + (i % 40)); fs.dispatchEvent(new Event('input', { bubbles: true }));
    stEl.textContent = '';
    const t0 = performance.now();
    document.getElementById('btnRec').click();
    while (performance.now() - t0 < 40000) { if (!st.busy) break; await new Promise(r => setTimeout(r, 60)); }
    out.runs.push({ i, ms: Math.round(performance.now() - t0), ok: /已导出/.test(stEl.textContent) });
    out.heap.push(heapMB());
  }
  HTMLAnchorElement.prototype.click = oc;
  out.busyEnd = st.busy;
  out.logErrCount = A.logDump().split('\n').filter(l => l.includes('ERR')).length;
  out.logLines = A.logDump().split('\n').length;
  return out;
})()
