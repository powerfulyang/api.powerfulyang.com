import { z } from 'zod';

/////////////////////////////////////////
// R 2 BUCKET SCHEMA
/////////////////////////////////////////

export const r2_bucketSchema = z.object({
  id: z.number(),
  name: z.string(),
  domain: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type r2_bucket = z.infer<typeof r2_bucketSchema>

/////////////////////////////////////////
// R 2 BUCKET OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const r2_bucketOptionalDefaultsSchema = r2_bucketSchema.merge(z.object({
  id: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type r2_bucketOptionalDefaults = z.infer<typeof r2_bucketOptionalDefaultsSchema>

export default r2_bucketSchema;
