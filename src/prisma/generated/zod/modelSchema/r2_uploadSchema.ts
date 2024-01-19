import { z } from 'zod';

/////////////////////////////////////////
// R 2 UPLOAD SCHEMA
/////////////////////////////////////////

export const r2_uploadSchema = z.object({
  id: z.number(),
  hash: z.string(),
  thumbnailHash: z.string(),
  bucketName: z.string(),
  mediaType: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type r2_upload = z.infer<typeof r2_uploadSchema>

/////////////////////////////////////////
// R 2 UPLOAD OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const r2_uploadOptionalDefaultsSchema = r2_uploadSchema.merge(z.object({
  id: z.number().optional(),
  thumbnailHash: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type r2_uploadOptionalDefaults = z.infer<typeof r2_uploadOptionalDefaultsSchema>

export default r2_uploadSchema;
