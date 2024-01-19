import { z } from 'zod';

export const RoleScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt','permissions']);

export default RoleScalarFieldEnumSchema;
