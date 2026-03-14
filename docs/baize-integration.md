# 白泽数据写入指南

## 脚本位置

```
C:\Users\jasmineyfan\clawd\projects\dahuang-dashboard\scripts\add-data.cjs
```

## 快速使用

### 添加资讯 (羽民国)

```javascript
// 在 cron 任务中
const { addItem } = require('C:/Users/jasmineyfan/clawd/projects/dahuang-dashboard/scripts/add-data.cjs');

addItem('insight', {
  title: '标题',
  summary: '摘要',
  source: 'Twitter',           // Twitter/Blog/Paper/Newsletter/Video
  sourceUrl: 'https://...',    // 可选
  category: 'tech-ai',         // tech-ai/game-ux/design
  tags: ['AI', 'LLM'],
});
```

### 添加读书笔记 (昆仑丘)

```javascript
addItem('note', {
  title: '书名',
  author: '作者',              // 可选
  category: 'design',          // folklore/science/zhiguai/design/tech/other
  summary: '笔记摘要',
  highlights: ['精华1', '精华2'],
  thoughts: '个人思考',        // 可选
  rating: 5,                   // 可选，1-5
});
```

### 添加日记 (汤谷)

```javascript
addItem('diary', {
  mood: 'sunny',               // sunny/cloudy/rainy/stormy/rainbow
  title: '标题',               // 可选
  content: '正文内容',
  tags: ['标签1', '标签2'],    // 可选
  weather: '晴',               // 可选
});
```

### 添加实验项目 (灵山)

```javascript
addItem('experiment', {
  title: '项目名',
  description: '描述',
  status: 'wip',               // idea/wip/done/archived
  tags: ['React', 'AI'],
  coverEmoji: '🚀',            // 可选
  demoUrl: 'https://...',      // 可选
  repoUrl: 'https://...',      // 可选
});
```

## 命令行使用

```powershell
cd C:\Users\jasmineyfan\clawd\projects\dahuang-dashboard

# 添加资讯
node scripts/add-data.js insight '{"title":"...", "summary":"...", "category":"tech-ai", "source":"Twitter", "tags":["AI"]}'

# 添加日记
node scripts/add-data.js diary '{"mood":"sunny", "content":"今天..."}'

# 列出最近 10 条资讯
node scripts/add-data.js list insight 10
```

## 写入后部署

写入数据后需要提交并推送：

```powershell
cd C:\Users\jasmineyfan\clawd\projects\dahuang-dashboard
git add data/
git commit -m "data: update <type>"
git push
```

GitHub Actions 会自动部署更新。

## 自动化建议

白泽的 cron 任务可以：

1. 收集/生成内容
2. 调用 `addItem()` 写入 JSON
3. 执行 git commit + push

```javascript
// 伪代码
const { addItem } = require('./scripts/add-data.cjs');
const { execSync } = require('child_process');

// 写入数据
addItem('insight', newInsight);

// 提交推送
execSync('git add data/ && git commit -m "data: daily update" && git push', {
  cwd: 'C:/Users/jasmineyfan/clawd/projects/dahuang-dashboard'
});
```
