import { z } from 'zod';

export const MenuScalarFieldEnumSchema = z.enum(['id','path','parentId','name','createdAt','updatedAt']);

export default MenuScalarFieldEnumSchema;
