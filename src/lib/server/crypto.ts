import { createHash, randomBytes } from 'node:crypto';

export function createToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

export function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function hashIp(value: string | null) {
  return value ? sha256(value).slice(0, 32) : null;
}
