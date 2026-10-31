/* 测试夹具：给探针造一份「封面 + 8 行歌词」的初始状态。
   产物里已经没有内置示例（v60.0.1 移除），这里只服务于自动化测试，
   不随 HTML 分发。run.mjs 会先注入本文件，探针里用 __seedDemo(A) 调用。 */
window.__seedDemo = function (A) {
  A = A || window.__app;
  if (!A) throw new Error('需要以 ?debug=1 打开页面');
  const S = 1200, c = document.createElement('canvas');
  c.width = c.height = S;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, S * 0.35, S);
  g.addColorStop(0, '#7fb9bd'); g.addColorStop(0.28, '#3f7f8d');
  g.addColorStop(0.62, '#1b4a5c'); g.addColorStop(1, '#0d2b39');
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  const rg = x.createRadialGradient(S * 0.34, S * 0.26, 0, S * 0.34, S * 0.26, S * 0.62);
  rg.addColorStop(0, 'rgba(236,252,246,.95)');
  rg.addColorStop(0.35, 'rgba(206,238,232,.42)');
  rg.addColorStop(1, 'rgba(206,238,232,0)');
  x.fillStyle = rg; x.fillRect(0, 0, S, S);
  x.strokeStyle = 'rgba(214,246,240,.55)';
  x.lineWidth = 3;
  x.beginPath(); x.moveTo(0, S * 0.63); x.lineTo(S, S * 0.63); x.stroke();

  A.state.img = c;
  A.state.imgName = 'seed';
  A.buildAll();

  A.setLyrics([
    '[ti:测试曲目]', '[ar:测试歌手]',
    '[00:00.60]第一行 测试歌词内容',
    '[00:04.90]第二行 稍微长一点的歌词',
    '[00:09.10]第三行 用来验证滚动与高亮',
    '[00:13.40]第四行 短句',
    '[00:17.60]第五行 再长一些的歌词内容用于排版',
    '[00:21.90]第六行 验证换行与字距',
    '[00:26.10]第七行 接近结尾',
    '[00:30.30]第八行 最后一句'
  ].join('\n'));

  A.seek(0);
  return { lines: A.state.lyrics.length, dur: A.state.duration };
};
