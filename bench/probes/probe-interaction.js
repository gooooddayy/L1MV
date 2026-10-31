(async () => {
  const A = window.__app, out = {};
  __seedDemo(A);
  await new Promise(r => setTimeout(r, 400));

  // 1) 模拟拖动字号滑块：连发 60 个 input 事件，量「同步阻塞」多久
  const fs = document.getElementById('inFs');
  const t0 = performance.now();
  for (let i = 0; i < 60; i++) {
    fs.value = String(30 + (i % 40));
    fs.dispatchEvent(new Event('input', { bubbles: true }));
  }
  out.sixtyInputsSyncMs = +(performance.now() - t0).toFixed(1);
  // 等一帧，看重绘是否只发生一次
  const t1 = performance.now();
  await new Promise(r => requestAnimationFrame(() => r()));
  out.firstFrameMs = +(performance.now() - t1).toFixed(1);
  out.fontSizeNow = A.state.fontSize;

  // 2) 单次渲染成本（预览画布 1080p）
  const t2 = performance.now();
  A.renderAt(5);
  out.singleRenderMs = +(performance.now() - t2).toFixed(1);

  // 3) 切页签耗时（含动画起步）
  const t3 = performance.now();
  document.querySelector('.mtab [data-tab=style]').click();
  out.tabSwitchSyncMs = +(performance.now() - t3).toFixed(1);
  await new Promise(r => setTimeout(r, 400));

  // 4) 歌词行编辑：连打 20 个字
  document.querySelector('.mtab [data-tab=preview]').click();
  await new Promise(r => setTimeout(r, 300));
  const txt = document.querySelector('#edList .x');
  out.hasTextInput = !!txt;
  if (txt) {
    const t4 = performance.now();
    for (let i = 0; i < 20; i++) {
      txt.value = '明月几时有把酒问青天' + '啊'.repeat(i % 5);
      txt.dispatchEvent(new Event('input', { bubbles: true }));
    }
    out.twentyKeystrokesSyncMs = +(performance.now() - t4).toFixed(1);
  }
  return out;
})()
