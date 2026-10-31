(() => {
  const nav = performance.getEntriesByType('navigation')[0] || {};
  const paints = {};
  for (const p of performance.getEntriesByType('paint')) paints[p.name] = Math.round(p.startTime);
  const m = performance.memory ? {
    heapMB: +(performance.memory.usedJSHeapSize / 1048576).toFixed(1),
    totalMB: +(performance.memory.totalJSHeapSize / 1048576).toFixed(1)
  } : {};
  const sheets = [...document.styleSheets].map(s => { try { return { rules: s.cssRules.length, href: s.href }; } catch (e) { return { rules: 'x' }; } });
  const faces = document.fonts ? document.fonts.size : null;
  const loadedFaces = document.fonts ? [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family) : [];
  return {
    dcl: Math.round(nav.domContentLoadedEventEnd || 0),
    load: Math.round(nav.loadEventEnd || 0),
    paints,
    ...m,
    cssRules: sheets.map(s => s.rules),
    fontFaces: faces,
    loadedFaces,
    htmlKB: Math.round((nav.decodedBodySize || 0) / 1024)
  };
})()
