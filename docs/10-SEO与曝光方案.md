# 10 · SEO 与曝光方案

> 目标不是「排名第一」，而是**让正在找这类工具的人能搜到，并且点进来就明白这是什么**。
> 分三层做：GitHub 站内（能被搜到）→ 搜索引擎（能被索引）→ 社区（能被转发）。

## 1. 关键词地图

### 核心词（必须占住）

| 词 | 意图 | 用在哪 |
|---|---|---|
| **L1MV** | 品牌词 | 仓库名、title、README H1、每篇文档页脚 |
| **歌词播放器视频生成** | 明确需求 | 仓库 description、README 首段、落地页 H1 |
| **音乐播放器效果生成** | 明确需求 | 同上，作为第二表述 |

> 这两个中文短语目前**没有对应的开源项目**，搜索结果是教程与 SaaS 广告。这是最大的空位。

### 场景长尾（内容页 / FAQ 覆盖）

| 中文 | 英文 |
|---|---|
| LRC 歌词转视频 | LRC to MP4 |
| 歌词滚动视频 制作 免费 | scrolling lyrics video maker |
| 黑胶唱片 视频 生成 | spinning vinyl video generator |
| 专辑封面 动态视频 生成 | album cover animation video |
| 音乐可视化 视频 生成 网页 | audio visualizer video generator |
| 歌词视频 无水印 免费 | lyric video generator no watermark |
| 离线 歌词视频 制作 | offline lyric video maker |
| 剪映 歌词视频 素材 | lyric video for CapCut |
| 竖版 歌词视频 9:16 | vertical lyric video 9:16 |
| 歌曲 封面 播放器 动画 | music player animation video |

### 技术词（吸引开发者，带来 star 与转载）

`WebCodecs`、`MP4 封装`、`mp4 muxer`、`MediaRecorder`、`H.264`、`AAC`、`PCM`、`LRC 解析`、`Canvas 文字缓存`、`单文件 HTML`、`零依赖`

## 2. GitHub 站内 SEO

GitHub 的搜索权重大致是：**仓库名 > description > topics > README 前几行 > 文件名/路径 > 其余 README**。

| 项 | 做法 | 状态 |
|---|---|---|
| 仓库名 | `L1MV`（品牌，短、好记、可搜索） | ✅ |
| Description | 中文核心词 + 英文关键词 + 一句功能，≤350 字符 | ✅ |
| Topics | 20 个，覆盖品类/技术/场景，全小写连字符 | ✅ |
| README H1 | `L1MV · 歌词播放器视频生成器` + 副标题含「音乐播放器效果生成」 | ✅ |
| README 首屏 | 一张图 + 一句话 + 三个徽章，3 秒说清是什么 | ✅ |
| 截图 | 4 张 JPEG（桌面/竖版输出/手机/社交卡），全部带 alt 文本 | ✅ |
| 文档 | 15 篇中文技术文档，覆盖长尾技术词 | ✅ |
| Releases | 打 tag + 附 HTML 资产，Release 页面独立可索引 | ✅ |
| Social preview | 1200×630，需在仓库 Settings 手动上传 | ⚠️ 手动 |
| Issues / Discussions | 开 issue 模板，鼓励提问（每个 issue 都是长尾页面） | ✅ |
| Pages | 在线 Demo + 落地页，独立域名可被搜索引擎收录 | ✅ |
| Star / fork / 更新频率 | 真实使用带来的自然信号，不刷 | — |

### Topics（已设置）

```
lyric-video  music-visualizer  lyrics  lrc  webcodecs  mp4  video-generator
canvas  single-file  offline  no-dependencies  audio-visualizer  music-video
album-art  spotify-canvas  chinese  web-audio  h264  aac  media-recorder
```

> Topics 不要凑数。每个 topic 都是一个「按标签浏览」的入口页，不相关的标签只会带来跳出。

## 3. 搜索引擎 SEO

### 已落地

| 项 | 位置 | 作用 |
|---|---|---|
| `<title>` 含核心词 | 产物 HTML + 落地页 | 标题是排名第一权重 |
| `<meta name="description">` | 同上 | 摘要影响点击率 |
| Open Graph / Twitter Card | 同上 | 分享到微信/X/Telegram 时有图有文 |
| JSON-LD `SoftwareApplication` | 产物 HTML | 结构化数据，利于富结果 |
| 语义化 H1/H2 | 落地页 | 抓取理解 |
| FAQ 区块 | README + 落地页 | 命中「People also ask」 |
| `robots.txt` + `sitemap.xml` | 仓库根 | 提交索引 |
| 内链 | README ↔ docs ↔ 落地页 | 权重流动 |
| 图片 alt | 全部截图 | 图片搜索 + 无障碍 |

### 提交索引（发布后 24 小时内做）

1. **Google Search Console** → 添加 `https://gooooddayy.github.io/L1MV/` → 验证（HTML 标签或 DNS）→ URL 检查 → 请求编入索引。
2. **Bing Webmaster Tools** → 同上（Bing 的索引也被 DuckDuckGo / ChatGPT 搜索使用）。
3. **Yandex**（可选，海外俄语区）。
4. **百度**：`github.io` 在境内的抓取与访问都不稳定，**不建议把百度当主渠道**。中文流量靠知乎/小红书/B站/公众号导流，比等百度收录快得多。

### 内容型 SEO（真正的长期流量）

工具页只能命中「产品词」，长尾要靠文章：

| 选题 | 目标词 | 形式 |
|---|---|---|
| 《不用装软件，把一个 HTML 变成歌词视频生成器》 | 歌词视频 制作 免费 | 图文教程 |
| 《LRC 时间戳有 4 种写法，你的播放器可能只认 1 种》 | LRC 格式 / 时间戳 | 技术科普 |
| 《为什么浏览器导出的 MP4 会音画不同步》 | MP4 音画不同步 / VFR | 技术长文（引流开发者） |
| 《我给自己的歌做了 5 条竖版视频，全程没上传》 | 竖版 歌词视频 / 隐私 | 经验贴 |
| 《6.6 MB 的 HTML 里塞了 5 款中文字体》 | 网页字体 子集化 / 性能 | 技术长文 |

> 每篇文末链回仓库，是最有效的反向链接来源。

## 4. 社区渠道

### 中文（优先级从高到低）

| 渠道 | 版块/形式 | 注意 |
|---|---|---|
| **V2EX** | 「分享创造」节点，标题带「分享创造」 | 必须自己先写清「做了什么/怎么用/开源地址」，纯广告会被移版 |
| **少数派** | Matrix 社区投稿，偏「工具 + 体验」 | 需要成文，不能只贴链接 |
| **知乎** | 回答「有没有免费的歌词视频制作工具」类问题 | 先给价值再放链接 |
| **B 站** | 30–60 秒演示视频（从拖文件到出片） | 视频比图文转化高一个量级 |
| **小红书** | 竖版成品 + 「一个网页搞定」 | 面向非技术用户，别讲技术 |
| **微信公众号** | 长文 + 二维码 | 适合沉淀，不适合冷启动 |
| **酷安** | 数码/工具区 | 对「单文件工具」接受度高 |
| **吾爱破解** | 软件区（需遵守版规） | 技术向，会认真测 |
| **HelloGitHub** | 每月刊，通过 GitHub Issue 推荐 | 命中一次能带来持续流量 |
| **阮一峰《科技爱好者周刊》** | 通过 GitHub Issue 投稿 | 中文开发者最大的单点曝光 |
| **开源中国 / Gitee** | 可做国内镜像（需实名审核） | 解决 GitHub 访问慢 |

### 海外

| 渠道 | 形式 | 注意 |
|---|---|---|
| **Reddit** r/WeAreTheMusicMakers / r/edmproduction | 「I built a free offline tool」 | 先参与讨论再发，纯推广会被删 |
| **Reddit** r/webdev / r/javascript | 技术角度：单文件 + WebCodecs | 讲实现，别讲营销 |
| **Hacker News** | `Show HN: …` | 标题必须朴素、可验证；周五上午（美东）发 |
| **Product Hunt** | 产品页 + 3 张图 | 需要提前攒一点初始支持 |
| **Dev.to / Hashnode** | 技术长文（英文版） | 可直接复用中文长文的结构 |
| **X / Mastodon** | 15 秒演示 GIF + 一句英文 | 带 #WebCodecs #lyricvideo |
| **AlternativeTo** | 登记为 CapCut/VEED 的替代品 | 长期被动流量 |

### 不要做

- 买 star、互 star 群 —— GitHub 会降权，且看起来假。
- 在无关版块刷链接 —— 一次就封。
- 把 README 写成 keyword 堆砌 —— 反而降低可信度。

## 5. 30 天节奏

| 时间 | 动作 | 产出 |
|---|---|---|
| D0 | 发布仓库、打 v60 Release、上传 social preview | 仓库可访问 |
| D1 | GSC + Bing 提交索引；Pages 上线 | 可被搜到 |
| D2 | V2EX 分享创造 + 酷安 | 首批真实反馈 |
| D3–4 | 录 45 秒演示视频（拖文件 → 选 1080P → 出片 → 播放） | 视频素材 |
| D5 | B 站 + 小红书（竖版成品） | 非技术用户入口 |
| D7 | 少数派投稿（成文） | 长文背书 |
| D10 | 知乎回答 3 个相关问题 | 长尾流量 |
| D14 | 技术长文（音画同步/VFR）发 Dev.to + 掘金 | 开发者流量 |
| D18 | 投 HelloGitHub / 阮一峰周刊 | 单点爆发 |
| D21 | Show HN + Reddit（选 1 个版块先试水） | 海外首批 |
| D25 | Product Hunt + AlternativeTo | 长期被动 |
| D30 | 复盘：看 referrers、star 曲线、issue 内容 | 下一轮选题 |

## 6. 文案模板

### 标题（三种语气）

- 中文社区：`分享创造 · L1MV：一个 6.6MB 的 HTML，把一首歌变成歌词播放器 MV（离线 / 无水印 / 直接出 MP4）`
- 技术社区：`我用 700 行 JS 写了个 MP4 封装器，就为了在浏览器里导出一条带 AAC 的歌词视频`
- 海外：`Show HN: L1MV – a single 6.6 MB HTML file that turns a song into a lyric video (offline, no ffmpeg)`

### 首段结构（四句话，缺一不可）

1. **它是什么**：一张封面 + 一段音频 + 一份 LRC → 一条播放器风格的 MV。
2. **它不一样在哪**：单文件、离线、素材不出本机、真 MP4（不是录屏改后缀）。
3. **怎么用**：下载 → 双击 → 拖三个文件 → 点导出。
4. **代价/限制**（诚实反而增加信任）：不做 4K；没有 AAC 的设备会出 MOV。

### 配图顺序

1. 成品画面（16:9）——先给结果
2. 界面全貌——证明「真的这么简单」
3. 竖版 9:16——证明能发短视频
4. 一张对比表——证明不是套壳

## 7. 度量

| 指标 | 看哪里 | 健康值（首月） |
|---|---|---|
| 仓库浏览 / 克隆 | Insights → Traffic（14 天） | 浏览 > 500，克隆 > 100 |
| 来源站点 | Traffic → Referrers | 至少 3 个社区来源 |
| Star | 仓库首页 | 50–200（自然增长） |
| 搜索展现 / 点击 | Search Console | 展现 > 1000，CTR > 3% |
| Issue 质量 | Issues | 有 1–2 个真实 bug 报告 = 真有人用 |
| 落地页停留 | 无法直接测（无统计） | 用「下载转化」间接判断 |

> 本项目**刻意不埋统计**（离线是卖点）。所以度量只依赖 GitHub 与 Search Console 的聚合数据，不追踪个人。

## 8. 合规红线

- 不内置、不下载、不分发任何音乐、封面、歌词；示例用公有领域文本。
- README 明确「素材版权由使用者负责」。
- 字体只用 OFL 授权，附 NOTICE。
- 不蹭艺人/唱片公司商标；截图里不出现真实专辑封面与歌手名。
- 各社区发帖遵守版规；同一内容不跨版重复刷。
