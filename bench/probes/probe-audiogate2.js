(async () => {
  const A = window.__app, out = {};
  A.loadDemo(); await new Promise(r => setTimeout(r, 300));
  // 55 分钟、8kHz 单声道 16bit：文件只有 ~52MB，但解码后是 48k 立体声 ≈ 1.27GB
  const sr = 8000, secs = 5400, n = sr * secs;
  const buf = new ArrayBuffer(44 + n * 2), dv = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  w(0,'RIFF'); dv.setUint32(4, 36 + n*2, true); w(8,'WAVEfmt ');
  dv.setUint32(16,16,true); dv.setUint16(20,1,true); dv.setUint16(22,1,true);
  dv.setUint32(24,sr,true); dv.setUint32(28,sr*2,true); dv.setUint16(32,2,true); dv.setUint16(34,16,true);
  w(36,'data'); dv.setUint32(40, n*2, true);
  for (let i = 0; i < n; i += 400) dv.setInt16(44 + i*2, Math.sin(i*0.01)*8000, true);
  const file = new File([buf], 'long90.wav', { type: 'audio/wav' });
  out.fileMB = +(file.size / 1048576).toFixed(1);

  const t0 = performance.now();
  await A.loadAudioFile(file);
  out.ms = Math.round(performance.now() - t0);
  out.status = document.getElementById('status').textContent.slice(0, 200);
  out.audioReady = A.state.audioReady;
  out.audioDur = A.state.audioDur;
  out.hasBuf = !!A.state.audioBuf;
  return out;
})()
