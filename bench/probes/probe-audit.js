(async () => {
  const A = window.__app, out = {};
  __seedDemo(A);
  await new Promise(r => setTimeout(r, 600));

  // 1) DOM 规模
  out.domNodes = document.querySelectorAll('*').length;
  out.domDepth = (() => { let d = 0, el = document.body; while (el && el.children[0]) { el = el.children[0]; d++; } return d; })();
  out.mselCount = document.querySelectorAll('.msel').length;

  // 2) CLS（布局偏移累计）
  out.cls = 0;
  out.clsEntries = [];
  try {
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) { out.cls += e.value; out.clsEntries.push(+e.value.toFixed(4)); }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch (e) { out.clsErr = e.message; }

  // 3) 长任务
  out.longTasks = [];
  try {
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) out.longTasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) });
    }).observe({ type: 'longtask', buffered: true });
  } catch (e) { out.ltErr = e.message; }

  // 4) 未使用的 CSS 规则（粗略：每条规则的第一个选择器在文档里有没有匹配）
  const unused = [];
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
    for (const r of rules) {
      if (r.type !== 1) continue;
      const sel = r.selectorText.split(',')[0].trim();
      if (!sel || sel.includes(':hover') || sel.includes('::')) continue;
      try { if (!document.querySelector(sel)) unused.push(sel.slice(0, 40)); } catch (e) {}
    }
  }
  out.unusedCssCount = unused.length;
  out.unusedCssSample = unused.slice(0, 8);

  // 5) 200 行歌词时的 DOM 规模
  const lines = [];
  for (let i = 0; i < 200; i++) lines.push('[' + String(Math.floor(i / 60)).padStart(2, '0') + ':' + String(i % 60).padStart(2, '0') + '.00]第 ' + i + ' 行测试歌词');
  const before = performance.now();
  A.state.lyrics = null;
  window.__setLrc = lines.join('\n');
  // 用粘贴路径最真实
  const ta = document.getElementById('lrcIn');
  out.hasTextarea = !!ta;
  const t0 = performance.now();
  if (ta) {
    ta.value = lines.join('\n');
    document.getElementById('btnImpo').click();
    await new Promise(r => setTimeout(r, 400));
  }
  out.import200Ms = Math.round(performance.now() - t0);
  out.domNodes200 = document.querySelectorAll('*').length;
  out.lyricRows = document.querySelectorAll('#edList .ed-row').length;

  await new Promise(r => setTimeout(r, 500));
  out.clsAfter = +out.cls.toFixed(4);
  return out;
})()
