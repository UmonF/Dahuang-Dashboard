import { readFileSync, writeFileSync } from 'fs';
import https from 'https';

const apiKey = readFileSync('C:/Users/jasmineyfan/.config/notion/api_key', 'utf8').trim();

const databases = {
  techAI: '31bf9ada-2dc9-817f-b4d7-000b5018363e',
  gameUX: '6024087a-a0ed-4735-8a99-a004b8a0cc06',
  designCases: '31ff9ada-2dc9-8153-8d56-000bfb8c1dc9',
  readingNotes: 'c0f0a9de-6186-48e8-9a3f-72de65ed0549',
  diary: '31df9ada-2dc9-81a7-8722-000b88f3224c',
};

async function queryDatabase(dsId, pageSize = 30) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: pageSize
    });

    const options = {
      hostname: 'api.notion.com',
      path: `/v1/data_sources/${dsId}/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2025-09-03',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function extractText(prop) {
  if (!prop) return '';
  if (prop.title) return prop.title[0]?.plain_text || '';
  if (prop.rich_text) return prop.rich_text[0]?.plain_text || '';
  if (prop.select) return prop.select.name || '';
  if (prop.multi_select) return prop.multi_select.map(s => s.name);
  if (prop.date) return prop.date.start || '';
  if (prop.url) return prop.url || '';
  if (prop.checkbox) return prop.checkbox;
  return '';
}

async function main() {
  const output = { fetchedAt: new Date().toISOString() };

  // ========== 羽民国数据 ==========
  
  // Tech & AI Insights
  console.log('Fetching Tech AI...');
  const techAI = await queryDatabase(databases.techAI);
  output.techAI = techAI.results.map(page => {
    const p = page.properties;
    return {
      id: page.id,
      date: extractText(p.Date),
      title: extractText(p.Name),
      summary: extractText(p.Summary),
      category: extractText(p.Category),
      source: extractText(p.Source),
      url: page.url,
      type: 'tech'
    };
  });

  // Game UX Insights
  console.log('Fetching Game UX...');
  const gameUX = await queryDatabase(databases.gameUX);
  output.gameUX = gameUX.results.map(page => {
    const p = page.properties;
    return {
      id: page.id,
      date: extractText(p['Date Added']),
      title: extractText(p.Name),
      notes: extractText(p.Notes),
      contentType: extractText(p.Type),
      uxFocus: extractText(p['UX Focus']),
      link: extractText(p.Link),
      source: extractText(p.Source),
      url: page.url,
      type: 'gameux'
    };
  });

  // Design Cases
  console.log('Fetching Design Cases...');
  const designCases = await queryDatabase(databases.designCases);
  output.designCases = designCases.results.map(page => {
    const p = page.properties;
    return {
      id: page.id,
      date: extractText(p.Date),
      title: extractText(p.Name),
      highlight: extractText(p.Highlight),
      link: extractText(p.Link),
      url: page.url,
      type: 'design'
    };
  });

  // ========== 昆仑丘数据 ==========
  
  // Reading Notes
  console.log('Fetching Reading Notes...');
  const readingNotes = await queryDatabase(databases.readingNotes);
  output.readingNotes = readingNotes.results.map(page => {
    const p = page.properties;
    return {
      id: page.id,
      date: extractText(p.Date),
      title: extractText(p.Name),
      category: extractText(p.Category),
      source: extractText(p.Source),
      link: extractText(p.Link),
      url: page.url
    };
  });

  // ========== 汤谷数据 ==========
  
  // Diary
  console.log('Fetching Diary...');
  const diary = await queryDatabase(databases.diary);
  output.diary = diary.results.map(page => {
    const p = page.properties;
    return {
      id: page.id,
      date: extractText(p.Date),
      title: extractText(p.Name),
      mood: extractText(p.Mood),
      tags: extractText(p.Tags),
      url: page.url
    };
  });

  writeFileSync('C:/Users/jasmineyfan/clawd/projects/dahuang-dashboard/src/data/notion-data.json', JSON.stringify(output, null, 2));
  
  console.log('\n✅ Data saved!');
  console.log(`Tech AI: ${output.techAI.length}`);
  console.log(`Game UX: ${output.gameUX.length}`);
  console.log(`Design Cases: ${output.designCases.length}`);
  console.log(`Reading Notes: ${output.readingNotes.length}`);
  console.log(`Diary: ${output.diary.length}`);
  
  // Print categories for filters
  const techCategories = [...new Set(output.techAI.map(i => i.category).filter(Boolean))];
  const gameTypes = [...new Set(output.gameUX.map(i => i.contentType).filter(Boolean))];
  const uxFocuses = [...new Set(output.gameUX.flatMap(i => Array.isArray(i.uxFocus) ? i.uxFocus : [i.uxFocus]).filter(Boolean))];
  const readingCategories = [...new Set(output.readingNotes.map(i => i.category).filter(Boolean))];
  const diaryMoods = [...new Set(output.diary.map(i => i.mood).filter(Boolean))];
  
  console.log('\n--- Categories for filters ---');
  console.log('Tech Categories:', techCategories);
  console.log('Game Types:', gameTypes);
  console.log('UX Focuses:', uxFocuses);
  console.log('Reading Categories:', readingCategories);
  console.log('Diary Moods:', diaryMoods);
}

main().catch(console.error);
