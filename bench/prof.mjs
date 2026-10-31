import { spawn } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const pageUrl = 'file:///' + process.argv[2].replace(/\\/g, '/');
const exprFile = process.argv[3];
const profile = mkdtempSync(join(tmpdir(), 'l1mv-prof-'));

const args = ['--headless=new', '--remote-debugging-port=9334', '--user-data-dir=' + profile,
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
      const r = await fetch('http://127.0.0.1:9334/json/list');
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

await send('Profiler.enable');
await send('Profiler.setSamplingInterval', { interval: 200 });
await send('Profiler.start');

const expr = readFileSync(exprFile, 'utf8');
const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: 300000 });
const res = r.result?.result?.value;
const prof = await send('Profiler.stop');

const p = prof.result.profile;
const byId = new Map(p.nodes.map(n => [n.id, n]));
const self = new Map();
const total = p.samples.length;
for (const s of p.samples) {
  const n = byId.get(s);
  if (!n) continue;
  const cf = n.callFrame;
  const key = (cf.functionName || '(anonymous)') + ' @' + (cf.lineNumber + 1) + ':' + (cf.columnNumber + 1);
  self.set(key, (self.get(key) || 0) + 1);
}
const rows = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 26)
  .map(([k, v]) => ({ fn: k, pct: +(v / total * 100).toFixed(1) }));

console.log(JSON.stringify({ result: res, samples: total, top: rows }, null, 1));
ws.close(); child.kill('SIGKILL'); process.exit(0);
