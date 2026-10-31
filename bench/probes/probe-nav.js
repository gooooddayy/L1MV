(() => {
  const n = performance.getEntriesByType('navigation')[0];
  const r = (v) => Math.round(v || 0);
  const out = {};
  for (const k of ['startTime','redirectStart','fetchStart','domainLookupEnd','connectEnd','requestStart','responseStart','responseEnd','domInteractive','domContentLoadedEventStart','domContentLoadedEventEnd','loadEventStart','loadEventEnd','duration']) out[k] = r(n[k]);
  out.transferKB = Math.round((n.transferSize || 0) / 1024) || Math.round((n.decodedBodySize || 0) / 1024);
  out.decodedKB = Math.round((n.decodedBodySize || 0) / 1024);
  // 脚本执行段：找 main script 的 resource timing
  out.scripts = performance.getEntriesByType('resource').filter(x => x.initiatorType === 'script' || x.name.startsWith('file:')).map(x => ({ name: x.name.split('/').pop().slice(0, 40), start: r(x.startTime), end: r(x.responseEnd) }));
  const p = {};
  for (const e of performance.getEntriesByType('paint')) p[e.name] = r(e.startTime);
  out.paints = p;
  out.marks = { t0: r(window.__p0), t1: r(window.__p1), t2: r(window.__p2) };
  return out;
})()
