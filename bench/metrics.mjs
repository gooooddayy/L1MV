import { spawn } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const pageUrl = 'file:///' + process.argv[2].replace(/\\/g, '/');
const exprFile = process.argv[3];
const profile = mkdtempSync(join(tmpdir(), 'l1mv-m-'));

const args = ['--headless=new', '--remote-debugging-port=9335', '--user-data-dir=' + profile,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--autoplay-policy=no-user-gesture-required',
  '--disable-features=CalculateNativeWinOcclusion',
  '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding',
  '--disable-background-timer-throttling', pageUrl];
const child = spawn(EDGE, args, { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch('http://127.0.0.1:9335/json/list');
      const list = await r.json();
      const p = list.find(t => t.type === 'page' && t.url.startsWith('file:'));
      if (p) return p;
    } catch (e) {}
    await sleep(400);
  }
  throw new Error('CDP 未就绪');
}
const t = await getTarget();
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });

for (let i = 0; i < 60; i++) {
  const r = await send('Runtime.evaluate', { expression: 'typeof buildMovie==="function"', returnByValue: true });
  if (r.result?.result?.value === true) break;
  await sleep(300);
}

async function metrics() {
  const r = await send('Performance.getMetrics');
  const m = {};
  for (const x of r.result.metrics) m[x.name] = x.value;
  return m;
}
async function heap() {
  const r = await send('Runtime.getHeapUsage');
  return r.result ? { usedMB: +(r.result.usedSize / 1048576).toFixed(1), totalMB: +(r.result.totalSize / 1048576).toFixed(1) } : null;
}

await send('Performance.enable');
await sleep(800);

// 1) 空闲 3 秒的 CPU（主线程任务时长）
const a0 = await metrics();
const h0 = await heap();
await sleep(3000);
const a1 = await metrics();
const idle = {
  taskSec: +(a1.TaskDuration - a0.TaskDuration).toFixed(2),
  scriptSec: +(a1.ScriptDuration - a0.ScriptDuration).toFixed(3),
  layoutSec: +((a1.LayoutDuration || 0) - (a0.LayoutDuration || 0)).toFixed(3),
  styleSec: +((a1.RecalcStyleDuration || 0) - (a0.RecalcStyleDuration || 0)).toFixed(3)
};

const expr = readFileSync(exprFile, 'utf8');
const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: 300000 });
const res = r.result?.result?.value;
const h1 = await heap();
await send('HeapProfiler.collectGarbage');
await sleep(400);
const h2 = await heap();

console.log(JSON.stringify({ idle3s: idle, heapBefore: h0, heapAfterExport: h1, heapAfterGC: h2, task: res }, null, 1));
ws.close(); child.kill('SIGKILL'); process.exit(0);
