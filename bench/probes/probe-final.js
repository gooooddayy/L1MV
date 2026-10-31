(async () => {
  const A = window.__app, st = A.state, out = { runs: [] };
  __seedDemo(A);
  await new Promise(r => setTimeout(r, 500));
  const oc = HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click = function () {};
  const stEl = document.getElementById('status');
  document.getElementById('inFmt').value = 'mp4';

  const run = async (label, mode, res, dur) => {
    st.duration = dur; document.getElementById('inDur').value = dur;
    document.getElementById('inRes').value = res;
    document.getElementById('inMode').value = mode;
    stEl.textContent = '';
    const t0 = performance.now();
    document.getElementById('btnRec').click();
    while (performance.now() - t0 < 60000) { if (!st.busy && !st.recording) break; await new Promise(r => setTimeout(r, 80)); }
    out.runs.push({ label, ms: Math.round(performance.now() - t0), status: stEl.textContent.slice(0, 62) });
  };

  await run('fast-720p-3s', 'fast', '720', 3);
  await run('fast-1080p-5s', 'fast', '1080', 5);
  await run('record-720p-3s', 'realtime', '720', 3);
  HTMLAnchorElement.prototype.click = oc;
  out.errors = A.logDump().split('\n').filter(l => l.includes('ERR')).slice(-2);
  return out;
})()
