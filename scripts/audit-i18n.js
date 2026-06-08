import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');
let hasErrors = false;

// Scan the src directory recursively
function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.svelte-kit' && file !== 'lib/i18n') {
        scanDir(fullPath);
      }
    } else if (stat.isFile()) {
      if (file.endsWith('.svelte')) {
        auditSvelteFile(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.js')) {
        auditTsFile(fullPath);
      }
    }
  }
}

// Verify if a string matches the format of a semantic i18n key (e.g., 'auth.loginTitle')
function isI18nKey(str) {
  return /^[a-z0-9_]+(?:\.[a-z0-9_]+)+$/i.test(str);
}

// Custom brace matcher to strip out all Svelte dynamic expressions & blocks recursively
function stripBrackets(str) {
  let result = '';
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth < 0) {
        depth = 0;
      }
    } else if (depth === 0) {
      result += char;
    }
  }
  return result;
}

// Core checker for code blocks (both .ts files and Svelte script tags)
function auditCodeContent(filePath, codeContent) {
  const messageRegex = /\b(message|subject|text)\s*:\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/gi;
  let match;
  while ((match = messageRegex.exec(codeContent)) !== null) {
    const key = match[1];
    const val = match[2] || match[3] || match[4] || '';
    if (val.trim() === '') continue;

    const letterRegex = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/;
    if (letterRegex.test(val)) {
      if (!isI18nKey(val)) {
        // Exclude common dynamic or system paths that are not user-facing
        if (val.startsWith('/') || val.startsWith('http') || val.includes('/') || val.startsWith('.')) {
          continue;
        }
        console.error(`❌ File has hardcoded user-facing string: ${path.relative(process.cwd(), filePath)}`);
        console.error(`   ${key}: "${val}" must be a translation key (e.g. 'errors.fillAllFields')`);
        hasErrors = true;
      }
    }
  }
}

function auditSvelteFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Audit scripts inside Svelte files
  const scriptMatch = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/i);
  if (scriptMatch && scriptMatch[1]) {
    auditCodeContent(filePath, scriptMatch[1]);
  }

  // 2. Audit Svelte template HTML for raw text nodes
  let template = content;
  template = template.replace(/<script[\s\S]*?<\/script>/gi, '');
  template = template.replace(/<style[\s\S]*?<\/style>/gi, '');
  template = template.replace(/<!--[\s\S]*?-->/g, '');
  template = stripBrackets(template);
  template = template.replace(/<[^>]*>/g, '');

  const rawText = template.trim();
  const letterRegex = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/;
  if (letterRegex.test(rawText)) {
    console.error(`❌ Svelte File has raw text: ${path.relative(process.cwd(), filePath)}`);
    console.error(`   Found text: "${rawText.substring(0, 100).replace(/\s+/g, ' ')}"`);
    hasErrors = true;
  }

  // 3. Audit HTML visual attributes (alt, placeholder, title, aria-label)
  const attrRegex = /\b(alt|placeholder|title|aria-label)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let match;
  while ((match = attrRegex.exec(content)) !== null) {
    const attr = match[1];
    const val = match[2] || match[3] || '';
    if (letterRegex.test(val)) {
      console.error(`❌ Svelte File has hardcoded attribute: ${path.relative(process.cwd(), filePath)}`);
      console.error(`   ${attr}="${val}" must use {$t('...')} instead.`);
      hasErrors = true;
    }
  }
}

function auditTsFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  auditCodeContent(filePath, content);
}

console.log('🔍 Starting i18n audit...');
scanDir(SRC_DIR);

if (hasErrors) {
  console.error('❌ i18n audit failed. Hardcoded user-facing strings found.');
  process.exit(1);
} else {
  console.log('✅ i18n audit passed. No hardcoded user-facing strings found.');
  process.exit(0);
}
