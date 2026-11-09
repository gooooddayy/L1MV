# bench · 回归测试工具

跑在真浏览器里的探针（CDP 驱动 Edge）。测的东西——`VideoEncoder`、`captureStream`、字体栅格化、`performance.memory`——jsdom 一个都没有，所以必须用真内核。

## 用法

```bash
# 通用形式：run.mjs <页面绝对路径> <探针> <headless|window>
node bench/run.mjs "C:/…/L1MV.html?debug=1" bench/probes/probe-final.js window

# 手机视口 + CPU 降速 4× + 断网
MOBILE=1 CPU=4 OFFLINE=1 node bench/run.mjs "C:/…/L1MV.html" bench/probes/probe-lowend.js window
```

- `?debug=1` 会挂 `window.__app`（正式打开时不存在）。测试素材由 `bench/seed.js` 注入，探针里调 `__seedDemo(A)`；产物本身不含任何示例素材。
- **换机器要改 `run.mjs` / `metrics.mjs` / `prof.mjs` / `shot.mjs` 顶部的 `EDGE` 常量。**
- `window` 模式比 `headless` 更接近真实（headless 的 `captureStream` 帧率不准）。

## 文件

| 文件 | 作用 |
|---|---|
| `run.mjs` | 通用驱动：起浏览器 → 注入探针 → 回传 JSON |
| `metrics.mjs` | 空闲 CPU / 堆内存 / GC 后残留 |
| `prof.mjs` | CPU 采样剖析 |
| `shot.mjs` | 多视口截图 |
| `assets_shot.mjs` | 生成仓库展示图（整页截图 + 画布导出） |
| `probes/` | 24 个用例，命名即用途 |

## 探针约定

- 一个探针只验一件事，返回纯 JSON。
- 不触发真实下载（把 `HTMLAnchorElement.prototype.click` 打桩成空函数）。
- 模拟能力缺失时 patch 原型（例如让 `AudioEncoder.configure` 抛错）。
- 具体断言以脚本内容为准——它们多半是为定位某一个问题临时写的，保留的是现场。

完整说明见 [docs/07-回归测试手册.md](../docs/07-回归测试手册.md)。

## 注意

自动化只能验容器结构、时长、像素签名。**音画同步必须人耳听**，画面一致必须人眼看。
