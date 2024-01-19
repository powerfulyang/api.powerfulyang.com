import { z } from 'zod';

export const FeedScalarFieldEnumSchema = z.enum(['id','content','public','createById','updateById','createdAt','updatedAt']);

export default FeedScalarFieldEnumSchema;
