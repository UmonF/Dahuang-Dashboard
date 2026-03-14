/**
 * 获取 Notion 页面完整内容并保存到 JSON
 * 供详情页显示
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import https from 'https';
import path from 'path';

const apiKey = readFileSync('C:/Users/jasmineyfan/.config/notion/api_key', 'utf8').trim();

// 获取页面 blocks
async function getPageBlocks(pageId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.notion.com',
      path: `/v1/blocks/${pageId}/children?page_size=100`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// 将 blocks 转换为 Markdown
function blocksToMarkdown(blocks) {
  if (!blocks || !blocks.results) return '';
  
  return blocks.results.map(block => {
    const type = block.type;
    const data = block[type];
    
    if (!data) return '';
    
    switch (type) {
      case 'paragraph':
        return richTextToMarkdown(data.rich_text) + '\n';
      
      case 'heading_1':
        return `# ${richTextToMarkdown(data.rich_text)}\n`;
      
      case 'heading_2':
        return `## ${richTextToMarkdown(data.rich_text)}\n`;
      
      case 'heading_3':
        return `### ${richTextToMarkdown(data.rich_text)}\n`;
      
      case 'bulleted_list_item':
        return `- ${richTextToMarkdown(data.rich_text)}\n`;
      
      case 'numbered_list_item':
        return `1. ${richTextToMarkdown(data.rich_text)}\n`;
      
      case 'to_do':
        const checkbox = data.checked ? '[x]' : '[ ]';
        return `- ${checkbox} ${richTextToMarkdown(data.rich_text)}\n`;
      
      case 'toggle':
        return `<details>\n<summary>${richTextToMarkdown(data.rich_text)}</summary>\n</details>\n`;
      
      case 'quote':
        return `> ${richTextToMarkdown(data.rich_text)}\n`;
      
      case 'callout':
        const emoji = data.icon?.emoji || '💡';
        return `> ${emoji} ${richTextToMarkdown(data.rich_text)}\n`;
      
      case 'code':
        const lang = data.language || '';
        return `\`\`\`${lang}\n${richTextToMarkdown(data.rich_text)}\n\`\`\`\n`;
      
      case 'divider':
        return '---\n';
      
      case 'image':
        const url = data.file?.url || data.external?.url || '';
        const caption = data.caption ? richTextToMarkdown(data.caption) : '';
        return `![${caption}](${url})\n`;
      
      case 'bookmark':
        return `[🔗 ${data.url}](${data.url})\n`;
      
      case 'link_preview':
        return `[🔗 ${data.url}](${data.url})\n`;
      
      case 'embed':
        return `[📎 Embed: ${data.url}](${data.url})\n`;
      
      case 'video':
        const videoUrl = data.file?.url || data.external?.url || '';
        return `[🎬 Video](${videoUrl})\n`;
      
      default:
        return '';
    }
  }).join('\n');
}

// 将 rich_text 转换为 Markdown
function richTextToMarkdown(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  
  return richText.map(rt => {
    let text = rt.plain_text || '';
    const annotations = rt.annotations || {};
    
    if (annotations.bold) text = `**${text}**`;
    if (annotations.italic) text = `*${text}*`;
    if (annotations.strikethrough) text = `~~${text}~~`;
    if (annotations.code) text = `\`${text}\``;
    if (rt.href) text = `[${text}](${rt.href})`;
    
    return text;
  }).join('');
}

// 主函数：获取所有文章内容
async function fetchAllContent() {
  // 读取现有数据
  const notionData = JSON.parse(
    readFileSync('C:/Users/jasmineyfan/clawd/projects/dahuang-dashboard/src/data/notion-data.json', 'utf8')
  );
  
  const contentDir = 'C:/Users/jasmineyfan/clawd/projects/dahuang-dashboard/data/content';
  if (!existsSync(contentDir)) {
    mkdirSync(contentDir, { recursive: true });
  }
  
  const allContent = {};
  
  // 处理 Tech AI
  console.log('Fetching Tech AI content...');
  for (const item of notionData.techAI || []) {
    try {
      console.log(`  - ${item.title.substring(0, 30)}...`);
      const blocks = await getPageBlocks(item.id);
      const content = blocksToMarkdown(blocks);
      allContent[item.id] = {
        id: item.id,
        title: item.title,
        content: content,
        fetchedAt: new Date().toISOString(),
      };
      // 避免 rate limit
      await new Promise(r => setTimeout(r, 350));
    } catch (e) {
      console.error(`  ✗ Failed: ${item.id}`, e.message);
    }
  }
  
  // 处理 Game UX
  console.log('Fetching Game UX content...');
  for (const item of notionData.gameUX || []) {
    try {
      console.log(`  - ${item.title.substring(0, 30)}...`);
      const blocks = await getPageBlocks(item.id);
      const content = blocksToMarkdown(blocks);
      allContent[item.id] = {
        id: item.id,
        title: item.title,
        content: content,
        fetchedAt: new Date().toISOString(),
      };
      await new Promise(r => setTimeout(r, 350));
    } catch (e) {
      console.error(`  ✗ Failed: ${item.id}`, e.message);
    }
  }
  
  // 处理 Reading Notes
  console.log('Fetching Reading Notes content...');
  for (const item of notionData.readingNotes || []) {
    try {
      console.log(`  - ${item.title.substring(0, 30)}...`);
      const blocks = await getPageBlocks(item.id);
      const content = blocksToMarkdown(blocks);
      allContent[item.id] = {
        id: item.id,
        title: item.title,
        content: content,
        fetchedAt: new Date().toISOString(),
      };
      await new Promise(r => setTimeout(r, 350));
    } catch (e) {
      console.error(`  ✗ Failed: ${item.id}`, e.message);
    }
  }
  
  // 处理 Design Cases
  console.log('Fetching Design Cases content...');
  for (const item of notionData.designCases || []) {
    try {
      console.log(`  - ${item.title.substring(0, 30)}...`);
      const blocks = await getPageBlocks(item.id);
      const content = blocksToMarkdown(blocks);
      allContent[item.id] = {
        id: item.id,
        title: item.title,
        content: content,
        fetchedAt: new Date().toISOString(),
      };
      await new Promise(r => setTimeout(r, 350));
    } catch (e) {
      console.error(`  ✗ Failed: ${item.id}`, e.message);
    }
  }
  
  // 处理 Diary
  console.log('Fetching Diary content...');
  for (const item of notionData.diary || []) {
    try {
      console.log(`  - ${item.title.substring(0, 30)}...`);
      const blocks = await getPageBlocks(item.id);
      const content = blocksToMarkdown(blocks);
      allContent[item.id] = {
        id: item.id,
        title: item.title,
        content: content,
        fetchedAt: new Date().toISOString(),
      };
      await new Promise(r => setTimeout(r, 350));
    } catch (e) {
      console.error(`  ✗ Failed: ${item.id}`, e.message);
    }
  }
  
  // 保存所有内容
  writeFileSync(
    path.join(contentDir, 'all-content.json'),
    JSON.stringify(allContent, null, 2),
    'utf8'
  );
  
  console.log(`\n✅ Saved ${Object.keys(allContent).length} articles to data/content/all-content.json`);
}

fetchAllContent().catch(console.error);
