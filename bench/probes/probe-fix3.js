(async () => {
  const A = window.__app, out = {};
  __seedDemo(A);
  await new Promise(r => setTimeout(r, 400));
  out.blockReason = await A.WEBM2MP4.blockReason();
  out.canConvert = await A.WEBM2MP4.canConvert();

  // 先造一条假的上一次结果，确认点导出会立刻清掉
  const st = document.getElementById('status');
  st.textContent = '已停止（切走了）· MP4 1920×1080 · 15.9 MB · 可拖进度';
  A.state.duration = 2; document.getElementById('inDur').value = 2;
  document.getElementById('inRes').value = '720';
  document.getElementById('inMode').value = 'fast';
  document.getElementById('btnRec').click();
  await new Promise(r => setTimeout(r, 30));
  out.afterClick30ms = st.textContent.slice(0, 40);
  await new Promise(r => setTimeout(r, 300));
  out.afterClick330ms = st.textContent.slice(0, 60);

  const t0 = performance.now();
  while (performance.now() - t0 < 60000) {
    if (!A.state.busy) break;
    await new Promise(r => setTimeout(r, 150));
  }
  out.finalStatus = st.textContent.slice(0, 80);
  return out;
})()
