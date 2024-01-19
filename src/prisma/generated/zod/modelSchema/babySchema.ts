import { z } from 'zod';

/////////////////////////////////////////
// BABY SCHEMA
/////////////////////////////////////////

export const babySchema = z.object({
  id: z.number(),
  name: z.string(),
  bornAt: z.coerce.date(),
  gender: z.number(),
  avatar: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type baby = z.infer<typeof babySchema>

/////////////////////////////////////////
// BABY OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const babyOptionalDefaultsSchema = babySchema.merge(z.object({
  id: z.number().optional(),
  bornAt: z.coerce.date().optional(),
  gender: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type babyOptionalDefaults = z.infer<typeof babyOptionalDefaultsSchema>

export default babySchema;
