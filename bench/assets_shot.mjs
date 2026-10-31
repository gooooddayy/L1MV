import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PAGE = 'file:///' + process.argv[2].replace(/\\/g, '/') + '?demo=1';
const OUT = process.argv[3];
mkdirSync(OUT, { recursive: true });

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

async function shot(name, full = true) {
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90, captureBeyondViewport: full });
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

// ---- 桌面 ----
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
await sleep(3000);
await evalJs(`document.fonts.ready.then(()=>1)`);
await sleep(800);
await shot('screenshot-desktop.jpg', true);
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
await shot('screenshot-mobile.jpg', true);

ws.close(); child.kill('SIGKILL'); process.exit(0);
