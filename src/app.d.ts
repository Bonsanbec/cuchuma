import type { RoleLevel } from '@prisma/client';

declare global {
  namespace App {
    interface Locals {
      user: {
        id: string;
        email: string;
        name: string;
        role: { id: string; name: string; level: RoleLevel };
        suspended: boolean;
      } | null;
      csrf: string;
    }
    interface PageData {
      user?: App.Locals['user'];
      csrf?: string;
    }
  }
}

export {};
