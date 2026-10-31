(async () => {
  const A = window.__app, st = A.state, out = {};
  __seedDemo(A);
  await new Promise(r => setTimeout(r, 600));
  out.deviceMemory = navigator.deviceMemory || null;
  out.cores = navigator.hardwareConcurrency || null;

  // 交互：60 次滑块
  const fs = document.getElementById('inFs');
  let t0 = performance.now();
  for (let i = 0; i < 60; i++) { fs.value = String(30 + (i % 40)); fs.dispatchEvent(new Event('input', { bubbles: true })); }
  out.slider60SyncMs = +(performance.now() - t0).toFixed(1);
  await new Promise(r => requestAnimationFrame(() => r()));

  // 切页签 50 次
  const tabs = [...document.querySelectorAll('.mtab button')];
  t0 = performance.now();
  for (let i = 0; i < 50; i++) tabs[i & 1].click();
  out.tab50SyncMs = +(performance.now() - t0).toFixed(1);

  // 单帧渲染
  t0 = performance.now();
  A.renderAt(6);
  out.renderMs = +(performance.now() - t0).toFixed(1);

  // 一次 2 秒 720P 导出
  const oc = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {};
  st.duration = 2; document.getElementById('inDur').value = 2;
  document.getElementById('inRes').value = '720';
  document.getElementById('inMode').value = 'fast';
  const stEl = document.getElementById('status');
  stEl.textContent = '';
  t0 = performance.now();
  document.getElementById('btnRec').click();
  while (performance.now() - t0 < 60000) { if (!st.busy) break; await new Promise(r => setTimeout(r, 80)); }
  out.exportMs = Math.round(performance.now() - t0);
  out.exportStatus = stEl.textContent.slice(0, 70);
  HTMLAnchorElement.prototype.click = oc;
  out.online = navigator.onLine;
  return out;
})()
