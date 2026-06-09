import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { extname, join } from 'node:path';
import type { MediaKind } from '@prisma/client';
import { env } from '$env/dynamic/private';
import { createToken } from '$lib/server/crypto';

const allowedMime = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/mp4',
  'audio/ogg',
  'application/pdf',
  'text/plain'
]);

export function mediaKind(mimeType: string): MediaKind {
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  return 'DOCUMENT';
}

export async function saveUpload(file: File) {
  if (!allowedMime.has(file.type)) {
    throw new Error('Tipo de archivo no permitido.');
  }
  const maxBytes = 50 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('El archivo excede el tamaño máximo de 50 MB.');
  }
  const root = env.LOCAL_STORAGE_ROOT || './static/uploads';
  const publicRoot = env.LOCAL_STORAGE_PUBLIC_PATH || '/uploads';
  const key = `${new Date().toISOString().slice(0, 10)}/${createToken(12)}${extname(file.name)}`;
  const target = join(root, key);
  await mkdir(join(root, key.split('/')[0]), { recursive: true });
  await writeFile(target, Buffer.from(await file.arrayBuffer()));
  return {
    storageKey: key,
    publicUrl: `${publicRoot}/${key}`,
    sizeBytes: file.size,
    mimeType: file.type,
    originalName: file.name,
    kind: mediaKind(file.type)
  };
}

export async function deleteUpload(storageKey: string) {
  const root = env.LOCAL_STORAGE_ROOT || './static/uploads';
  const target = join(root, storageKey);
  try {
    await unlink(target);
  } catch (e) {
    console.error(`Error deleting file: ${target}`, e);
  }
}
