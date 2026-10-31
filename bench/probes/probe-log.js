(async () => {
  const A = window.__app, st = A.state, out = {};
  A.loadDemo();
  await new Promise(r => setTimeout(r, 500));
  st.duration = 2; document.getElementById('inDur').value = 2;
  document.getElementById('inRes').value = '720';
  document.getElementById('inMode').value = 'fast';
  const oc = HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click = function(){};
  document.getElementById('btnRec').click();
  const t0 = performance.now();
  while (performance.now() - t0 < 40000) { if (!st.busy) break; await new Promise(r => setTimeout(r, 80)); }
  HTMLAnchorElement.prototype.click = oc;
  out.log = A.logDump().split('\n');
  out.count = out.log.length;
  return out;
})()
