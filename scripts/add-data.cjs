/**
 * 大荒 Dashboard 数据写入工具
 * 供白泽 cron 任务使用
 * 
 * 用法:
 *   node scripts/add-data.js <type> <json-data>
 * 
 * 示例:
 *   node scripts/add-data.js insight '{"title":"...", "summary":"...", ...}'
 *   node scripts/add-data.js note '{"title":"...", "category":"...", ...}'
 *   node scripts/add-data.js diary '{"mood":"sunny", "content":"...", ...}'
 *   node scripts/add-data.js experiment '{"title":"...", "status":"wip", ...}'
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

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
  console.log(`✅ Written to ${filePath}`);
}

// 添加数据项
function addItem(type, itemData) {
  const data = readDataFile(type);
  const today = getToday();
  
  // 补充默认字段
  const item = {
    id: itemData.id || generateId(type, today),
    ...itemData,
    date: itemData.date || today,
    createdAt: itemData.createdAt || new Date().toISOString(),
  };
  
  // 日记特殊处理：同一天只能有一条，更新而不是添加
  if (type === 'diary') {
    const existingIndex = data.items.findIndex(i => i.date === item.date);
    if (existingIndex >= 0) {
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
  return item;
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
  node scripts/add-data.js <type> '<json>'     添加数据
  node scripts/add-data.js list <type> [n]     列出数据

类型:
  insight     资讯 (羽民国)
  note        读书笔记 (昆仑丘)
  diary       日记 (汤谷)
  experiment  实验项目 (灵山)

示例:
  node scripts/add-data.js insight '{"title":"AI News","summary":"...","category":"tech-ai","source":"Twitter","tags":["AI"]}'
  node scripts/add-data.js diary '{"mood":"sunny","title":"Good day","content":"..."}'
  node scripts/add-data.js list insight 10
`);
}

module.exports = { addItem, readDataFile, writeDataFile, listItems };
