(async () => {
  const A = window.__app, st = A.state, out = {};
  A.loadDemo();
  await new Promise(r => setTimeout(r, 400));

  // 拦下载：只记次数
  let dl = 0, names = [];
  const oc = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () { if (this.download) { dl++; names.push(this.download); } };

  st.duration = 2; document.getElementById('inDur').value = 2;
  document.getElementById('inRes').value = '720';
  document.getElementById('inMode').value = 'fast';
  const stEl = document.getElementById('status');

  // A) 同一帧里连点 10 次
  stEl.textContent = '';
  for (let i = 0; i < 10; i++) document.getElementById('btnRec').click();
  out.busyAfterBurst = st.busy;
  let t0 = performance.now();
  while (performance.now() - t0 < 40000) { if (!st.busy) break; await new Promise(r => setTimeout(r, 80)); }
  out.downloadsAfterBurst = dl;
  out.statusA = stEl.textContent.slice(0, 70);

  // B) 导出进行中再点 5 次（间隔 40ms）
  dl = 0;
  document.getElementById('btnRec').click();
  for (let i = 0; i < 5; i++) { await new Promise(r => setTimeout(r, 40)); document.getElementById('btnRec').click(); }
  t0 = performance.now();
  while (performance.now() - t0 < 40000) { if (!st.busy) break; await new Promise(r => setTimeout(r, 80)); }
  await new Promise(r => setTimeout(r, 300));
  out.downloadsDuringBusy = dl;
  out.statusB = stEl.textContent.slice(0, 70);
  out.busyFinal = st.busy;

  // C) 取消后立刻重开（任务号是否让旧回调失效）
  dl = 0;
  st.duration = 6; document.getElementById('inDur').value = 6;
  document.getElementById('btnRec').click();
  await new Promise(r => setTimeout(r, 250));
  document.getElementById('btnStop').click();     // 取消
  await new Promise(r => setTimeout(r, 120));
  st.duration = 2; document.getElementById('inDur').value = 2;
  document.getElementById('btnRec').click();      // 立刻开新任务
  t0 = performance.now();
  while (performance.now() - t0 < 40000) { if (!st.busy) break; await new Promise(r => setTimeout(r, 80)); }
  await new Promise(r => setTimeout(r, 400));
  out.downloadsAfterCancel = dl;
  out.statusC = stEl.textContent.slice(0, 70);
  out.names = names.slice(-2);

  HTMLAnchorElement.prototype.click = oc;
  out.logTail = A.logDump().split('\n').slice(-4);
  return out;
})()
