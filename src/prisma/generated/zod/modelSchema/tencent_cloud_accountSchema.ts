import { z } from 'zod';

/////////////////////////////////////////
// TENCENT CLOUD ACCOUNT SCHEMA
/////////////////////////////////////////

export const tencent_cloud_accountSchema = z.object({
  id: z.number(),
  name: z.string(),
  SecretId: z.string(),
  SecretKey: z.string(),
  AppId: z.string(),
})

export type tencent_cloud_account = z.infer<typeof tencent_cloud_accountSchema>

/////////////////////////////////////////
// TENCENT CLOUD ACCOUNT OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const tencent_cloud_accountOptionalDefaultsSchema = tencent_cloud_accountSchema.merge(z.object({
  id: z.number().optional(),
}))

export type tencent_cloud_accountOptionalDefaults = z.infer<typeof tencent_cloud_accountOptionalDefaultsSchema>

export default tencent_cloud_accountSchema;
