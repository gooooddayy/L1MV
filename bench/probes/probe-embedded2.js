(async () => {
  const A = window.__app, out = {};
  A.loadDemo();
  await new Promise(r => setTimeout(r, 800));
  const sel = document.getElementById('inFont');
  const cv = document.getElementById('cv');
  const ids = ['sans', 'song', 'kai', 'brush', 'script', 'round'];
  const sigs = {}, widths = {};
  const c = document.createElement('canvas').getContext('2d');
  for (const id of ids) {
    sel.value = id; sel.dispatchEvent(new Event('change'));
    await new Promise(r => setTimeout(r, 700));      // 等字体加载 + 二次重绘
    A.renderAt(6);
    sigs[id] = cv.toDataURL('image/png').slice(-1500);
    const fam = { sans: 'sans-serif', song: 'L1MV Song', kai: 'L1MV Kai', brush: 'L1MV Brush', script: 'L1MV Script', round: 'L1MV Round' }[id];
    c.font = '64px "' + fam + '"';
    widths[id] = Math.round(c.measureText('测试字体宽度测试').width);
  }
  out.widths = widths;
  out.distinct = {};
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++)
    out.distinct[ids[i] + '/' + ids[j]] = sigs[ids[i]] !== sigs[ids[j]];
  out.check = ids.map(id => ({ id, ok: document.fonts.check('64px "' + ({ song: 'L1MV Song', kai: 'L1MV Kai', brush: 'L1MV Brush', script: 'L1MV Script', round: 'L1MV Round' }[id] || 'sans-serif') + '"') }));
  return out;
})()
