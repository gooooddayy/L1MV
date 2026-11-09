# AGENTS.md · 给未来的自己与 AI 助手

> 换电脑、换会话、半年后回来，先读这一页。5 分钟能接上。
> 空白电脑从零开始：看 [docs/13-换电脑恢复清单](docs/13-换电脑恢复清单.md)。
> 更细的内容在 [docs/](docs/00-索引.md)。

## 这是什么

**L1MV 歌词播放器视频生成器** —— 一个 6.6 MB 的单文件网页工具。
输入：封面图 + 音频 + LRC 歌词。输出：720P/1080P/2K、横版/竖版的 MP4（H.264+AAC）或 MOV（H.264+PCM）。

唯一产物：[`L1MV.html`](L1MV.html)。双击即用，`file://` 可跑。

## 不可违反的约束

改任何代码前先看这 6 条，破了就等于换了产品：

1. **单文件**。不许引外部 JS/CSS/字体/图片，不许拆文件、不许打包器、不许 CDN。
2. **离线**。不许出现 `fetch` / `XMLHttpRequest` / `WebSocket` / `http(s)` 外链 / 统计脚本。
3. **预览 = 导出**。两者必须共用 `renderAt()`；`K === 1` 时输出要与旧版逐像素一致。
4. **参数快照**。点导出那一刻的状态被钉死（`snapshotState`），之后改参数只影响预览。
5. **失败不中止**。缺封面/歌词/音频/编码器失败都要换路继续；只有用户取消或内存到顶才停。
6. **零 console**。发布版不许有 `console.log` / `debugger` / `TODO`。调试入口只在 `?debug=1` 下挂 `window.__app`。

## 代码在哪（按功能搜函数名，别记行号）

| 要改什么 | 搜这个 |
|---|---|
| 画面布局 / 竖版参数 | `LAYOUTS`、`buildLayout`、`scaleLayout` |
| 逐帧画什么 | `renderAt`、`drawLyrics`、`drawCover`、`drawOverlays` |
| 静态层（背景/卡片/唱片） | `buildAll`、`buildBg` |
| 导出场景与快照 | `buildScene`、`snapshotState`、`withScene`、`disposeScene` |
| 分辨率 | `K`、`RS`、`applyLiveScale` |
| 编码器选择 | `pickExportFormat`、`targetBitrate` |
| 音频编码 | `encodeAudioTrack`、`aacWorks`、`buildPCMChunks` |
| 封装 MP4 | `MP4.build`、`sttsFrom`、`esds`、`sowt` |
| 录制 | `exportRealtime`、`pickMime`、`remuxRecordedMP4` |
| WebM 转码 | `WEBM2MP4`、`convert`、`fixWebm`、`blockReason` |
| 内存预算 | `memBreakdown`、`suggestMaxSeconds`、`probeAudioSeconds`、`PCM_HARD_MB` |
| 能力探测 | `CAP`、`applyCapabilities` |
| 移动端 | `isPhone`、`buildNiceSelect`、`syncNiceSelects` |
| 日志 | `logWarn`、`logErr`、`logDump` |
| 任务号 | `beginJob`、`jobOK` |

## 动手前的 8 条硬知识

1. **别信 `isConfigSupported`**。AAC 的支持性查询在部分安卓内核会误报。判断可用性要**真编一次**（`aacWorks` 用 4096 帧，1024 帧会让 `flush` 报错）。
2. **时间戳不能压**。VFR 素材必须按每帧真实时长写 `stts`，否则 4 分钟的片子会变成 2 分 50 秒。
3. **PCM 只进 MOV**。`mp4 + sowt` 在 Chrome 能播但 `decodeAudioData` 解不出，不做这种赌。
4. **WebM 的 Cluster 长度是「未知」**。解析时必须允许 `end` 回缩，遇下一个 Cluster 头就收尾。
5. **VP9 是全范围**。`VideoDecoder.configure` 要显式 `colorSpace.fullRange = true`，否则画面被压暗。
6. **字体 base64 不许进 `<style>`**。会让 HTML 解析从 40 ms 变成 590 ms。放 `#fontStore` 的 `text/plain`。
7. **切字体 / 导出前必须 `await ensureFontLoaded`**。否则当帧、甚至整片都会用回落字体，而且不容易发现。
8. **单级 rAF 推不动首屏**。回调在绘制之前执行，必须两级。

## 怎么验

```bash
# 导出冒烟（720P / 1080P / 录制）
node bench/run.mjs "C:/…/L1MV.html?debug=1" bench/probes/probe-final.js window

# 布局 / CLS / 点击目标
node bench/run.mjs "C:/…/L1MV.html" bench/probes/probe-audit.js window

# 手机视口
MOBILE=1 node bench/run.mjs "C:/…/L1MV.html" bench/probes/probe-nav.js window
```

驱动里的 `EDGE` 常量写死了 Windows 的 Edge 路径，换机器改一行。
**出片后必须人耳确认音画同步** —— 自动化只能验容器结构与时长。

## 改完的自检清单

- [ ] `node --check` 主脚本通过
- [ ] `grep -c "console.log\|debugger\|TODO"` 为 0
- [ ] 无新增 `http(s)://` 外链（SVG 命名空间除外）
- [ ] 1080P 导出结果与改动前**逐帧对比**无明显差异（除目标改动）
- [ ] 竖版、2K、无音频、无封面、无歌词 五种情况都能出片
- [ ] 手机视口 390×844 无横向溢出
- [ ] 导出中改参数不影响正在导的那条

## 风格约定

- 注释写**为什么**，不写「是什么」。每个不直观的写法上面都有一段中文说明，别删。
- 不引依赖、不 minify、不拆文件。
- 能用 20 行解决的别写 200 行；但**不要为了短而牺牲可读性**。
- 新增分支必须能说清「什么设备会进这条分支」，否则就是死代码。

## 已知限制（不是 bug，别修）

开头 0.4 s 静止（录制热身）｜录制只有 1 个 IDR｜手机录制 17–29 fps｜无 AAC 出 MOV｜60 分钟长片未实跑｜Safari/Firefox 未真机验证。

详见 [README 的「已知限制」](README.md#已知限制)。
