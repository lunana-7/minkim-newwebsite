const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase().trim();

export function searchContent(items, query, type = 'All') {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return items.flatMap(item => {
    if (type !== 'All' && item.type !== type) return [];
    const title = normalize(item.title);
    const tags = normalize(item.tags?.join(' '));
    const excerpt = normalize(item.excerpt);
    const content = normalize(item.content);
    if (!terms.every(term => `${title} ${tags} ${excerpt} ${content}`.includes(term))) return [];
    const score = terms.reduce((sum, term) => sum
      + (title.includes(term) ? 12 : 0)
      + (tags.includes(term) ? 6 : 0)
      + (excerpt.includes(term) ? 3 : 0)
      + (content.includes(term) ? 1 : 0), 0);
    return [{ ...item, score }];
  }).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

export function searchSnippet(item, query) {
  const content = String(item.content || '');
  const term = normalize(query).split(/\s+/).find(Boolean);
  const at = term ? normalize(content).indexOf(term) : -1;
  if (at < 0 || normalize(item.excerpt).includes(term)) return item.excerpt;
  const start = Math.max(0, at - 65);
  const end = Math.min(content.length, at + 125);
  return `${start ? '…' : ''}${content.slice(start, end).trim()}${end < content.length ? '…' : ''}`;
}
