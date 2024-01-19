import { z } from 'zod';

/////////////////////////////////////////
// OAUTH OPENID SCHEMA
/////////////////////////////////////////

export const oauth_openidSchema = z.object({
  id: z.number(),
  openid: z.string(),
  applicationId: z.number(),
  userId: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type oauth_openid = z.infer<typeof oauth_openidSchema>

/////////////////////////////////////////
// OAUTH OPENID OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const oauth_openidOptionalDefaultsSchema = oauth_openidSchema.merge(z.object({
  id: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type oauth_openidOptionalDefaults = z.infer<typeof oauth_openidOptionalDefaultsSchema>

export default oauth_openidSchema;
