(async () => {
  const A = window.__app, out = {};
  const sel = document.getElementById('inFont');
  out.fontOptsQuick = sel.options.length;
  await new Promise(r => setTimeout(r, 1400));
  out.fontOptsAfterIdle = sel.options.length;
  out.fontLabels = [...sel.options].map(o => o.textContent);
  out.storeNodes = document.querySelectorAll('#fontStore script[data-family]').length;
  out.storeEmpty = [...document.querySelectorAll('#fontStore script[data-family]')].map(n => n.textContent.length);

  // 连点两次同一字体（第二次应命中缓存）
  const t0 = performance.now();
  sel.value = 'kai'; sel.dispatchEvent(new Event('change'));
  await new Promise(r => setTimeout(r, 600));
  const t1 = performance.now();
  sel.value = 'sans'; sel.dispatchEvent(new Event('change'));
  await new Promise(r => setTimeout(r, 300));
  sel.value = 'kai'; sel.dispatchEvent(new Event('change'));
  await new Promise(r => setTimeout(r, 300));
  out.fontNow = A.state.font;
  out.overflow = document.documentElement.scrollWidth - innerWidth;
  const cv = document.getElementById('cv');
  const px = cv.getContext('2d').getImageData(cv.width / 2, cv.height / 2, 1, 1).data;
  out.centerPixel = [px[0], px[1], px[2], px[3]];
  out.canvasSize = cv.width + 'x' + cv.height;
  return out;
})()
