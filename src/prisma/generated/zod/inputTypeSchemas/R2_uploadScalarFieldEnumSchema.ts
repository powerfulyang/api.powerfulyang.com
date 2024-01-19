import { z } from 'zod';

export const R2_uploadScalarFieldEnumSchema = z.enum(['id','hash','thumbnailHash','bucketName','mediaType','createdAt','updatedAt']);

export default R2_uploadScalarFieldEnumSchema;
