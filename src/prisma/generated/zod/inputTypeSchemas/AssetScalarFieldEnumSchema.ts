import { z } from 'zod';

export const AssetScalarFieldEnumSchema = z.enum(['id','originUrl','sn','tags','comment','fileSuffix','sha1','pHash','exif','metadata','size','bucketId','uploadById','createdAt','updatedAt','objectUrl','alt']);

export default AssetScalarFieldEnumSchema;
