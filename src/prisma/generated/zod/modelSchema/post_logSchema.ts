import { z } from 'zod';

/////////////////////////////////////////
// POST LOG SCHEMA
/////////////////////////////////////////

export const post_logSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  postId: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type post_log = z.infer<typeof post_logSchema>

/////////////////////////////////////////
// POST LOG OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const post_logOptionalDefaultsSchema = post_logSchema.merge(z.object({
  id: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type post_logOptionalDefaults = z.infer<typeof post_logOptionalDefaultsSchema>

export default post_logSchema;
