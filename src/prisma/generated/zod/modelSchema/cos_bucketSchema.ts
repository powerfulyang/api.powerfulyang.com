import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'

/////////////////////////////////////////
// COS BUCKET SCHEMA
/////////////////////////////////////////

export const cos_bucketSchema = z.object({
  id: z.number(),
  name: z.string(),
  Bucket: z.string(),
  Region: z.string(),
  ACL: z.string(),
  CORSRules: JsonValueSchema.nullable(),
  RefererConfiguration: JsonValueSchema.nullable(),
  tencentCloudAccountId: z.number(),
  public: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type cos_bucket = z.infer<typeof cos_bucketSchema>

/////////////////////////////////////////
// COS BUCKET OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const cos_bucketOptionalDefaultsSchema = cos_bucketSchema.merge(z.object({
  id: z.number().optional(),
  public: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type cos_bucketOptionalDefaults = z.infer<typeof cos_bucketOptionalDefaultsSchema>

export default cos_bucketSchema;
