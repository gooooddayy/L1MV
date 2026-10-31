(async () => {
  const out = {};
  const wraps = [...document.querySelectorAll('.exp .msel')];
  const openCount = () => document.querySelectorAll('.msel-menu.open').length;

  // 1) 先开 MP4，再开 1080P
  wraps[0].querySelector('.msel-btn').click();
  await new Promise(r => setTimeout(r, 120));
  out.afterFirst = { menus: openCount(), wrap0Open: wraps[0].classList.contains('open') };
  wraps[1].querySelector('.msel-btn').click();
  await new Promise(r => setTimeout(r, 120));
  out.afterSecond = {
    menus: openCount(),
    wrap0Open: wraps[0].classList.contains('open'),
    wrap1Open: wraps[1].classList.contains('open'),
    menuTexts: [...document.querySelectorAll('.msel-menu.open')].map(m => m.textContent.slice(0, 12))
  };
  wraps[1].querySelector('.msel-btn').click();     // 关掉
  await new Promise(r => setTimeout(r, 100));

  // 2) 字体菜单：内部点击 / 内部滚动 不应关闭
  const fontWrap = [...document.querySelectorAll('.msel')].find(w => w.querySelector('#inFont'));
  fontWrap.querySelector('.msel-btn').click();
  await new Promise(r => setTimeout(r, 150));
  const menu = document.querySelector('.msel-menu.open');
  out.fontOpen = !!menu;
  out.canScroll = menu.scrollHeight > menu.clientHeight;
  menu.click();                                    // 点菜单空白/滚动条
  await new Promise(r => setTimeout(r, 100));
  out.afterClickInside = !!document.querySelector('.msel-menu.open');
  menu.scrollTop = 80;                             // 内部滚动
  await new Promise(r => setTimeout(r, 200));
  out.afterScrollInside = !!document.querySelector('.msel-menu.open');
  out.scrollTop = Math.round(menu.scrollTop);

  // 3) 页面滚动 → 应关闭
  window.scrollTo(0, 300);
  await new Promise(r => setTimeout(r, 250));
  out.afterPageScroll = !!document.querySelector('.msel-menu.open');
  window.scrollTo(0, 0);
  return out;
})()
