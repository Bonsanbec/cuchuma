import { writable, derived } from 'svelte/store';
import esJson from './locales/es.json';

// Initialize the dictionary store with static Spanish keys.
// In +layout.server.ts and +layout.svelte, we will enrich it with DB site settings.
export const dictionary = writable<Record<string, any>>(esJson);

// Helper function to resolve nested keys like 'hero.title'
export function getNestedValue(obj: any, path: string): string | undefined {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}

// Helper to replace {param} tokens with actual values
export function replaceParams(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  let result = text;
  for (const [key, val] of Object.entries(params)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), String(val));
  }
  return result;
}

// Stateful/store-free translation function, safe for hooks and server side.
export function translate(key: string, params?: Record<string, string | number>, customDict?: Record<string, any>): string {
  const dict = customDict || esJson;
  const val = getNestedValue(dict, key) || getNestedValue(esJson, key) || key;
  return replaceParams(val, params);
}

// Derived store 't' for components. Usage: {$t('key')}
export const t = derived(dictionary, ($dictionary) => {
  return (key: string, params?: Record<string, string | number>) => {
    return translate(key, params, $dictionary);
  };
});

// Returns a translator function bound to the static dictionary (safe for server actions)
export function getBackendTranslator() {
  return (key: string, params?: Record<string, string | number>) => {
    return translate(key, params);
  };
}
