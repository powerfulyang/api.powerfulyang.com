import { z } from 'zod';

export const FamilyScalarFieldEnumSchema = z.enum(['id','name','description','createdAt','updatedAt']);

export default FamilyScalarFieldEnumSchema;
