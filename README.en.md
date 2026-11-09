<div align="center">

<img src="assets/social-preview.jpg" alt="L1MV — offline lyric player video generator: cover art + audio + LRC → MP4" width="820">

# L1MV · Lyric Player Video Generator

**Turn a cover, an audio file and an LRC file into a music-player style video — offline, in one HTML file.**

[![License](https://img.shields.io/badge/license-MIT-2f6fed)](LICENSE)
[![Single File](https://img.shields.io/badge/single--file-6.6%20MB-1c8f5f)](L1MV.html)
[![Dependencies](https://img.shields.io/badge/dependencies-0-1c8f5f)](#how-it-works)
[![Offline](https://img.shields.io/badge/offline-100%25-1c8f5f)](#faq)

[中文说明](README.md) · [Online demo](https://gooooddayy.github.io/L1MV/) · [Docs](docs/00-索引.md)

</div>

---

## What it is

A single 6.6 MB HTML file with **zero dependencies, zero network requests, zero install**. Double-click it, drop in your artwork, your track and your `.lrc`, and get a finished MP4 with a spinning record, scrolling lyrics, reflections and light sweeps.

Nothing is uploaded. There is no server, no account, no telemetry — the file contains no `fetch`, no `XMLHttpRequest`, no analytics.

| Input | Output |
|---|---|
| Cover art (JPG/PNG/WebP/GIF/BMP/AVIF/SVG)<br>Audio (MP3/M4A/AAC/WAV/FLAC/OGG/Opus/WebM, optional)<br>Lyrics (LRC / TXT, optional) | **MP4** (H.264 + AAC) or **MOV**<br>720p / 1080p / 2K<br>16:9 landscape or 9:16 portrait |

Perfect for YouTube lyric videos, Shorts / Reels / TikTok, Spotify Canvas-style loops, or a quick visual for a release you mixed five minutes ago.

## Why it is different

- **Real MP4, written in JS.** A hand-written ISO-BMFF muxer (`ftyp/moov/mdat`, per-sample `stts` so VFR never shortens the timeline, `elst` to correct AAC priming). No ffmpeg.wasm, no ffmpeg at all.
- **Two export paths that cover for each other.** WebCodecs encoding (faster than realtime) and MediaRecorder capture (maximum compatibility), with automatic cross-fallback.
- **No AAC encoder? Still gets sound.** Falls back to MOV + uncompressed PCM (`sowt`) — a standard QuickTime combination that editors accept.
- **5 Chinese typefaces embedded offline.** Subset to 4,191 glyphs (4.78 MB), loaded lazily via `FontFace`, stored as `text/plain` so the CSS parser never touches 6.5 MB of base64. HTML parse time: 590 ms → 40 ms.
- **Designed not to crash.** Job tokens, import sequence numbers, a memory guard checked every 32 frames, and a 1800 MB PCM admission gate.

## How it works

```
Click Export
 ├─ Fast encode (WebCodecs)
 │    buildScene(K) snapshot → renderAt(t) → VideoFrame → VideoEncoder
 │    → hand-written MP4 muxer (H.264 + AAC, or PCM → MOV)
 ├─ Compatibility capture (MediaRecorder)
 │    canvas.captureStream(30) + audio track → MediaRecorder
 │    → remux fragmented MP4, or decode WebM (VP8/VP9+Opus) → re-encode H.264/AAC
 └─ Cross fallback
      encoder unsupported → capture
      capture only yields WebM → transcode to MP4
      no AAC encoder → PCM track, MOV container
      no H.264 at all → keep WebM but rewrite Duration so it seeks
```

## Performance (measured, Edge 156, `file://`)

| Metric | Value |
|---|---|
| HTML parse | 32–51 ms |
| First contentful paint | ~1.2 s |
| 60 slider events (sync blocking) | 0.7 ms |
| 1080p 10 s export | ≈5.1 s (~2× realtime) |
| CLS | 0 |

## FAQ

<details><summary><b>Does it really work offline?</b></summary>
Yes. No external links, no fetch/XHR/WebSocket, no localStorage, no cookies. You can unplug the network and export.
</details>

<details><summary><b>Which lyric timestamp formats are supported?</b></summary>
`[mm:ss]`, `[mm:ss.xx]`, `[mm:ss.xxx]`, `[mm:ss:xx]`, multiple timestamps per line, enhanced LRC word-level tags stripped. Encodings: UTF-8 (with/without BOM), UTF-16, GB2312, GBK, Big5.
</details>

<details><summary><b>Why did I get a MOV file?</b></summary>
Your browser has no AAC encoder (common in some vendor Android builds). MP4 requires AAC, so it writes MOV with uncompressed PCM instead — with sound, importable by Premiere, Resolve and CapCut.
</details>

<details><summary><b>Do I need Python or ffmpeg?</b></summary>
No. Everything — MP4 muxing, WebM parsing, resampling — is JavaScript inside the file.
</details>

## Documentation

The full engineering notes are in Chinese (this is a Chinese-first project), starting at [docs/00-索引.md](docs/00-索引.md). The most useful ones:

- [docs/03-导出链路.md](docs/03-导出链路.md) — export pipelines in detail
- [docs/04-踩坑全集.md](docs/04-踩坑全集.md) — 39 real pitfalls (codec, container, fonts, mobile, concurrency)
- [docs/05-性能复盘.md](docs/05-性能复盘.md) — before/after numbers and rejected optimizations
- [AGENTS.md](AGENTS.md) — one-page context for future maintainers

## License

Code: [MIT](LICENSE). Embedded fonts: SIL OFL 1.1 — see [NOTICE.md](NOTICE.md). Demo assets are generated or public domain. You are responsible for the rights to the audio, artwork and lyrics you process.
