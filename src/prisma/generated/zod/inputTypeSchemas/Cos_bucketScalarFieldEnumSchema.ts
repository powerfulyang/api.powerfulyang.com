import { z } from 'zod';

export const Cos_bucketScalarFieldEnumSchema = z.enum(['id','name','Bucket','Region','ACL','CORSRules','RefererConfiguration','tencentCloudAccountId','public','createdAt','updatedAt']);

export default Cos_bucketScalarFieldEnumSchema;
