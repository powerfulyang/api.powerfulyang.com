import { z } from 'zod';

/////////////////////////////////////////
// BABY MOMENT SCHEMA
/////////////////////////////////////////

export const baby_momentSchema = z.object({
  id: z.number(),
  type: z.string(),
  content: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type baby_moment = z.infer<typeof baby_momentSchema>

/////////////////////////////////////////
// BABY MOMENT OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const baby_momentOptionalDefaultsSchema = baby_momentSchema.merge(z.object({
  id: z.number().optional(),
  type: z.string().optional(),
  content: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type baby_momentOptionalDefaults = z.infer<typeof baby_momentOptionalDefaultsSchema>

export default baby_momentSchema;
