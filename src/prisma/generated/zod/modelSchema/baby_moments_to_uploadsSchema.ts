import { z } from 'zod';

/////////////////////////////////////////
// BABY MOMENTS TO UPLOADS SCHEMA
/////////////////////////////////////////

export const baby_moments_to_uploadsSchema = z.object({
  momentId: z.number(),
  uploadId: z.number(),
  order: z.number(),
})

export type baby_moments_to_uploads = z.infer<typeof baby_moments_to_uploadsSchema>

/////////////////////////////////////////
// BABY MOMENTS TO UPLOADS OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const baby_moments_to_uploadsOptionalDefaultsSchema = baby_moments_to_uploadsSchema.merge(z.object({
  order: z.number().optional(),
}))

export type baby_moments_to_uploadsOptionalDefaults = z.infer<typeof baby_moments_to_uploadsOptionalDefaultsSchema>

export default baby_moments_to_uploadsSchema;
