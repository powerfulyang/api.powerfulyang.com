import { z } from 'zod';

export const R2_bucketScalarFieldEnumSchema = z.enum(['id','name','domain','createdAt','updatedAt']);

export default R2_bucketScalarFieldEnumSchema;
