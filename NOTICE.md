# NOTICE · 第三方声明与合规说明

本文件说明 `L1MV.html` 中包含的第三方资源及其授权。发布、分发、商用前请读一遍。

## 1. 代码

本项目代码以 **MIT License** 发布，全文见 [LICENSE](LICENSE)。
Copyright (c) 2026 gooooddayy

## 2. 内置字体（5 款）

这 5 款字体被**子集化**（只保留 4191 个常用字）并以 base64 内嵌在 HTML 里，用于离线渲染中文歌词。

| 显示名 | 内部家族名 | 上游项目 | 授权 | 子集后 |
|---|---|---|---|---|
| 宋体 | `L1MV Song` | [Noto Serif SC](https://fonts.google.com/noto/specimen/Noto+Serif+SC)（Google / Adobe） | SIL OFL 1.1 | 0.69 MB |
| 楷体 | `L1MV Kai` | [霞鹜文楷 LXGW WenKai](https://github.com/lxgw/LxgwWenKai) | SIL OFL 1.1 | 0.84 MB |
| 毛笔 | `L1MV Brush` | [Ma Shan Zheng 马善政毛笔楷书](https://fonts.google.com/specimen/Ma+Shan+Zheng) | SIL OFL 1.1 | 1.64 MB |
| 行书 | `L1MV Script` | [Zhi Mang Xing 志莽行书](https://fonts.google.com/specimen/Zhi+Mang+Xing) | SIL OFL 1.1 | 1.18 MB |
| 圆润 | `L1MV Round` | [ZCOOL KuaiLe 站酷快乐体](https://fonts.google.com/specimen/ZCOOL+KuaiLe) | SIL OFL 1.1 | 0.43 MB |

- 授权全文：[fonts/LICENSE-OFL.txt](fonts/LICENSE-OFL.txt)
- 各字体的版权归其作者所有。完整的版权声明行见各上游仓库中的 `OFL.txt`（Google Fonts 仓库路径为 `ofl/<family>/OFL.txt`）。
- 已确认的版权行：
  - Ma Shan Zheng：`Copyright 2018 The Ma Shan Zheng Project Authors (https://github.com/googlefonts/mashanzheng)`
  - Zhi Mang Xing：`Copyright 2018 The Zhi Mang Xing Project Authors (https://github.com/googlefonts/zhimangxing)`
  - ZCOOL KuaiLe：`Copyright 2018 The ZCOOL KuaiLe Project Authors (https://github.com/googlefonts/zcool-kuaile)`

### 关于「修改」与改名的说明

OFL 允许修改与再分发，但**修改后的版本不得使用原字体保留的名称**（Reserved Font Name）。
本项目做了两件事：

1. **子集化**（只保留 4191 字）——属于修改；
2. **重命名家族名**为 `L1MV Song / Kai / Brush / Script / Round`——避免使用上游名称。

因此内嵌字体以新名称分发，符合 OFL 对衍生版本的要求。子集化脚本见 [docs/11-字体与许可.md](docs/11-字体与许可.md)。

> 字体本身**不单独售卖**，只作为本工具的一部分随 HTML 分发，这也符合 OFL 的要求。

## 3. 示例素材

**产物不包含任何示例素材**：没有内置封面、没有内置歌词、没有音频。

仓库 `assets/` 里的截图由测试夹具 [`bench/seed.js`](bench/seed.js) 渲染——封面是 Canvas 程序生成的渐变图，歌词是「第一行 测试歌词内容」这类中性占位文本。它们只用于展示，不随产品分发。

> 历史说明：早期版本内置过一份示例（含一首流行歌曲的 8 行歌词）。仓库公开前先替换为苏轼《水调歌头》（北宋，公有领域），随后整体移除内置示例，只保留测试夹具。见 [ADR-15](docs/08-决策记录.md)。

## 4. 第三方代码

**没有。** 产物中不含任何第三方 JS/CSS 库、字体加载器、统计脚本、CDN 资源。

MP4 封装器、WebM 解析器、LRC 解析器、颜色量化、布局与渲染全部为本项目自写。

## 5. 运行环境提供的编解码器

H.264 / AAC / VP8 / VP9 / Opus 的编解码由**浏览器内置**实现（WebCodecs / MediaRecorder），本项目不包含任何编解码器代码，也不涉及相关专利授权。
如果你的使用场景需要商业分发编解码器，请自行评估 H.264/AAC 的专利许可（这与本项目的 MIT 授权是两件事）。

## 6. 使用者的责任

本工具只做**本地渲染**：

- 不提供、不下载、不分发任何音乐、封面、歌词内容；
- 不联网、不上传、不收集任何数据；
- 你导入的音频、图片、歌词的版权与使用权由**你本人**负责。

请确保你拥有相应素材的使用权，并遵守所在平台（YouTube / 抖音 / 小红书等）的内容规则。

## 7. 商标

`L1MV` 为本项目名称。文中提到的剪映、CapCut、Premiere、Spotify、YouTube、抖音等名称与商标归各自所有者，本项目与它们无隶属关系，提及仅为说明兼容性。
