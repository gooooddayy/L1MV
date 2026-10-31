(async () => {
  const A = window.__app, st = A.state, out = {};
  __seedDemo(A);
  await new Promise(r => setTimeout(r, 150));

  // 造一个 4 秒 WAV（44.1k 单声道正弦）
  const sr = 44100, secs = 4, n = sr * secs;
  const buf = new ArrayBuffer(44 + n * 2), dv = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); dv.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt ');
  dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
  dv.setUint32(24, sr, true); dv.setUint32(28, sr * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
  w(36, 'data'); dv.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) dv.setInt16(44 + i * 2, Math.sin(i * 0.02) * 12000, true);
  const file = new File([buf], 'test.wav', { type: 'audio/wav' });
  await A.loadAudioFile(file);
  out.audioDur = st.audioDur;

  // 记录编码器构造顺序 + MP4.build 的分片数
  window.__order = [];
  const AE = window.AudioEncoder, VE = window.VideoEncoder;
  window.AudioEncoder = function (...a) { window.__order.push('audio'); return new AE(...a); };
  window.VideoEncoder = function (...a) { window.__order.push('video'); return new VE(...a); };
  window.AudioEncoder.prototype = AE.prototype; window.VideoEncoder.prototype = VE.prototype;
  window.AudioEncoder.isConfigSupported = AE.isConfigSupported.bind(AE);
  window.VideoEncoder.isConfigSupported = VE.isConfigSupported.bind(VE);
  const origBuild = A.MP4.build;
  A.MP4.build = function (o) { out.vChunks = o.video.length; out.aChunks = o.audio.length; return origBuild(o); };

  st.duration = 4;
  document.getElementById('inDur').value = 4;
  document.getElementById('inRes').value = '1080';
  document.getElementById('btnRec').click();
  const t0 = performance.now(); let s = '';
  while (performance.now() - t0 < 90000) {
    s = document.getElementById('status').textContent;
    if (/已导出|失败|中断|取消/.test(s)) break;
    await new Promise(r => setTimeout(r, 300));
  }
  out.status = s;
  out.order = window.__order.slice(0, 3);
  out.resUsed = document.getElementById('inRes').value;
  out.pcmLeftMB = st.audioBuf ? +(st.audioBuf.length * 4 * st.audioBuf.numberOfChannels / 1048576).toFixed(1) : 0;
  A.MP4.build = origBuild;
  window.AudioEncoder = AE; window.VideoEncoder = VE;
  return out;
})()
