export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const getCharCount = (text: string): number => {
  return text.length;
};

export const detectLanguage = (content: string): string => {
  const patterns = [
    { pattern: /^import\s+.*from\s+['"].*['"];?$/m, language: 'javascript' },
    { pattern: /function\s+\w+\s*\([^)]*\)\s*{/m, language: 'javascript' },
    { pattern: /const\s+\w+\s*=/m, language: 'javascript' },
    { pattern: /def\s+\w+\s*\([^)]*\):/m, language: 'python' },
    { pattern: /import\s+\w+/m, language: 'python' },
    { pattern: /class\s+\w+:/m, language: 'python' },
    { pattern: /<html.*?>/im, language: 'html' },
    { pattern: /<div.*?>/im, language: 'html' },
    { pattern: /\.[\w-]+\s*{[^}]*}/m, language: 'css' },
    { pattern: /#[\w-]+\s*{[^}]*}/m, language: 'css' },
    { pattern: /^#{1,6}\s+/m, language: 'markdown' },
    { pattern: /^\*\s+/m, language: 'markdown' },
    { pattern: /\[.*?\]\(.*?\)/m, language: 'markdown' },
  ];

  for (const { pattern, language } of patterns) {
    if (pattern.test(content)) {
      return language;
    }
  }

  return 'plaintext';
};

export const exportNote = (note: any, format: 'txt' | 'md' | 'json'): void => {
  let content = '';
  let filename = '';
  let mimeType = '';
  const looksLikeHtml = (s: string) => /<\w+[^>]*>/.test(s) || /<\/\w+>/.test(s);
  const htmlToText = (html: string): string => {
    try {
      const div = document.createElement('div');
      div.innerHTML = html;
      // innerText preserves line breaks better than textContent
      const text = (div as any).innerText ?? div.textContent ?? '';
      return text.replace(/\u00A0/g, ' ').trim();
    } catch {
      // Fallback strip tags
      return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
  };

  switch (format) {
    case 'txt':
      content = looksLikeHtml(note.content) ? htmlToText(note.content) : note.content;
      // Prepend title if not already part of content
      if ((note.title || '').trim()) {
        content = `${note.title}\n\n${content}`;
      }
      filename = `${note.title}.txt`;
      mimeType = 'text/plain';
      break;
    case 'md':
      if (looksLikeHtml(note.content)) {
        // naive HTML -> text for now to avoid raw tags in MD
        const text = htmlToText(note.content);
        content = `# ${note.title}\n\n${text}`;
      } else {
        content = `# ${note.title}\n\n${note.content}`;
      }
      filename = `${note.title}.md`;
      mimeType = 'text/markdown';
      break;
    case 'json':
      content = JSON.stringify(note, null, 2);
      filename = `${note.title}.json`;
      mimeType = 'application/json';
      break;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
