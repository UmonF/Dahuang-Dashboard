/**
 * 大荒 Dashboard 数据写入工具
 * 供白泽 cron 任务使用
 * 
 * 用法:
 *   node scripts/add-data.cjs <type> <json-data>
 * 
 * 示例:
 *   node scripts/add-data.cjs insight '{"title":"...", "summary":"...", "content":"markdown内容", ...}'
 *   node scripts/add-data.cjs note '{"title":"...", "category":"...", "content":"...", ...}'
 *   node scripts/add-data.cjs diary '{"mood":"sunny", "content":"...", ...}'
 *   node scripts/add-data.cjs experiment '{"title":"...", "status":"wip", ...}'
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content', 'all-content.json');

const DATA_FILES = {
  insight: 'feeds/insights.json',
  note: 'reading/notes.json',
  diary: 'diary/entries.json',
  experiment: 'projects/experiments.json',
};

// 生成 ID
function generateId(type, date) {
  const dateStr = date.replace(/-/g, '');
  const timestamp = Date.now().toString(36);
  
  switch (type) {
    case 'insight':
      return `insight-${dateStr}-${timestamp}`;
    case 'note':
      return `note-${dateStr}-${timestamp}`;
    case 'diary':
      return `diary-${dateStr}`;
    case 'experiment':
      return `exp-${timestamp}`;
    default:
      return `item-${timestamp}`;
  }
}

// 获取今天日期
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// 读取 JSON 文件
function readDataFile(type) {
  const filePath = path.join(DATA_DIR, DATA_FILES[type]);
  if (!fs.existsSync(filePath)) {
    return { version: '1.0', updatedAt: new Date().toISOString(), items: [] };
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// 写入 JSON 文件
function writeDataFile(type, data) {
  const filePath = path.join(DATA_DIR, DATA_FILES[type]);
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Metadata written to ${filePath}`);
}

// 读取内容文件
function readContentFile() {
  if (!fs.existsSync(CONTENT_FILE)) {
    // 确保目录存在
    const dir = path.dirname(CONTENT_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return {};
  }
  return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
}

// 写入内容文件
function writeContentFile(contents) {
  const dir = path.dirname(CONTENT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(contents, null, 2), 'utf8');
  console.log(`✅ Content written to ${CONTENT_FILE}`);
}

// 添加内容到内容文件
function addContent(id, title, markdownContent) {
  if (!markdownContent) return;
  
  const contents = readContentFile();
  contents[id] = {
    id,
    title,
    content: markdownContent,
    fetchedAt: new Date().toISOString(),
  };
  writeContentFile(contents);
}

// 添加数据项
function addItem(type, itemData) {
  const data = readDataFile(type);
  const today = getToday();
  
  // 分离 content 字段（用于详情页）和元数据
  const { content: markdownContent, ...metadata } = itemData;
  
  // 补充默认字段
  const item = {
    id: metadata.id || generateId(type, today),
    ...metadata,
    date: metadata.date || today,
    createdAt: metadata.createdAt || new Date().toISOString(),
  };
  
  // 日记特殊处理：同一天只能有一条，更新而不是添加
  if (type === 'diary') {
    const existingIndex = data.items.findIndex(i => i.date === item.date);
    if (existingIndex >= 0) {
      // 保留原 ID
      item.id = data.items[existingIndex].id;
      data.items[existingIndex] = { ...data.items[existingIndex], ...item };
      console.log(`📝 Updated diary for ${item.date}`);
    } else {
      data.items.unshift(item);
      console.log(`📝 Added diary for ${item.date}`);
    }
  } else {
    // 其他类型直接添加到开头
    data.items.unshift(item);
    console.log(`📝 Added ${type}: ${item.title || item.id}`);
  }
  
  writeDataFile(type, data);
  
  // 如果有完整内容，写入内容文件
  if (markdownContent) {
    addContent(item.id, item.title, markdownContent);
  }
  
  return item;
}

// 更新内容（单独更新详情内容，不改变元数据）
function updateContent(id, markdownContent) {
  const contents = readContentFile();
  if (contents[id]) {
    contents[id].content = markdownContent;
    contents[id].fetchedAt = new Date().toISOString();
    writeContentFile(contents);
    console.log(`📝 Updated content for ${id}`);
    return true;
  }
  console.error(`❌ Content not found: ${id}`);
  return false;
}

// 列出数据
function listItems(type, limit = 5) {
  const data = readDataFile(type);
  console.log(`\n📋 ${type} (${data.items.length} items, showing ${Math.min(limit, data.items.length)}):\n`);
  data.items.slice(0, limit).forEach(item => {
    console.log(`  - [${item.id}] ${item.title || item.date}`);
  });
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

if (command === 'list') {
  const type = args[1];
  if (!DATA_FILES[type]) {
    console.error('❌ Invalid type. Use: insight, note, diary, experiment');
    process.exit(1);
  }
  listItems(type, parseInt(args[2]) || 5);
} else if (command === 'update-content') {
  const id = args[1];
  const content = args[2];
  if (!id || !content) {
    console.error('❌ Usage: update-content <id> <markdown-content>');
    process.exit(1);
  }
  updateContent(id, content);
} else if (command === 'add' || DATA_FILES[command]) {
  // 支持 'add insight {...}' 或 'insight {...}'
  const type = command === 'add' ? args[1] : command;
  const jsonStr = command === 'add' ? args[2] : args[1];
  
  if (!DATA_FILES[type]) {
    console.error('❌ Invalid type. Use: insight, note, diary, experiment');
    process.exit(1);
  }
  
  if (!jsonStr) {
    console.error('❌ Missing JSON data');
    process.exit(1);
  }
  
  try {
    const itemData = JSON.parse(jsonStr);
    addItem(type, itemData);
  } catch (e) {
    console.error('❌ Invalid JSON:', e.message);
    process.exit(1);
  }
} else {
  console.log(`
大荒 Dashboard 数据写入工具

用法:
  node scripts/add-data.cjs <type> '<json>'           添加数据（含内容）
  node scripts/add-data.cjs update-content <id> '<md>' 更新详情内容
  node scripts/add-data.cjs list <type> [n]           列出数据

类型:
  insight     资讯 (羽民国)
  note        读书笔记 (昆仑丘)
  diary       日记 (汤谷)
  experiment  实验项目 (灵山)

示例:
  # 添加资讯（含完整 Markdown 内容）
  node scripts/add-data.cjs insight '{"title":"AI News","summary":"摘要","content":"## 完整内容\\n\\n正文...","category":"tech-ai","source":"Twitter","tags":["AI"]}'
  
  # 添加日记
  node scripts/add-data.cjs diary '{"mood":"sunny","title":"Good day","content":"今天发生了..."}'
  
  # 列出资讯
  node scripts/add-data.cjs list insight 10
`);
}

module.exports = { addItem, updateContent, readDataFile, writeDataFile, listItems, addContent };
