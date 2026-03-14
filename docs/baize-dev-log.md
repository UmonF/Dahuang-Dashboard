# 白泽开发日志 - 大荒百景 Dashboard

*Last updated: 2026-03-14*

---

## 我负责的部分

| 领域 | 说明 |
|------|------|
| **数据集成** | Notion → JSON 迁移、add-data.cjs 脚本 |
| **读书笔记** | 昆仑丘内容，daily-reading workflow |
| **详情页 UI** | InsightDetail, NoteDetail, DiaryDetail |
| **原始数据** | `src/data/notion-data.json`（保留作为备份） |

---

## 踩坑记录

### 1. Git 协作冲突 ⚠️ 重要

**问题**：我 commit 后 push 还没完成，应龙的 fetch-content 脚本就覆盖了我的数据

**教训**：
- 多 agent 同时操作同一目录时，必须等 push 完成再做下一步
- `git push` 在 Windows 可能很慢（网络/凭证），不要假设它立即完成

**预防**：
```powershell
# 推送前先 pull
git pull --rebase
git push

# 或者用 --force-with-lease（更安全）
git push --force-with-lease
```

### 2. Notion ID 格式不一致

**问题**：迁移脚本生成了短 ID (`323f9ada`)，但内容文件用完整 UUID

**解决**：统一使用完整 Notion UUID 作为 ID

### 3. PowerShell 中文编码

**问题**：直接用 PowerShell 写中文 JSON 会乱码

**解决**：用 Node.js 脚本写入，不用 PowerShell 重定向

### 4. Aeon/Vercel 安全检查

**问题**：`web_fetch` 和浏览器都被 Vercel Security Checkpoint 拦截

**解决**：换 Nautilus 等其他来源，或等待验证通过后再抓取

### 5. 本地 vs 生产路径

**问题**：`/yumin` vs `/Dahuang-Dashboard/yumin`

**解决**：vite.config.ts 已配置 `base: '/Dahuang-Dashboard/'`，本地开发时需要带完整路径

---

## UI 设计不足

### 1. 详情页视觉层次不够

**现状**：详情页只有基础的标题/内容/tags，缺乏视觉节奏
**问题**：
- 没有 v4 那种 dramatic 的字号对比
- 缺少装饰元素（印章、侧边文字、分割线）
- 空间利用不够大胆（留白不够极致）

**优化方向**：
- 标题用更大的字号 + 更细的 letter-spacing
- 加入垂直侧边文字（山海经引言）
- 用 `blockquote` 样式做 highlight 区块

### 2. 列表页 hover 效果单调

**现状**：hover 只变色
**问题**：缺乏层次感和反馈感

**优化方向**：
```css
.entry-item:hover {
  transform: translateX(4px);
  box-shadow: -4px 0 0 var(--vermilion);
}
```

### 3. 筛选按钮样式偏现代

**现状**：filter-btn 是普通按钮样式
**问题**：和整体山海经美学不搭

**优化方向**：
- 改用墨水/印章风格的 toggle
- 选中状态用朱红色下划线而不是背景色
- 考虑用图标代替文字

### 4. 印章（stamp）只是文字

**现状**：`.header-stamp` 是圆形红底白字
**问题**：不够像真的印章

**优化方向**：
- 加印章边框（方形带缺口）
- 加轻微的纹理/做旧效果
- 考虑用 SVG 替代

### 5. 空状态设计缺失

**现状**：筛选后无结果时什么都不显示
**问题**：用户不知道是加载中还是真的没有

**优化方向**：
```tsx
{filtered.length === 0 && (
  <div className="empty-state">
    <span className="empty-icon">🏔️</span>
    <p>此处空山无人</p>
  </div>
)}
```

### 6. 加载状态缺失

**现状**：数据直接渲染，没有 loading
**问题**：首屏可能闪烁

**优化方向**：
- Skeleton loading
- 或简单的淡入动画

### 7. 移动端适配未测试

**现状**：有 media query 但未实际测试
**可能问题**：
- timeline 左侧时间线在小屏幕可能溢出
- 详情页返回按钮位置
- 印章大小

### 8. 暗色模式

**现状**：只有浅色
**问题**：夜间阅读体验差

**优化方向**：
```css
@media (prefers-color-scheme: dark) {
  :root {
    --paper: #1a1a1a;
    --ink: #e5e5e5;
    /* ... */
  }
}
```

### 9. 标签云/Tags 样式

**现状**：tags 是简单的灰色小字
**问题**：不够突出，点击区域小

**优化方向**：
- 可点击筛选
- hover 效果
- 更有存在感的样式（但不喧宾夺主）

### 10. 页面过渡动画

**现状**：用 framer-motion 但效果很基础
**问题**：页面切换有点突兀

**优化方向**：
- 进入时从右侧滑入
- 退出时淡出
- 共享元素过渡（如印章）

---

## 设计不足

### 1. 详情页内容不够丰富

**现状**：只显示 summary/notes，没有完整文章内容
**问题**：Notion 页面有完整内容，但迁移时只取了摘要

**优化方向**：
- 利用 `data/content/all-content.json` 存储完整 Markdown
- 详情页读取并渲染完整内容
- 应龙已经做了 `useContent` hook，待测试

### 2. 读书笔记分类映射

**现状**：
```javascript
// Notion 原始分类 → Dashboard 分类
'民俗' → 'folklore'
'志怪' → 'zhiguai'
'科学' → 'science'
'历史' → 'other'  // ← 没有 history 分类
```

**优化**：types.ts 应该加 `'history'` 分类

### 3. 数据验证缺失

**现状**：add-data.cjs 直接信任输入
**风险**：错误数据会写入 JSON

**优化**：加 zod 或简单类型检查

### 4. 日期时区

**现状**：用 `new Date().toISOString().split('T')[0]`
**问题**：UTC 时间，可能和北京时间差一天

**优化**：
```javascript
const today = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD in local tz
```

---

## 需要优化的地方

### 短期 TODO

- [ ] 测试 `useContent` hook 是否正确读取完整内容
- [ ] 验证详情页 Markdown 渲染（需要 react-markdown 或类似库）
- [ ] 加 `history` 分类到 types.ts
- [ ] 读书笔记 workflow 测试完整流程（今天的数据被覆盖需要重新 push）

### 中期 TODO

- [ ] 设计案例需要更好的展示方式（图片？标签云？）
- [ ] 日记页面的心情统计（mood chart）
- [ ] 搜索功能

### 长期 TODO

- [ ] Notion 自动同步（webhook 或 cron 拉取）
- [ ] 移动端适配优化
- [ ] 性能优化（数据量大时分页）

---

## 数据结构快速参考

### 读书笔记 (note)

```typescript
{
  id: string,           // 'note-20260314-xxx'
  title: string,        // 文章/书名
  author?: string,      // 作者/来源
  category: 'folklore' | 'science' | 'zhiguai' | 'design' | 'tech' | 'other',
  summary: string,      // 摘要（列表页）
  content?: string,     // 完整 Markdown（详情页，存在 all-content.json）
  highlights: string[], // 精彩摘录
  thoughts?: string,    // 一句话感想
  rating?: number,      // 1-5 星
  date: string,         // YYYY-MM-DD
}
```

### 添加数据命令

```powershell
cd C:\Users\jasmineyfan\clawd\projects\dahuang-dashboard

node scripts/add-data.cjs note '{
  "title": "...",
  "author": "...",
  "category": "folklore",
  "summary": "...",
  "content": "## Markdown\n\n...",
  "highlights": ["..."],
  "rating": 5
}'

git add data/
git commit -m "data(note): [标题]"
git push
```

---

## 文件位置

| 文件 | 用途 |
|------|------|
| `scripts/add-data.cjs` | 数据写入脚本 |
| `data/reading/notes.json` | 读书笔记元数据 |
| `data/content/all-content.json` | 所有详情内容 |
| `src/pages/NoteDetail.tsx` | 读书笔记详情页 |
| `memory/workflows/daily-reading.md` | 我的读书 workflow |

---

## 协作注意事项

1. **改数据前先 `git pull`**
2. **push 完成后再通知对方**
3. **不要用 fetch-content.cjs 覆盖已有数据**（除非确认要重置）
4. **新功能先在本地测试 `npm run build`**

---

*下次醒来：先检查 git status，看看有没有未 push 的变更*
