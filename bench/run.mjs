import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const pageUrl = 'file:///' + process.argv[2].replace(/\\/g, '/');
const exprFile = process.argv[3];
const mode = process.argv[4] || 'headless';
const profile = mkdtempSync(join(tmpdir(), 'l1mv-'));

const args = ['--remote-debugging-port=9333', '--user-data-dir=' + profile,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--autoplay-policy=no-user-gesture-required',
  // 关键：窗口挪到屏幕外会让 Chromium 判定「被遮挡」→ 节流合成器/GPU，测出来的耗时忽高忽低
  '--disable-features=CalculateNativeWinOcclusion',
  '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding',
  '--disable-background-timer-throttling',
  pageUrl];
if (mode === 'headless') args.unshift('--headless=new');
else { args.unshift('--window-position=-2400,0'); args.unshift('--window-size=1366,900'); }

const child = spawn(EDGE, args, { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getTargets() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch('http://127.0.0.1:9333/json/list');
      const list = await r.json();
      const p = list.find(t => t.type === 'page' && t.url.startsWith('file:'));
      if (p && p.webSocketDebuggerUrl) return p;
    } catch (e) { /* not up yet */ }
    await sleep(400);
  }
  throw new Error('CDP 未就绪');
}

const target = await getTargets();
const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.onmessage = ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

function send(method, params = {}) {
  return new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
}

if(process.env.MOBILE){
  await send('Emulation.setDeviceMetricsOverride', { width:390, height:844, deviceScaleFactor:2, mobile:true });
  await send('Emulation.setTouchEmulationEnabled', { enabled:true, maxTouchPoints:5 });
  await sleep(600);
}

if(process.env.DSF){
  await send('Emulation.setDeviceMetricsOverride', { width: +(process.env.VW||1440), height: +(process.env.VH||900), deviceScaleFactor: +process.env.DSF, mobile: false });
  await sleep(600);
}
if(process.env.CPU){
  await send('Emulation.setCPUThrottlingRate', { rate: +process.env.CPU });
  await sleep(300);
}
if(process.env.OFFLINE){
  await send('Network.enable');
  await send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
  await sleep(300);
}

// 等页面脚本就绪
for (let i = 0; i < 60; i++) {
  const r = await send('Runtime.evaluate', { expression: 'typeof renderAt==="function" && typeof buildAll==="function"', returnByValue: true });
  if (r.result && r.result.result && r.result.result.value === true) break;
  await sleep(300);
}

// 注入测试夹具（产物里已无内置示例）：先加载 seed.js，探针里用 __seedDemo(A)
try {
  const seed = readFileSync(new URL('./seed.js', import.meta.url), 'utf8');
  await send('Runtime.evaluate', { expression: seed, returnByValue: true });
} catch (e) { console.log('seed skipped:', e.message); }

const expr = readFileSync(exprFile, 'utf8');
const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: 300000 });
if (r.result && r.result.exceptionDetails) console.log('ERR', JSON.stringify(r.result.exceptionDetails, null, 2));
else console.log(JSON.stringify(r.result.result.value, null, 2));

ws.close();
child.kill('SIGKILL');
process.exit(0);
