(async () => {
  const A = window.__app, out = {};
  __seedDemo(A);
  await new Promise(r => setTimeout(r, 400));

  // 3 秒 WAV，让录制带上音轨
  const sr = 44100, secs = 6, n = sr * secs, ch = 2;
  const buf = new ArrayBuffer(44 + n * ch * 2), dv = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  w(0,'RIFF'); dv.setUint32(4,36+n*ch*2,true); w(8,'WAVEfmt ');
  dv.setUint32(16,16,true); dv.setUint16(20,1,true); dv.setUint16(22,ch,true);
  dv.setUint32(24,sr,true); dv.setUint32(28,sr*ch*2,true); dv.setUint16(32,ch*2,true); dv.setUint16(34,16,true);
  w(36,'data'); dv.setUint32(40,n*ch*2,true);
  for (let i = 0; i < n; i++) { const v = Math.sin(i * 0.02) * 9000; dv.setInt16(44+i*4,v,true); dv.setInt16(46+i*4,v,true); }
  await A.loadAudioFile(new File([buf], 't6.wav', { type: 'audio/wav' }));

  let dlName = null, blob = null;
  const origClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () { if (this.download) dlName = this.download; };
  const origUrl = URL.createObjectURL;
  URL.createObjectURL = function (b) { if (b && b.size > 4096) blob = b; return origUrl.call(URL, b); };

  A.state.duration = 4; document.getElementById('inDur').value = 4;
  document.getElementById('inRes').value = '720';
  document.getElementById('inMode').value = 'realtime';
  document.getElementById('inFmt').value = 'mp4';
  document.getElementById('btnRec').click();
  const t0 = performance.now();
  while (performance.now() - t0 < 60000) { if (!A.state.busy) break; await new Promise(r => setTimeout(r, 250)); }
  out.status = document.getElementById('status').textContent.slice(0, 120);
  out.fileName = dlName;
  out.blobMB = blob ? +(blob.size / 1048576).toFixed(2) : null;

  if (blob) {
    const url = origUrl.call(URL, blob);
    const v = document.createElement('video'); v.src = url; v.muted = true;
    await new Promise(r => { v.onloadedmetadata = r; v.onerror = r; setTimeout(r, 5000); });
    out.dur = isFinite(v.duration) ? +v.duration.toFixed(2) : String(v.duration);
    out.size = v.videoWidth + 'x' + v.videoHeight;
    try {
      const ab = await blob.arrayBuffer();
      const dec = await new OfflineAudioContext(2, 48000, 48000).decodeAudioData(ab);
      out.audioSec = +dec.duration.toFixed(2);
      let peak = 0; const d0 = dec.getChannelData(0);
      for (let i = 0; i < Math.min(d0.length, 48000 * 4); i++) peak = Math.max(peak, Math.abs(d0[i]));
      out.audioPeak = +peak.toFixed(3);
    } catch (e) { out.audioErr = e.message; }
    // 能否拖动（moz 属性不需要；用 seek 测试）
    v.currentTime = 1.5;
    await new Promise(r => { v.onseeked = r; setTimeout(r, 3000); });
    out.seekOk = Math.abs(v.currentTime - 1.5) < 0.6;
    URL.revokeObjectURL(url);
  }
  HTMLAnchorElement.prototype.click = origClick;
  URL.createObjectURL = origUrl;
  return out;
})()
