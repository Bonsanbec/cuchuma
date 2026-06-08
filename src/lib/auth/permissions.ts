import type { RoleLevel } from '@prisma/client';

const rank: Record<RoleLevel, number> = {
  CONTRIBUTOR: 1,
  MEMBER: 2,
  ADMIN: 3
};

export function hasRole(userRole: RoleLevel | undefined, required: RoleLevel) {
  if (!userRole) return false;
  return rank[userRole] >= rank[required];
}

export function canModerate(userRole: RoleLevel | undefined) {
  return hasRole(userRole, 'MEMBER');
}

export function canAdmin(userRole: RoleLevel | undefined) {
  return hasRole(userRole, 'ADMIN');
}
