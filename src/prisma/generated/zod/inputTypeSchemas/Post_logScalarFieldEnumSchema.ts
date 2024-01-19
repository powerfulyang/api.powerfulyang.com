import { z } from 'zod';

export const Post_logScalarFieldEnumSchema = z.enum(['id','title','content','postId','createdAt','updatedAt']);

export default Post_logScalarFieldEnumSchema;
