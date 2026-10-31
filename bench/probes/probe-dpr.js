(() => {
  const out = {};
  out.dpr = window.devicePixelRatio;
  out.vw = innerWidth;
  out.scrollW = document.documentElement.scrollWidth;
  out.overflowX = out.scrollW - out.vw;
  const cv = document.getElementById('cv');
  const r = cv.getBoundingClientRect();
  out.cvCss = Math.round(r.width) + 'x' + Math.round(r.height);
  out.cvPx = cv.width + 'x' + cv.height;
  out.tapMin = (() => {
    const els = [...document.querySelectorAll('button,select,input[type=range],label.btn')];
    let min = 999;
    for (const e of els) { if (!e.offsetParent) continue; const b = e.getBoundingClientRect(); if (b.width > 4 && b.height > 4) min = Math.min(min, Math.min(b.width, b.height)); }
    return Math.round(min);
  })();
  out.font = getComputedStyle(document.body).fontSize;
  return out;
})()
