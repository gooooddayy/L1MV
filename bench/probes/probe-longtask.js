(async () => {
  const out = { tasks: [] };
  try {
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) out.tasks.push([Math.round(e.startTime), Math.round(e.duration)]);
    }).observe({ type: 'longtask', buffered: true });
  } catch (e) { out.err = e.message; }
  await new Promise(r => setTimeout(r, 1500));

  // 单独量一次「示例」按钮与一次真实封面导入
  const t0 = performance.now();
  window.__app.loadDemo();
  out.demoMs = Math.round(performance.now() - t0);

  const t1 = performance.now();
  const c = document.createElement('canvas'); c.width = 1400; c.height = 1400;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 1400, 1400);
  g.addColorStop(0, '#7fb9bd'); g.addColorStop(1, '#0d2b39');
  x.fillStyle = g; x.fillRect(0, 0, 1400, 1400);
  const durl = c.toDataURL('image/png');
  const bin = atob(durl.split(',')[1]); const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  window.__app.loadImageFile(new File([u8], 'cover.png', { type: 'image/png' }));
  await new Promise(r => setTimeout(r, 800));
  out.imageImportMs = Math.round(performance.now() - t1);
  out.tasksAfter = out.tasks.slice();
  return out;
})()
