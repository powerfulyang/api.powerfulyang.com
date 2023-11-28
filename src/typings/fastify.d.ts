import type { PassportUser as _PassportUser } from '@/common/authorization/access-guard';

// override fastify passport user type
declare module 'fastify' {
  interface PassportUser extends _PassportUser {}
}
