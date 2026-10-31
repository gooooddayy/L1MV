(async () => {
  const out = {};
  const node = () => document.querySelector('#fontStore script[data-family="L1MV Brush"]');
  out.lenBefore = node() ? node().textContent.length : -1;
  out.facesBefore = document.fonts.size;
  const sel = document.getElementById('inFont');
  sel.value = 'brush'; sel.dispatchEvent(new Event('change'));
  await new Promise(r => setTimeout(r, 900));
  out.lenAfter = node() ? node().textContent.length : -1;
  out.facesAfter = document.fonts.size;
  out.facesList = [...document.fonts].map(f => f.family + ':' + f.status);
  out.check = document.fonts.check('64px "L1MV Brush"');
  const c = document.createElement('canvas').getContext('2d');
  c.font = '64px "L1MV Brush"'; out.wBrush = Math.round(c.measureText('测试字体测试').width);
  c.font = '64px "NoSuchXYZ"'; out.wMiss = Math.round(c.measureText('测试字体测试').width);
  out.fontNow = window.__app.state.font;
  return out;
})()
