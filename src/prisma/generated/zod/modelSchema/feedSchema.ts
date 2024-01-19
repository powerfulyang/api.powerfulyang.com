import { z } from 'zod';

/////////////////////////////////////////
// FEED SCHEMA
/////////////////////////////////////////

export const feedSchema = z.object({
  id: z.number(),
  content: z.string(),
  public: z.boolean(),
  createById: z.number(),
  updateById: z.number().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type feed = z.infer<typeof feedSchema>

/////////////////////////////////////////
// FEED OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const feedOptionalDefaultsSchema = feedSchema.merge(z.object({
  id: z.number().optional(),
  public: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type feedOptionalDefaults = z.infer<typeof feedOptionalDefaultsSchema>

export default feedSchema;
