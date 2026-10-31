<div align="center">

<img src="assets/social-preview.jpg" alt="L1MV 歌词播放器视频生成器 — 封面 + 音频 + LRC 导出 MP4" width="820">

# L1MV · 歌词播放器视频生成器

**歌词播放器视频生成 · 音乐播放器效果生成**

一张封面 + 一段音频 + 一份 LRC 歌词 → 一条带唱片、歌词滚动、光影特效的 MV

[![License](https://img.shields.io/badge/license-MIT-2f6fed)](LICENSE)
[![Single File](https://img.shields.io/badge/single--file-6.6%20MB-1c8f5f)](播放器视频生成器.html)
[![Dependencies](https://img.shields.io/badge/dependencies-0-1c8f5f)](#技术亮点)
[![Offline](https://img.shields.io/badge/offline-100%25-1c8f5f)](#常见问题)
[![WebCodecs](https://img.shields.io/badge/WebCodecs-H.264%20%2B%20AAC-2f6fed)](docs/03-导出链路.md)

[快速开始](#快速开始) · [功能](#功能清单) · [和别的工具比](#和同类工具比) · [文档](#文档导航) · [常见问题](#常见问题) · [English](README.en.md)

</div>

---

## 这是什么

一个**单文件、零依赖、完全离线**的网页工具。双击 HTML 就能用，不需要安装、不需要服务器、不需要联网，音频和封面**不会离开你的电脑**。

它解决的是同一件事：**给一首歌配一条能直接发出去的视频**——不是套模板的 PPT 轮播，而是把「音乐 App 播放页」搬进画面里：封面卡、唱片弹出、逐行歌词滚动、水中倒影、光影扫过、胶片颗粒。

| 输入 | 输出 |
|---|---|
| 封面图（JPG/PNG/WebP/GIF/BMP/AVIF/SVG）<br>音频（MP3/M4A/AAC/WAV/FLAC/OGG/Opus/WebM，可选）<br>歌词（LRC / TXT，可选） | **MP4**（H.264 + AAC，默认）或 **MOV**<br>720P / 1080P / 2K<br>横版 1920×1080 / 竖版 1080×1920<br>剪映、Premiere、微信、相册都能直接导入 |

> 单文件 6.62 MB，其中 **96% 是内置的 5 款中文字体**（离线、子集化、OFL 授权）；JS 217 KB + CSS 22 KB，剩下的才是界面。

---

## 快速开始

### 电脑（推荐 Chrome / Edge）

1. 下载 [`播放器视频生成器.html`](播放器视频生成器.html)（右上角 **Download raw file**，或从 [Releases](https://github.com/gooooddayy/L1MV/releases) 下载）。
2. **双击打开**（`file://` 即可，不用起服务器）。
3. 拖入封面 → 拖入音频 → 拖入/粘贴歌词 → 点「导出视频」。
4. 快速编码约 **1.3–2.3× 速**（10 秒片约 2–11 秒出片）；兼容录制约 1× 速，但兼容性最好。

### 手机

同一个文件用 Chrome / Safari 打开：底栏两个页签左右滑动切换，歌词列表在播放条下方，默认 1080P，内存不够会自动降 720P 并说明原因。**录制期间别切走、别锁屏**（切走即停并保存已录部分）。

### 想先看效果

在线 Demo：**https://gooooddayy.github.io/L1MV/**

---

## 功能清单

| 能力 | 说明 |
|---|---|
| **两条导出链路** | 快速编码（WebCodecs 离线编码，比实时快）/ 兼容录制（MediaRecorder 录屏，兼容性兜底），失败自动交叉降级 |
| **真 MP4** | 自己写的 MP4 封装器（ftyp/moov/mdat、stts 逐样本时长、avcC、esds、elst），不是「录屏出 WebM 再改名」 |
| **分辨率** | 720P / 1080P（默认）/ 2K 2560×1440；横竖版自动转置；手机端隐藏 2K |
| **歌词** | `[mm:ss]` `[mm:ss.xx]` `[mm:ss.xxx]` `[mm:ss:xx]` 四种时间戳；同行多时间戳；GB2312/GBK/Big5/UTF-8(BOM)/UTF-16；enhanced LRC 词级标记自动剥离 |
| **字体** | 内置 5 款中文（宋/楷/毛笔/行书/圆润，离线）+ 本机已装字体 + 自行导入 ttf/otf |
| **特效** | 水中倒影、左右摇晃、高级光影、胶片颗粒、光扫，逐项开关 + 强度滑杆 |
| **叠加素材** | 图片或视频叠加，支持混合模式与透明度 |
| **移动端** | 跟手翻页、自绘下拉、按内存自动降档、录制期间保持常亮 |
| **稳定性** | 任务号防串台、导入序号防竞态、内存护栏、200 条日志环、能力自检降级 |

---

## 技术亮点

<details>
<summary><b>1. 浏览器里直接产出 MP4（不依赖 ffmpeg.wasm）</b></summary>

`VideoEncoder` 出 H.264，`AudioEncoder` 出 AAC，剩下的事自己做：写 `ftyp/moov/mdat`，`stts` 按**每一帧的真实时长**写（VFR 不会把 4 分钟的片子压成 2 分 50 秒），AAC 的 priming 用 `elst` 校正，`esds` 手写描述符。

没有 AAC 编码器的国产内核怎么办？退成 **MOV + 未压缩 PCM**（`sowt` 采样条目）——这是 QuickTime 的标准组合，剪映能导入，比「无声 MP4」和「WebM」都强。
</details>

<details>
<summary><b>2. 能力探测不撒谎</b></summary>

`AudioEncoder.isConfigSupported()` 在部分安卓内核会误报「没有 AAC」，真编却能出来。所以判断链是**真编 4096 帧**（1024 帧会 `flush` 报错，那是探测方法的问题），并且按 `mp4a.40.2@192k → 128k → 96k → mp4a.40.5@64k → 40.29 → 40.1` 逐档试。
</details>

<details>
<summary><b>3. 6.5 MB 字体不拖慢首屏</b></summary>

字体 base64 放在 `<script type="text/plain">` 而不是 `<style>` 里：CSS 解析器要对每个 base64 token 做词法分析 + 字符串驻留（实测 590 ms），HTML 解析器只做一次纯文本扫描。HTML 解析 590 ms → **40 ms**，FCP 1544 → **1196 ms**。

字体只在选中或导出时才 `new FontFace()` 注册，注册完立刻清空节点释放常驻内存。
</details>

<details>
<summary><b>4. 导出时改参数不影响正在导的那条</b></summary>

点导出那一刻对布局、字体、特效、音频、格式做**快照**，之后所有改动只影响预览。同时预览层被摘出合成，页面重绘不再拖慢编码器。
</details>

<details>
<summary><b>5. 崩溃是被设计掉的，不是被祈祷掉的</b></summary>

- 任务号 `beginJob()/jobOK()`：上一轮晚到的回调不改新任务的状态、不触发多余下载
- 导入序号：连续选两段音频，先发的解码后回来不会覆盖后选的
- 内存护栏：导出中每 32 帧查一次堆，超 1200 MB（手机）/ 2600 MB（PC）主动停并说明原因
- 音频导入硬闸门：预估 PCM > 1800 MB（≈80 分钟）直接拒收，不进入解码
</details>

---

## 实测数据

| 指标 | 数值 |
|---|---|
| HTML 解析 | 32–51 ms（字体移出 CSS 前 586–619 ms） |
| FCP（file://） | 1148–1208 ms |
| 连发 60 次字号滑块 | 0.7 ms（合并到一帧前 1506 ms） |
| 1080P 10 秒导出 | ≈5.1 s（约 2× 速，Intel HD 630） |
| 1080P 20 秒导出 | 10.7 s（已到核显编码器上限 86 fps） |
| 长稳 10 轮导出 | 全部成功，堆恒定 9.5 MB |
| CLS | 0 |
| 外链 / fetch / eval / localStorage | 全部 0 |

> 完整数据、测量方法与「哪些优化被实测否决」见 [docs/05-性能复盘.md](docs/05-性能复盘.md)。

---

## 和同类工具比

| | **L1MV** | 剪映 / CapCut | 在线 SaaS（VEED、Capify、EchoWave…） | 脚本类开源（Python + ffmpeg） |
|---|---|---|---|---|
| 安装 | **不用，双击 HTML** | 装 App | 不用 | Python + ffmpeg + 依赖 |
| 联网 | **完全不用** | 部分功能要 | 必须 | 装依赖要 |
| 素材去向 | **不出本机** | 上传云端（部分） | 上传云端 | 本机 |
| 中文歌词排版 | **内置 5 款中文字体** | 要会员字体 | 字体少 | 看系统 |
| MP4 输出 | **真 H.264 + AAC** | 是 | 云端渲染 | 是（ffmpeg） |
| 水印 | **无** | 部分功能有 | 免费档常有 | 无 |
| 竖版 9:16 | 是 | 是 | 是 | 多数要自己改 |
| 上手成本 | 拖三个文件 | 学剪辑 | 注册 + 上传 | 配环境 |

更细的调研（含 GitHub 同类项目星数、各家限制）见 [docs/09-同类工具调研.md](docs/09-同类工具调研.md)。

---

## 文档导航

> 换电脑后想快速捡回上下文，先看 **[AGENTS.md](AGENTS.md)**（一页纸：这是什么、代码在哪、哪些坑不能踩）。

| 文档 | 内容 |
|---|---|
| [AGENTS.md](AGENTS.md) | 给未来的自己 / AI 助手：项目速览、不变量、禁区 |
| [docs/00-索引.md](docs/00-索引.md) | 全部文档的导航与阅读顺序 |
| [docs/01-产品说明.md](docs/01-产品说明.md) | 它解决什么问题、功能边界、交互设计 |
| [docs/02-技术架构.md](docs/02-技术架构.md) | 单文件结构、渲染管线、状态管理、性能取舍 |
| [docs/03-导出链路.md](docs/03-导出链路.md) | 快速编码 / 兼容录制 / WebM 转 MP4 / MOV 兜底，逐段拆解 |
| [docs/04-踩坑全集.md](docs/04-踩坑全集.md) | **39 条真实踩坑**，按编码/音频/字体/移动端/性能/并发分类 |
| [docs/05-性能复盘.md](docs/05-性能复盘.md) | 首屏、交互、导出的优化前后数据与被否决的方案 |
| [docs/06-兼容性矩阵.md](docs/06-兼容性矩阵.md) | 浏览器 × 能力 × 降级路径，含最低版本 |
| [docs/07-回归测试手册.md](docs/07-回归测试手册.md) | 怎么跑探针、看什么指标、验收标准 |
| [docs/08-决策记录.md](docs/08-决策记录.md) | 13 条 ADR：为什么不做 4K、为什么 PCM 不进 MP4… |
| [docs/09-同类工具调研.md](docs/09-同类工具调研.md) | 竞品清单与差异化定位 |
| [docs/10-SEO与曝光方案.md](docs/10-SEO与曝光方案.md) | 关键词地图、GitHub 站内 SEO、搜索引擎 SEO、推广渠道 |
| [docs/11-字体与许可.md](docs/11-字体与许可.md) | 5 款字体的来源、授权、子集化命令 |
| [CHANGELOG.md](CHANGELOG.md) | v1 → v60 的版本演进 |

---

## 常见问题

<details>
<summary><b>真的完全离线吗？会上传我的音频吗？</b></summary>

是，完全离线。文件里没有任何 `http(s)` 外链、没有 `fetch`/`XMLHttpRequest`/`WebSocket`、没有统计脚本、没有 `localStorage`/cookie。断网、内网、U 盘拷贝都能用。你可以把浏览器断网后再导出验证。
</details>

<details>
<summary><b>支持哪些歌词格式和时间戳？</b></summary>

LRC 与纯文本 TXT。时间戳支持 `[mm:ss]`、`[mm:ss.xx]`、`[mm:ss.xxx]`、`[mm:ss:xx]` 四种写法，同一行可以挂多个时间戳（重复句），enhanced LRC 的词级 `<mm:ss.xx>` 标记会自动剥掉。文件编码支持 UTF-8（含 BOM）、UTF-16、GB2312、GBK、Big5——拖进去就自动判。
</details>

<details>
<summary><b>能导出 4K 吗？</b></summary>

不做 4K。浏览器 H.264 编码器在 4K 上帧率会掉到个位数，收益远小于代价；2K（2560×1440）是实测能稳的上限。详见 [ADR-02](docs/08-决策记录.md)。
</details>

<details>
<summary><b>为什么我导出的是 MOV 而不是 MP4？</b></summary>

说明你这台设备的浏览器**没有 AAC 音频编码器**（部分国产内核会把 AAC 裁掉）。MP4 容器只认 AAC，所以自动改走 MOV（H.264 + 未压缩 PCM）——这是 QuickTime 的标准组合，剪映、PR 都能导入，而且**有声音**。状态栏会写明原因。
</details>

<details>
<summary><b>手机上能用吗？为什么录制只有 17–29 fps？</b></summary>

能。手机端是同一份文件，做了跟手翻页和自绘下拉。录制帧率取决于设备实时渲染 1080P + 全特效的能力，中端机大约 17–29 fps；想更流畅就选 720P。**快速编码不受此限制**，它是离线逐帧编码，帧率恒定 30。
</details>

<details>
<summary><b>导出比实时快多少？</b></summary>

快速编码在 1080P、特效全开、10 秒片上约 2× 速；40 秒片约 1.3–1.8× 速。上限是核显/独显的编码器吞吐（实测 Intel HD 630 约 86 fps）。兼容录制是 1× 速（实时）。
</details>

<details>
<summary><b>需要装 ffmpeg 或 Python 吗？</b></summary>

不需要，一个文件都没有。MP4 封装、WebM 解析、音频重采样全部是文件内的 JS。
</details>

<details>
<summary><b>可以商用吗？字体有版权风险吗？</b></summary>

代码 MIT。内置 5 款字体均为 SIL Open Font License 1.1（可商用、可嵌入），详见 [NOTICE.md](NOTICE.md)。你导入的音频、封面、歌词的版权由你自己负责——工具只做本地渲染，不分发任何素材。
</details>

<details>
<summary><b>为什么成片开头有 0.4 秒静止？</b></summary>

只有**兼容录制**模式有：MediaRecorder 起录时要热身 0.4–0.5 秒。裁掉它会把开头唯一的关键帧切走（表现是前 3 秒黑屏且进度条拖不回去），所以保留——这是明确的取舍，不是 bug。
</details>

<details>
<summary><b>支持 macOS / Safari / Firefox 吗？</b></summary>

支持，但能力不同：Safari 26+ 才有完整 WebCodecs（16.4–18.x 只有视频接口，没有 AudioEncoder，会自动改走兼容录制保证有声音）；Firefox 130+ 桌面版有 WebCodecs，录制只能出 WebM（会自动转 MP4）。完整矩阵见 [docs/06-兼容性矩阵.md](docs/06-兼容性矩阵.md)。
</details>

---

## 已知限制

| 限制 | 原因 |
|---|---|
| 录制成片开头约 0.4 s 静止 | MediaRecorder 起录热身，裁掉会切走开头关键帧 |
| 录制全片只有 1 个关键帧，拖动要解全片 | MediaRecorder 固有，不重编码无解 |
| 手机录制 17–29 fps | 1080P + 特效全开的实际渲染能力 |
| 某些内核无 AAC → 只能 MOV | MP4 只认 AAC，PCM 塞进 MP4 兼容性更差 |
| 60 分钟长片未实跑 | 有预算拦截 + ETA + 分级提醒，属已知边界 |
| Safari / Firefox 未真机验证 | 已做能力自检与降级，缺什么会在状态栏说明 |

---

## 合规与许可

- 代码：[MIT](LICENSE)
- 内置字体：SIL OFL 1.1，来源与授权见 [NOTICE.md](NOTICE.md)
- 内置示例素材：封面为程序生成，歌词为**苏轼《水调歌头》（北宋，公有领域）**，不含任何版权歌词与第三方音频
- 隐私：无网络请求、无遥测、无账号；素材只在本机内存里
- 使用须知：请确保你拥有所处理音频/封面/歌词的使用权；本工具不提供、不内置、不分发任何音乐或歌词内容

---

<div align="center">

如果这个工具帮你省下了装软件的时间，点个 ⭐ 让更多人找到它。

</div>
