(async () => {
  const A = window.__app, out = {};
  out.hasApp = !!A;
  out.logDumpType = typeof A.logDump;
  A.loadDemo();
  await new Promise(r => setTimeout(r, 400));
  out.logLines = A.logDump().split('\n').length;
  out.jobSeq = A.beginJob();
  out.jobOK = A.jobOK(out.jobSeq);
  out.jobOld = A.jobOK(out.jobSeq - 1);
  // 1 秒一次导出冒烟
  A.state.duration = 2; document.getElementById('inDur').value = 2;
  document.getElementById('inRes').value = '720';
  document.getElementById('inMode').value = 'fast';
  const st = document.getElementById('status');
  st.textContent = '';
  document.getElementById('btnRec').click();
  const t0 = performance.now();
  while (performance.now() - t0 < 40000) { if (!A.state.busy) break; await new Promise(r => setTimeout(r, 100)); }
  out.status = st.textContent.slice(0, 80);
  out.logTail = A.logDump().split('\n').slice(-3);
  return out;
})()
