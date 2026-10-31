(async () => {
  const A = window.__app, out = {};
  __seedDemo(A);
  await new Promise(r => setTimeout(r, 600));

  const mkLrc = (n) => {
    const lines = [];
    for (let i = 0; i < n; i++) {
      const m = Math.floor(i / 60), s = i % 60;
      lines.push('[' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.00]第 ' + i + ' 句测试歌词内容');
    }
    return new Blob([lines.join('\n')], { type: 'text/plain' });
  };
  const input = document.getElementById('fileLrc2');

  const load = async (n) => {
    const f = new File([mkLrc(n)], 'big' + n + '.lrc', { type: 'text/plain' });
    const dt = new DataTransfer();
    dt.items.add(f);
    input.files = dt.files;
    const t0 = performance.now();
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(r => setTimeout(r, 700));
    return { ms: Math.round(performance.now() - t0), rows: document.querySelectorAll('#edList .ed-row').length, nodes: document.querySelectorAll('*').length };
  };

  out.lines200 = await load(200);
  out.lines500 = await load(500);
  out.lines1000 = await load(1000);
  out.bodyH = document.body.scrollHeight;
  out.cls = 0;
  return out;
})()
