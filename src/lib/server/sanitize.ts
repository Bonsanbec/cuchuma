import sanitizeHtml from 'sanitize-html';

export function cleanText(value: FormDataEntryValue | null) {
  return String(value ?? '').trim();
}

export function cleanHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'a'],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel']
    },
    allowedSchemes: ['http', 'https', 'mailto']
  });
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}
