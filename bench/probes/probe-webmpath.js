(async () => {
  const A = window.__app, out = {};
  A.loadDemo();
  await new Promise(r => setTimeout(r, 400));

  // 让录制器只能出 WebM（模拟安卓旧内核）
  const origIs = MediaRecorder.isTypeSupported.bind(MediaRecorder);
  MediaRecorder.isTypeSupported = t => /mp4/i.test(t) ? false : origIs(t);

  // 拦下载：记文件名 + 大小 + 类型，不真的落盘
  let dlName = null;
  const origClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function(){ if (this.download) dlName = this.download; };
  let lastBlob = null;
  const origUrl = URL.createObjectURL;
  URL.createObjectURL = function (b) { if (b && b.size > 4096) lastBlob = b; return origUrl.call(URL, b); };

  A.state.duration = 3; document.getElementById('inDur').value = 3;
  document.getElementById('inRes').value = '720';
  document.getElementById('inMode').value = 'realtime';
  const st = document.getElementById('status');
  st.textContent = '已停止（切走了）· MP4 1920×1080 · 15.9 MB · 可拖进度';
  document.getElementById('btnRec').click();
  await new Promise(r => setTimeout(r, 60));
  out.earlyStatus = st.textContent.slice(0, 50);

  const t0 = performance.now();
  while (performance.now() - t0 < 45000) {
    if (!A.state.busy) break;
    await new Promise(r => setTimeout(r, 300));
  }
  out.finalStatus = st.textContent.slice(0, 160);
  out.fileName = dlName;
  out.blobType = lastBlob ? lastBlob.type : null;
  out.blobMB = lastBlob ? +(lastBlob.size / 1048576).toFixed(2) : null;

  HTMLAnchorElement.prototype.click = origClick;
  URL.createObjectURL = origUrl;
  MediaRecorder.isTypeSupported = origIs;
  return out;
})()
