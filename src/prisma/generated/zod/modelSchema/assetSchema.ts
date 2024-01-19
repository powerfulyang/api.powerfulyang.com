import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'

/////////////////////////////////////////
// ASSET SCHEMA
/////////////////////////////////////////

export const assetSchema = z.object({
  id: z.number(),
  originUrl: z.string(),
  sn: z.string(),
  tags: JsonValueSchema.nullable(),
  comment: z.string(),
  fileSuffix: z.string(),
  sha1: z.string(),
  pHash: z.string(),
  exif: JsonValueSchema,
  metadata: JsonValueSchema.nullable(),
  size: JsonValueSchema.nullable(),
  bucketId: z.number(),
  uploadById: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  objectUrl: JsonValueSchema.nullable(),
  alt: z.string(),
})

export type asset = z.infer<typeof assetSchema>

/////////////////////////////////////////
// ASSET OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const assetOptionalDefaultsSchema = assetSchema.merge(z.object({
  id: z.number().optional(),
  originUrl: z.string().optional(),
  sn: z.string().optional(),
  comment: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  objectUrl: JsonValueSchema.nullable(),
  alt: z.string().optional(),
}))

export type assetOptionalDefaults = z.infer<typeof assetOptionalDefaultsSchema>

export default assetSchema;
