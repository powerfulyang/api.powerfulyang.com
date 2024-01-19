import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'

/////////////////////////////////////////
// POST SCHEMA
/////////////////////////////////////////

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  tags: JsonValueSchema.nullable(),
  public: z.boolean(),
  publishYear: z.number(),
  createById: z.number(),
  posterId: z.number().nullable(),
  updateById: z.number().nullable(),
  summary: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type post = z.infer<typeof postSchema>

/////////////////////////////////////////
// POST OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const postOptionalDefaultsSchema = postSchema.merge(z.object({
  id: z.number().optional(),
  public: z.boolean().optional(),
  summary: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type postOptionalDefaults = z.infer<typeof postOptionalDefaultsSchema>

export default postSchema;
