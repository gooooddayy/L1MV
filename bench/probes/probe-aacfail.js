(async () => {
  const A = window.__app, out = {};
  A.loadDemo(); await new Promise(r => setTimeout(r, 300));

  // 让 AAC 真的编不出来（configure 直接抛），但其他编码器正常
  const RealAE = window.AudioEncoder;
  function BrokenAE(o){ this._e = new RealAE(o); }
  BrokenAE.prototype.configure = function(){ throw new DOMException('no aac here', 'NotSupportedError'); };
  BrokenAE.prototype.encode = function(d){ return this._e.encode(d); };
  BrokenAE.prototype.flush = function(){ return this._e.flush(); };
  BrokenAE.prototype.close = function(){ return this._e.close(); };
  BrokenAE.isConfigSupported = RealAE.isConfigSupported.bind(RealAE);
  window.AudioEncoder = BrokenAE;

  const sr = 44100, n = sr * 4;
  const buf = new ArrayBuffer(44 + n * 4), dv = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  w(0,'RIFF'); dv.setUint32(4,36+n*4,true); w(8,'WAVEfmt ');
  dv.setUint32(16,16,true); dv.setUint16(20,1,true); dv.setUint16(22,2,true);
  dv.setUint32(24,sr,true); dv.setUint32(28,sr*4,true); dv.setUint16(32,4,true); dv.setUint16(34,16,true);
  w(36,'data'); dv.setUint32(40,n*4,true);
  for (let i = 0; i < n; i++) { const v = Math.sin(i * 0.02) * 9000; dv.setInt16(44+i*4,v,true); dv.setInt16(46+i*4,v,true); }
  await A.loadAudioFile(new File([buf], 't4.wav', { type: 'audio/wav' }));

  let blob = null, name = null;
  const oc = HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click = function(){ if (this.download) name = this.download; };
  const ou = URL.createObjectURL; URL.createObjectURL = function (b) { if (b && b.size > 4096) blob = b; return ou.call(URL, b); };

  A.state.duration = 3; document.getElementById('inDur').value = 3;
  document.getElementById('inRes').value = '720';
  document.getElementById('inMode').value = 'fast';
  document.getElementById('btnRec').click();
  const t0 = performance.now();
  while (performance.now() - t0 < 60000) { if (!A.state.busy) break; await new Promise(r => setTimeout(r, 150)); }

  out.status = document.getElementById('status').textContent.slice(0, 150);
  out.name = name;
  out.type = blob ? blob.type : null;
  if (blob) {
    const u8 = new Uint8Array(await blob.slice(0, Math.min(blob.size, 400000)).arrayBuffer());
    const s = Array.from(u8).map(b => String.fromCharCode(b)).join('');
    out.boxes = { sowt: s.includes('sowt'), mp4a: s.includes('mp4a') };
    try {
      const dec = await new OfflineAudioContext(2, 48000, 48000).decodeAudioData(await blob.arrayBuffer());
      out.audioSec = +dec.duration.toFixed(2);
    } catch (e) { out.audioErr = e.message; }
  }
  window.AudioEncoder = RealAE;
  HTMLAnchorElement.prototype.click = oc; URL.createObjectURL = ou;
  return out;
})()
