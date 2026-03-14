# 白泽数据写入指南

## 概述

数据直接写入本地 JSON 文件，通过 git push 触发 GitHub Pages 部署。
**不再通过 Notion**，所有数据存储在 `data/` 目录。

## 数据结构

```
data/
├── feeds/insights.json      # 羽民国 - 资讯元数据
├── reading/notes.json       # 昆仑丘 - 读书笔记元数据
├── diary/entries.json       # 汤谷 - 日记元数据
├── projects/experiments.json # 灵山 - 实验项目元数据
└── content/all-content.json  # 所有详情页的 Markdown 内容
```

## 脚本位置

```
C:\Users\jasmineyfan\clawd\projects\dahuang-dashboard\scripts\add-data.cjs
```

## API 使用

### 添加资讯 (羽民国)

```javascript
const { addItem } = require('C:/Users/jasmineyfan/clawd/projects/dahuang-dashboard/scripts/add-data.cjs');

addItem('insight', {
  title: '标题',
  summary: '摘要（用于列表页显示）',
  content: `## 完整内容

这里是 Markdown 格式的详情内容...

### 小标题

- 列表项
- 更多内容
`,
  source: 'Twitter',           // Twitter/Blog/Paper/Newsletter/Video
  sourceUrl: 'https://...',    // 可选，原文链接
  category: 'tech-ai',         // tech-ai/game-ux/design
  tags: ['AI', 'LLM'],
});
```

### 添加读书笔记 (昆仑丘)

```javascript
addItem('note', {
  title: '书名',
  author: '作者',
  category: 'design',          // folklore/science/zhiguai/design/tech/other
  summary: '简短摘要',
  content: `## 读书笔记

完整的 Markdown 内容...

> 引用段落

### 思考

...
`,
  highlights: ['精华1', '精华2'],  // 可选
  thoughts: '个人思考',            // 可选
  rating: 5,                       // 可选，1-5
});
```

### 添加日记 (汤谷)

```javascript
addItem('diary', {
  mood: 'reflective',          // calm/reflective/curious/productive/accomplished/anxious/tired
  title: '标题',
  content: `今天发生了很多事...

## 上午

...

## 下午

...
`,
  tags: ['标签1', '标签2'],
});
```

**Mood 映射**:
| Mood | Emoji | Use when |
|------|-------|----------|
| calm | 😌 | Peaceful, content |
| reflective | 💭 | Thinking deeply |
| curious | 🤔 | Exploring, questioning |
| productive | ⚡ | High output day |
| accomplished | ✨ | Milestone reached |
| anxious | 😰 | Worried, stressed |
| tired | 😴 | Exhausted |

### 添加实验项目 (灵山)

```javascript
addItem('experiment', {
  title: '项目名',
  description: '简短描述',
  content: `## 项目详情

### 背景

...

### 技术栈

- React
- TypeScript
`,
  status: 'wip',               // idea/wip/done/archived
  tags: ['React', 'AI'],
  coverEmoji: '🚀',
  demoUrl: 'https://...',
  repoUrl: 'https://...',
});
```

## 重要说明

### content 字段

- `content` 字段是 **Markdown 格式**的完整内容
- 会显示在详情页，支持标题、列表、引用、代码块等
- 如果省略 `content`，详情页会显示 `summary`

### 日记的特殊行为

- 同一天的日记会**更新**而不是新增
- 适合一天内多次追加内容

## 完整流程示例

```javascript
const { addItem } = require('C:/Users/jasmineyfan/clawd/projects/dahuang-dashboard/scripts/add-data.cjs');
const { execSync } = require('child_process');

// 1. 写入数据
addItem('insight', {
  title: 'AI 行业周报',
  summary: '本周 AI 领域三大动态...',
  content: `## AI 行业周报

### 1. OpenAI 发布新模型

详细内容...

### 2. Anthropic 更新 Claude

更多内容...

### 3. Google Gemini 进展

...

---

> 💡 设计启发：...
`,
  category: 'tech-ai',
  source: 'Multiple',
  tags: ['AI', '周报'],
});

// 2. 提交推送（触发自动部署）
execSync('git add data/ && git commit -m "data: add AI weekly" && git push', {
  cwd: 'C:/Users/jasmineyfan/clawd/projects/dahuang-dashboard'
});
```

## Cron 任务配置

白泽每日更新资讯的 cron 任务应该：

1. 收集/生成当日内容
2. 调用 `addItem()` 写入（含 `content` 字段）
3. 执行 git commit + push

GitHub Actions 会在 push 后自动构建部署。

## 命令行使用

```powershell
cd C:\Users\jasmineyfan\clawd\projects\dahuang-dashboard

# 添加资讯
node scripts/add-data.cjs insight '{"title":"...","summary":"...","content":"## 内容\\n\\n...","category":"tech-ai","source":"Twitter","tags":["AI"]}'

# 添加日记
node scripts/add-data.cjs diary '{"mood":"sunny","title":"...","content":"..."}'

# 列出最近 10 条资讯
node scripts/add-data.cjs list insight 10
```

## 迁移说明

之前从 Notion 获取的内容已迁移到 `data/content/all-content.json`。
新数据通过 `addItem()` 写入时会自动追加到该文件。
