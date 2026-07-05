import { SearchableItem } from '../actions/searchActions'

export function searchItems(items: SearchableItem[], query: string, category: 'all' | 'mold' | 'cutter' = 'all'): SearchableItem[] {
  if (!query || !query.trim()) {
    return items
  }

  // Phân tách bởi dấu phẩy = OR logic
  const keywordsOR = query
    .split(',')
    .map(k => k.trim().toLowerCase())
    .filter(k => k.length > 0)

  if (keywordsOR.length === 0) {
    return items
  }

  return items.filter(item => {
    // Filter by category
    if (category !== 'all' && item.itemType !== category) {
      return false
    }

    // Logic OR giữa các nhóm phẩy
    return keywordsOR.some(keywordGroup => {
      // Phân tách bởi khoảng trắng = AND logic trong 1 nhóm phẩy
      const subKeywordsAND = keywordGroup.split(/\s+/).filter(k => k.length > 0)
      if (subKeywordsAND.length === 0) return false

      return subKeywordsAND.every(subWord => matchItem(item, subWord))
    })
  })
}

function matchItem(item: SearchableItem, keyword: string): boolean {
  return item.searchableText.includes(keyword)
}
