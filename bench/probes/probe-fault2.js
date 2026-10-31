(async () => {
  const A = window.__app, st = A.state, out = {};
  __seedDemo(A);
  await new Promise(r => setTimeout(r, 400));
  const stEl = document.getElementById('status');
  document.getElementById('inRes').value = '720';
  document.getElementById('inFmt').value = 'mp4';
  const wait = async (ms) => { const t0 = performance.now(); while (performance.now() - t0 < ms) { if (!st.busy && !st.recording) return true; await new Promise(r => setTimeout(r, 80)); } return false; };

  // ③ 音频解码失败：应出无声片并说明，不中断
  const realDec = OfflineAudioContext.prototype.decodeAudioData;
  OfflineAudioContext.prototype.decodeAudioData = function(){ return Promise.reject(new Error('bad audio')); };
  const sr = 44100, n2 = sr * 2;
  const buf = new ArrayBuffer(44 + n2 * 4), dv = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  w(0,'RIFF'); dv.setUint32(4,36+n2*4,true); w(8,'WAVEfmt ');
  dv.setUint32(16,16,true); dv.setUint16(20,1,true); dv.setUint16(22,2,true);
  dv.setUint32(24,sr,true); dv.setUint32(28,sr*4,true); dv.setUint16(32,4,true); dv.setUint16(34,16,true);
  w(36,'data'); dv.setUint32(40,n2*4,true);
  await A.loadAudioFile(new File([buf], 'bad.wav', { type: 'audio/wav' }));
  out.importStatus = stEl.textContent.slice(0, 70);
  out.audioBuf = st.audioBuf ? 'yes' : 'null';
  document.getElementById('inDur').value = 2; st.duration = 2;
  stEl.textContent = '';
  document.getElementById('btnRec').click();
  out.c_done = await wait(25000);
  out.c_status = stEl.textContent.slice(0, 110);
  out.c_busy = st.busy;
  OfflineAudioContext.prototype.decodeAudioData = realDec;

  // ④ 录制初始化失败：captureStream 抛
  const realCap = HTMLCanvasElement.prototype.captureStream;
  HTMLCanvasElement.prototype.captureStream = function(){ throw new DOMException('no capture', 'NotSupportedError'); };
  document.getElementById('inMode').value = 'realtime';
  stEl.textContent = '';
  document.getElementById('btnRec').click();
  out.d_done = await wait(12000);
  out.d_status = stEl.textContent.slice(0, 110);
  out.d_busy = st.busy;
  out.d_recording = st.recording;
  out.d_recbar = document.getElementById('recbar').classList.contains('on');
  HTMLCanvasElement.prototype.captureStream = realCap;
  document.getElementById('inMode').value = 'fast';

  out.logTail = A.logDump().split('\n').slice(-5);
  return out;
})()
