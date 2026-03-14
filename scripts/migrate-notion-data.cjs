/**
 * 数据迁移脚本：notion-data.json → 应龙的新数据结构
 */
const fs = require('fs');
const path = require('path');

const projectRoot = 'C:/Users/jasmineyfan/clawd/projects/dahuang-dashboard';
const notionData = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src/data/notion-data.json'), 'utf8'));

// 辅助函数
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function now() {
  return new Date().toISOString();
}

// ========== 迁移 Insights (羽民国) ==========
const insights = {
  version: '1.0.0',
  updatedAt: now(),
  items: []
};

// Tech AI
notionData.techAI.forEach(item => {
  insights.items.push({
    id: item.id.replace(/-/g, '').substring(0, 8),
    title: item.title,
    summary: item.summary || '',
    source: item.source || 'Unknown',
    sourceUrl: item.url,
    category: 'tech-ai',
    tags: item.category ? [item.category] : [],
    date: item.date,
    createdAt: item.date + 'T00:00:00.000Z'
  });
});

// Game UX
notionData.gameUX.forEach(item => {
  const uxFocus = Array.isArray(item.uxFocus) ? item.uxFocus : [];
  insights.items.push({
    id: item.id.replace(/-/g, '').substring(0, 8),
    title: item.title,
    summary: item.notes || '',
    source: item.source || 'Unknown',
    sourceUrl: item.link || item.url,
    category: 'game-ux',
    tags: uxFocus.slice(0, 5),
    date: item.date,
    createdAt: item.date + 'T00:00:00.000Z'
  });
});

// Design Cases
notionData.designCases.forEach(item => {
  const highlight = Array.isArray(item.highlight) ? item.highlight.join(' ') : (item.highlight || '');
  insights.items.push({
    id: item.id.replace(/-/g, '').substring(0, 8),
    title: item.title,
    summary: highlight,
    source: 'Collection',
    sourceUrl: item.link || item.url,
    category: 'design',
    tags: [],
    date: item.date,
    createdAt: item.date + 'T00:00:00.000Z'
  });
});

// 按日期排序
insights.items.sort((a, b) => b.date.localeCompare(a.date));

// ========== 迁移 Reading Notes (昆仑丘) ==========
const CATEGORY_MAP = {
  'Science': 'science',
  'Zhiguai': 'zhiguai',
  'Folklore': 'folklore',
  'Philosophy': 'other',
  'History': 'other',
  'Design': 'design',
  'Tech': 'tech'
};

const readingNotes = {
  version: '1.0.0',
  updatedAt: now(),
  items: []
};

notionData.readingNotes.forEach(item => {
  const cats = Array.isArray(item.category) ? item.category : [item.category].filter(Boolean);
  const firstCat = cats[0] || 'other';
  const mappedCategory = CATEGORY_MAP[firstCat] || 'other';
  
  readingNotes.items.push({
    id: item.id.replace(/-/g, '').substring(0, 8),
    title: item.title,
    author: item.source || undefined,
    category: mappedCategory,
    summary: '',  // Notion 数据没有 summary
    highlights: [],
    thoughts: undefined,
    rating: undefined,
    date: item.date,
    createdAt: item.date + 'T00:00:00.000Z'
  });
});

readingNotes.items.sort((a, b) => b.date.localeCompare(a.date));

// ========== 迁移 Diary (汤谷) ==========
const MOOD_MAP = {
  'calm': 'sunny',
  'reflective': 'cloudy',
  'curious': 'rainbow',
  'accomplished': 'sunny',
  'productive': 'sunny',
  'contemplative': 'cloudy',
  'peaceful': 'sunny'
};

const diary = {
  version: '1.0.0',
  updatedAt: now(),
  items: []
};

notionData.diary.forEach(item => {
  const mood = MOOD_MAP[item.mood] || 'cloudy';
  const tags = Array.isArray(item.tags) ? item.tags : [];
  
  diary.items.push({
    id: item.id.replace(/-/g, '').substring(0, 8),
    date: item.date,
    mood: mood,
    title: item.title,
    content: '',  // Notion 数据标题即内容概要
    tags: tags,
    weather: undefined,
    createdAt: item.date + 'T00:00:00.000Z'
  });
});

diary.items.sort((a, b) => b.date.localeCompare(a.date));

// ========== 保留 Experiments (灵山) mock 数据 ==========
const experiments = {
  version: '1.0.0',
  updatedAt: now(),
  items: [
    {
      id: 'dahuang01',
      title: '大荒百景 Dashboard',
      description: '游戏化个人仪表盘，山海经世界观',
      status: 'wip',
      tags: ['React', 'Framer Motion'],
      coverEmoji: '🏔️',
      date: '2026-03-14',
      createdAt: now()
    },
    {
      id: 'fan01',
      title: '水墨扇面交互',
      description: '折扇展开收起动画实验',
      status: 'done',
      tags: ['SVG', 'Animation'],
      coverEmoji: '🪭',
      date: '2026-03-13',
      createdAt: now()
    },
    {
      id: 'vert01',
      title: '竖排文字组件',
      description: '中文竖排排版的 React 组件',
      status: 'done',
      tags: ['Typography', 'React'],
      coverEmoji: '📜',
      date: '2026-03-12',
      createdAt: now()
    }
  ]
};

// ========== 写入文件 ==========
const dataDir = path.join(projectRoot, 'data');

fs.writeFileSync(
  path.join(dataDir, 'feeds/insights.json'),
  JSON.stringify(insights, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, 'reading/notes.json'),
  JSON.stringify(readingNotes, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, 'diary/entries.json'),
  JSON.stringify(diary, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, 'projects/experiments.json'),
  JSON.stringify(experiments, null, 2)
);

console.log('✅ 数据迁移完成');
console.log(`   Insights: ${insights.items.length} 条`);
console.log(`   Reading Notes: ${readingNotes.items.length} 条`);
console.log(`   Diary: ${diary.items.length} 条`);
console.log(`   Experiments: ${experiments.items.length} 条`);
