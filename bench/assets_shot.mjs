import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// 生成仓库展示图。产物已无内置示例，这里用 seed 造封面；
// 歌词用公有领域的《水调歌头》只是为了截图好看，不随产品分发。
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PAGE = 'file:///' + process.argv[2].replace(/\\/g, '/') + '?debug=1';
const OUT = process.argv[3];
mkdirSync(OUT, { recursive: true });

const SEED = `window.__seedDemo = function(A){
  const S=1200,c=document.createElement('canvas');c.width=c.height=S;
  const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,S*0.35,S);
  g.addColorStop(0,'#7fb9bd');g.addColorStop(.28,'#3f7f8d');
  g.addColorStop(.62,'#1b4a5c');g.addColorStop(1,'#0d2b39');
  x.fillStyle=g;x.fillRect(0,0,S,S);
  const rg=x.createRadialGradient(S*0.34,S*0.26,0,S*0.34,S*0.26,S*0.62);
  rg.addColorStop(0,'rgba(236,252,246,.95)');rg.addColorStop(.35,'rgba(206,238,232,.42)');
  rg.addColorStop(1,'rgba(206,238,232,0)');x.fillStyle=rg;x.fillRect(0,0,S,S);
  x.strokeStyle='rgba(214,246,240,.55)';x.lineWidth=3;
  x.beginPath();x.moveTo(0,S*0.63);x.lineTo(S,S*0.63);x.stroke();
  A.state.img=c;A.state.imgName='cover.jpg';A.buildAll();
};`;

const LRC = `[ti:明月几时有]
[ar:苏轼]
[00:00.60]明月几时有
[00:04.90]把酒问青天
[00:09.10]不知天上宫阙
[00:13.40]今夕是何年
[00:17.60]我欲乘风归去
[00:21.90]又恐琼楼玉宇
[00:26.10]高处不胜寒
[00:30.30]起舞弄清影`;

const profile = mkdtempSync(join(tmpdir(), 'l1mv-shot-'));
const args = ['--remote-debugging-port=9337', '--user-data-dir=' + profile,
  '--window-position=-2400,0', '--window-size=1500,1000',
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-features=CalculateNativeWinOcclusion',
  '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding',
  PAGE];
const child = spawn(EDGE, args, { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

let target = null;
for (let i = 0; i < 80 && !target; i++) {
  try {
    const list = await (await fetch('http://127.0.0.1:9337/json/list')).json();
    target = list.find(t => t.type === 'page' && t.url.startsWith('file:'));
  } catch (e) {}
  if (!target) await sleep(400);
}
if (!target) { console.log('NO_TARGET'); process.exit(1); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  return r.result && r.result.result ? r.result.result.value : null;
};

async function shot(name) {
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90, captureBeyondViewport: true });
  writeFileSync(join(OUT, name), Buffer.from(s.result.data, 'base64'));
  console.log('saved', name);
}

async function canvasPng(name) {
  const d = await evalJs(`(()=>{const c=document.getElementById('cv');try{return c.toDataURL('image/jpeg',0.92)}catch(e){return 'ERR:'+e.message}})()`);
  if (!d || d.startsWith('ERR')) { console.log('canvas fail', d); return false; }
  writeFileSync(join(OUT, name), Buffer.from(d.split(',')[1], 'base64'));
  console.log('saved', name, Math.round(d.length / 1024) + 'KB');
  return true;
}

const paint = `(()=>{
  __seedDemo(window.__app);
  const A = window.__app;
  A.setLyrics(${JSON.stringify(LRC)});
  A.seek(0);
  const n = document.getElementById('imgName'); if(n) n.textContent = 'cover.jpg';
  const d = document.getElementById('dropImg'); if(d) d.classList.add('has');
  return A.state.lyrics.length;
})()`;

// ---- 桌面 ----
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
await sleep(3000);
await evalJs(SEED);
console.log('seeded lines', await evalJs(paint));
await evalJs(`document.fonts.ready.then(()=>1)`);
await sleep(900);
await shot('screenshot-desktop.jpg');
await canvasPng('preview-16x9.jpg');

// ---- 竖版输出 ----
await evalJs(`(()=>{const r=document.querySelector('input[name=orient][value=portrait]');if(!r)return 0;r.checked=true;r.dispatchEvent(new Event('change',{bubbles:true}));return 1})()`);
await sleep(1500);
await canvasPng('preview-9x16.jpg');

// ---- 手机 ----
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Page.reload', {});
await sleep(3500);
await evalJs(SEED);
await evalJs(paint);
await sleep(900);
await shot('screenshot-mobile.jpg');

ws.close(); child.kill('SIGKILL'); process.exit(0);
