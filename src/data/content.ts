// 文章完整内容数据
// 由 scripts/fetch-content.mjs 从 Notion 获取

import contentData from '../../data/content/all-content.json'

export interface ArticleContent {
  id: string
  title: string
  content: string  // Markdown 格式
  fetchedAt: string
}

const contents = contentData as Record<string, ArticleContent>

// 根据 ID 获取文章内容
export function getContentById(id: string): ArticleContent | null {
  // 尝试原始 ID
  if (contents[id]) {
    return contents[id]
  }
  
  // 尝试不同格式的 ID（notion ID 可能有不同格式）
  const normalizedId = id.replace(/-/g, '')
  for (const [key, value] of Object.entries(contents)) {
    if (key.replace(/-/g, '') === normalizedId) {
      return value
    }
  }
  
  return null
}

// 获取所有内容
export function getAllContent(): Record<string, ArticleContent> {
  return contents
}
