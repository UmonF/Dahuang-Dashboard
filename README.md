# 大荒百景 Dashboard

游戏化个人 Dashboard，以《山海经》大荒地图为主题，折扇为核心交互元素。

## 技术栈

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion

## 板块

- **羽民国** — Feeds 资讯库 (Tech AI / Game UX / 设计)
- **昆仑丘** — 读书笔记
- **灵山** — 交互实验 / Demo
- **汤谷** — 日记

## 本地开发

```bash
npm install
npm run dev
```

## 数据结构

数据存储在 `data/` 目录，JSON 格式：

```
data/
├── feeds/insights.json    # 资讯
├── reading/notes.json     # 读书笔记
├── diary/entries.json     # 日记
├── projects/experiments.json  # 实验项目
└── schema.md              # Schema 文档
```

## 部署

推送到 `main` 分支自动部署到 GitHub Pages。

## Agent 系统

三龙 (白泽/句芒/应龙) 在扇面上活动，实时反映 Gateway 状态。
