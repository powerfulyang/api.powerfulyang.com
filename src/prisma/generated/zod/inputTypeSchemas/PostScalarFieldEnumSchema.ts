import { z } from 'zod';

export const PostScalarFieldEnumSchema = z.enum(['id','title','content','tags','public','publishYear','createById','posterId','updateById','summary','createdAt','updatedAt']);

export default PostScalarFieldEnumSchema;
