# 大荒 Dashboard 数据 Schema

## 目录结构

```
data/
├── feeds/
│   └── insights.json    # Tech AI + Game UX + 设计案例
├── reading/
│   └── notes.json       # 读书笔记
├── diary/
│   └── entries.json     # 日记
├── projects/
│   └── experiments.json # 灵山实验项目
└── schema.md            # 本文件
```

---

## feeds/insights.json

羽民国 — 资讯采集

```typescript
interface Insight {
  id: string;                    // 唯一标识，格式: "insight-YYYYMMDD-001"
  title: string;                 // 标题
  summary: string;               // 摘要
  source: string;                // 来源 (Twitter/Blog/Paper/Newsletter/Video)
  sourceUrl?: string;            // 原文链接
  category: 'tech-ai' | 'game-ux' | 'design';  // 分类
  tags: string[];                // 标签
  date: string;                  // 日期 YYYY-MM-DD
  createdAt: string;             // 创建时间 ISO
}

// 文件格式
{
  "version": "1.0",
  "updatedAt": "2026-03-14T07:43:00Z",
  "items": Insight[]
}
```

---

## reading/notes.json

昆仑丘 — 读书笔记

```typescript
interface ReadingNote {
  id: string;                    // 唯一标识，格式: "note-YYYYMMDD-001"
  title: string;                 // 书名/文章名
  author?: string;               // 作者
  category: 'folklore' | 'science' | 'zhiguai' | 'design' | 'tech' | 'other';
  summary: string;               // 笔记摘要
  highlights: string[];          // 精华摘录
  thoughts?: string;             // 个人思考
  rating?: number;               // 评分 1-5
  date: string;                  // 日期 YYYY-MM-DD
  createdAt: string;
}

// 文件格式
{
  "version": "1.0",
  "updatedAt": "2026-03-14T07:43:00Z",
  "items": ReadingNote[]
}
```

---

## diary/entries.json

汤谷 — 日记

```typescript
interface DiaryEntry {
  id: string;                    // 唯一标识，格式: "diary-YYYYMMDD"
  date: string;                  // 日期 YYYY-MM-DD
  mood: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'rainbow';
  title?: string;                // 可选标题
  content: string;               // 正文 (支持 markdown)
  tags?: string[];               // 标签
  weather?: string;              // 天气
  createdAt: string;
}

// 文件格式
{
  "version": "1.0",
  "updatedAt": "2026-03-14T07:43:00Z",
  "items": DiaryEntry[]
}
```

---

## projects/experiments.json

灵山 — 实验项目

```typescript
interface Experiment {
  id: string;                    // 唯一标识，格式: "exp-001"
  title: string;                 // 项目名
  description: string;           // 描述
  status: 'idea' | 'wip' | 'done' | 'archived';
  tags: string[];                // 技术栈/标签
  demoUrl?: string;              // Demo 链接
  repoUrl?: string;              // 代码仓库
  coverEmoji?: string;           // 封面 emoji
  date: string;                  // 日期 YYYY-MM-DD
  createdAt: string;
}

// 文件格式
{
  "version": "1.0",
  "updatedAt": "2026-03-14T07:43:00Z",
  "items": Experiment[]
}
```

---

## 写入规范

### ID 生成规则
- insights: `insight-YYYYMMDD-XXX` (XXX 为当日序号)
- reading: `note-YYYYMMDD-XXX`
- diary: `diary-YYYYMMDD` (每日一条)
- projects: `exp-XXX` (递增序号)

### 时间格式
- `date`: `YYYY-MM-DD`
- `createdAt`/`updatedAt`: ISO 8601 (`2026-03-14T07:43:00Z`)

### 白泽写入流程
1. 读取现有 JSON
2. 追加新条目
3. 更新 `updatedAt`
4. 写入文件
5. Git commit + push (触发自动部署)
