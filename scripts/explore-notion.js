import { readFileSync } from 'fs';
import https from 'https';

const apiKey = readFileSync('C:/Users/jasmineyfan/.config/notion/api_key', 'utf8').trim();

// 已知的数据库 ID
const databases = {
  '中文DB1': '31ff9ada-2dc9-8153-8d56-000bfb8c1dc9',
  '中文DB2': 'c0f0a9de-6186-48e8-9a3f-72de65ed0549',
  '中文DB3': '31df9ada-2dc9-81a7-8722-000b88f3224c',
};

async function getDatabase(dbId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.notion.com',
      path: `/v1/databases/${dbId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2025-09-03',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', reject);
    req.end();
  });
}

async function queryDatabase(dsId, pageSize = 5) {
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

async function main() {
  for (const [name, id] of Object.entries(databases)) {
    console.log(`\n=== ${name} (${id}) ===`);
    
    // Get database info
    const dbInfo = await getDatabase(id);
    console.log('Title:', dbInfo.title?.[0]?.plain_text || 'Unknown');
    console.log('Properties:', Object.keys(dbInfo.properties || {}));
    
    // Query sample data
    const data = await queryDatabase(id, 3);
    if (data.results) {
      console.log('Sample entries:');
      data.results.forEach(page => {
        const props = page.properties;
        const title = props.Name?.title?.[0]?.plain_text || 
                     props.Title?.title?.[0]?.plain_text ||
                     props['名称']?.title?.[0]?.plain_text ||
                     'Untitled';
        console.log(`  - ${title}`);
      });
    } else {
      console.log('Error:', data.message || 'Unknown error');
    }
  }
}

main().catch(console.error);
