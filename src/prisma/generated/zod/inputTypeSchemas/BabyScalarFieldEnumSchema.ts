import { z } from 'zod';

export const BabyScalarFieldEnumSchema = z.enum(['id','name','bornAt','gender','avatar','createdAt','updatedAt']);

export default BabyScalarFieldEnumSchema;
