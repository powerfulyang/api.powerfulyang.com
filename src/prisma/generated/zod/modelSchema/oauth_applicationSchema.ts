import { z } from 'zod';

/////////////////////////////////////////
// OAUTH APPLICATION SCHEMA
/////////////////////////////////////////

export const oauth_applicationSchema = z.object({
  id: z.number(),
  platformName: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  callbackUrl: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type oauth_application = z.infer<typeof oauth_applicationSchema>

/////////////////////////////////////////
// OAUTH APPLICATION OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const oauth_applicationOptionalDefaultsSchema = oauth_applicationSchema.merge(z.object({
  id: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type oauth_applicationOptionalDefaults = z.infer<typeof oauth_applicationOptionalDefaultsSchema>

export default oauth_applicationSchema;
