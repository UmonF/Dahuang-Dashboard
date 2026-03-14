# 大荒百景 Dashboard 开发日志

> 最后更新：2026-03-14 10:02 UTC

## 项目概览

- **仓库**: https://github.com/UmonF/Dahuang-Dashboard
- **线上**: https://umonf.github.io/Dahuang-Dashboard/
- **本地**: `C:\Users\jasmineyfan\clawd\projects\dahuang-dashboard`
- **技术栈**: Vite 8 + React + TypeScript + Framer Motion + Tailwind 4

## 架构

```
data/
├── feeds/insights.json      # 羽民国 (tech-ai/game-ux/design)
├── reading/notes.json       # 昆仑丘 (读书笔记)
├── diary/entries.json       # 汤谷 (日记)
├── projects/experiments.json # 灵山 (实验项目)
└── content/all-content.json  # 所有详情页 Markdown 内容
```

### 数据写入

```javascript
const { addItem } = require('./scripts/add-data.cjs');

addItem('insight', {
  title: '...',
  summary: '列表页摘要',
  content: '## Markdown 详情内容\n\n...',
  category: 'game-ux',  // tech-ai/game-ux/design
  source: 'GMTK',
  sourceUrl: 'https://youtube.com/...',
  tags: ['Boss Design'],
});
```

### 部署流程

```powershell
git add data/
git commit -m "data(type): title"
git push
# GitHub Actions 自动部署
```

---

## Best Practices

### 1. ID 必须唯一且一致

- **元数据 JSON** 和 **content JSON** 的 ID 必须完全匹配
- 如果用 Notion ID，保持完整格式 (`322f9ada-2dc9-8165-9a8c-c5d6da28368d`)
- 如果生成新 ID，用固定格式 (`note-20260314-xxxx`)

### 2. 数据迁移时先 fetch-content，再写元数据

错误顺序会导致 ID 不匹配：
```
❌ 写元数据（新 ID）→ fetch-content（Notion ID）→ 不匹配
✅ fetch-content → 用相同 ID 写元数据
```

### 3. 多 agent 写入时注意冲突

- 白泽 `addItem()` 后我运行 `fetch-content.mjs` 会覆盖
- 解决：`fetch-content.mjs` 只在迁移时用，日常白泽用 `addItem()`

### 4. URL 参数持久化 Filter 状态

```tsx
const [searchParams, setSearchParams] = useSearchParams();
const activeTab = searchParams.get('tab') || 'default';

// 进入详情时带上来源
<Link to={`/detail/${id}?from=${activeTab}`}>

// 返回时恢复
const fromTab = searchParams.get('from') || 'default';
<Link to={`/list?tab=${fromTab}`}>
```

### 5. 数据层统一排序

```typescript
// src/data/index.ts
function sortByDateDesc<T extends { date?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => 
    (b.date || '').localeCompare(a.date || '')
  );
}

export function getInsights() {
  return sortByDateDesc(insights.items);
}
```

---

## 踩坑记录

### 1. SPA 路由 404

**问题**: GitHub Pages 直接访问 `/yumin/xxx` 返回 404

**解决**: 
- 添加 `public/404.html` 重定向到 index.html
- index.html 添加重定向脚本处理 `?p=` 参数

### 2. Notion 内容迁移 ID 不匹配

**问题**: insights.json 用新生成 ID，content 用 Notion UUID，详情页找不到内容

**解决**: 统一用 Notion UUID 作为 ID

### 3. TypeScript 类型不匹配

**问题**: `rating: null` 不兼容 `rating?: number`

**解决**: 只在有值时添加字段
```javascript
if (item.rating) obj.rating = item.rating;
```

### 4. Git 凭证问题

**问题**: PowerShell 里 `git push` 无法弹出认证窗口

**解决**: 需要 Aou 手动在终端执行 `git push`

### 5. 数据覆盖

**问题**: 我的 fetch-content.mjs 覆盖了白泽刚写的数据

**解决**: 
```powershell
# 从 git 历史恢复
git show <commit>:data/reading/notes.json
```

---

## 白泽 Workflow 文件

| 文件 | 数据类型 | Dashboard 页面 |
|------|----------|----------------|
| `game-ux-tracking.md` | insight (game-ux) | `/yumin?tab=game-ux` |
| `tech-ai-tracking.md` | insight (tech-ai) | `/yumin?tab=tech-ai` |
| `daily-reading.md` | note | `/kunlun` |
| `design-study.md` | insight (design) | `/yumin?tab=design` |
| `daily-diary.md` | diary | `/tanggu` |

所有 workflow 已更新为 `addItem()` + git push，不再用 Notion。

---

## TODO

### 高优先级

- [x] ~~解决 git push 凭证问题~~ (SSH Deploy Key configured)
- [ ] 确认白泽新流程运行正常
- [x] ~~日记数据迁移检查~~ (IDs fixed, mood mapping updated)

### 功能

- [ ] 首页三龙状态接入真实 gateway health
- [ ] 灵山（实验项目）详情页
- [ ] 响应式优化
- [ ] 代码分割（当前 bundle 600KB+）

### 数据

- [x] ~~给读书笔记补充正确的 category~~ (science/history/folklore/zhiguai added)
- [ ] 清理 Notion 依赖（fetch-content.mjs 只用于一次性迁移）

---

## 快速参考

### 添加数据

```javascript
// 在任何 Node 脚本中
const { addItem } = require('C:/Users/jasmineyfan/clawd/projects/dahuang-dashboard/scripts/add-data.cjs');

// 资讯
addItem('insight', { title, summary, content, category, source, sourceUrl, tags });

// 笔记
addItem('note', { title, author, category, summary, content, highlights, thoughts, rating });

// 日记
addItem('diary', { mood, title, content, tags, weather });

// 实验
addItem('experiment', { title, description, content, status, tags });
```

### 本地开发

```powershell
cd C:\Users\jasmineyfan\clawd\projects\dahuang-dashboard
npm run dev      # 启动开发服务器
npm run build    # 构建
npm run preview  # 预览构建结果
```

### 部署

```powershell
git add data/
git commit -m "data(type): description"
git push
# 等待 GitHub Actions 完成
```
