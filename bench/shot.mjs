import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const pageUrl = 'file:///' + process.argv[2].replace(/\\/g, '/');
const W = +process.argv[3], H = +process.argv[4];
const OUT = process.argv[5];
const profile = mkdtempSync(join(tmpdir(), 'l1mv-'));
const args = ['--remote-debugging-port=9334', '--user-data-dir=' + profile,
  '--window-position=-2400,0', '--window-size=1200,900',
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-features=CalculateNativeWinOcclusion',
  '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding',
  pageUrl];
const child = spawn(EDGE, args, { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

let target = null;
for (let i = 0; i < 60 && !target; i++) {
  try {
    const list = await (await fetch('http://127.0.0.1:9334/json/list')).json();
    target = list.find(t => t.type === 'page' && t.url.startsWith('file:'));
  } catch (e) {}
  if (!target) await sleep(400);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });

await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await sleep(1200);

const pre = process.argv[6];
if(pre) { await send('Runtime.evaluate', { expression: pre, awaitPromise: true }); await sleep(700); }

const probe = await send('Runtime.evaluate', {
  expression: `(() => {
    const r = e => { if(!e) return null; const b = e.getBoundingClientRect(); return {x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)}; };
    const q = s => document.querySelector(s);
    return {
      vw: innerWidth, vh: innerHeight,
      scrollW: document.documentElement.scrollWidth,
      overflowX: document.documentElement.scrollWidth > innerWidth,
      hd: r(q('.hd')), exp: r(q('.exp')), btn: r(q('#btnRec')),
      canvas: r(q('#cv')), stage: r(q('.stage-card')), panel: r(q('#panel')),
      bodyH: document.body.scrollHeight,
      probe: window.__probe || null,
      resOpts: window.__resOpts || null,
      resVal: window.__resVal || null,
      exportStatus: window.__st || null,
      mtab: (()=>{ const b=document.getElementById('mtab'); if(!b) return null; const bd=b.getBoundingClientRect(); const cs=getComputedStyle(b); return {pos:cs.position, display:cs.display, top:Math.round(bd.top), bottom:Math.round(bd.bottom), vh:innerHeight}; })(),
      expWrapped: (()=>{ const e=q('.exp'); return e ? Math.round(e.getBoundingClientRect().height) > 40 : null; })(),
      fontInput: getComputedStyle(q('#inTitle')).fontSize,
      tapTargets: Array.from(document.querySelectorAll('button,select,input[type=range]')).map(b=>{const x=b.getBoundingClientRect();return Math.round(Math.min(x.width,x.height));}).sort((a,b)=>a-b).slice(0,6),
      smalls: Array.from(document.querySelectorAll('button,select,input,label')).map(e=>{
        const b=e.getBoundingClientRect();
        return { t:e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.split(' ').join('.'):''),
                 w:Math.round(b.width), h:Math.round(b.height) };
      }).filter(o=>o.w>0&&o.h>0&&(o.w<28||o.h<28)).slice(0,14)
    };
  })()`, returnByValue: true
});
console.log(JSON.stringify(probe.result.result.value, null, 2));

const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !process.argv[7] });
writeFileSync(OUT, Buffer.from(shot.result.data, 'base64'));
ws.close(); child.kill('SIGKILL'); process.exit(0);
