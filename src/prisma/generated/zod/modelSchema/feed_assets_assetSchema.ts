import { z } from 'zod';

/////////////////////////////////////////
// FEED ASSETS ASSET SCHEMA
/////////////////////////////////////////

export const feed_assets_assetSchema = z.object({
  feedId: z.number(),
  assetId: z.number(),
})

export type feed_assets_asset = z.infer<typeof feed_assets_assetSchema>

/////////////////////////////////////////
// FEED ASSETS ASSET OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const feed_assets_assetOptionalDefaultsSchema = feed_assets_assetSchema.merge(z.object({
}))

export type feed_assets_assetOptionalDefaults = z.infer<typeof feed_assets_assetOptionalDefaultsSchema>

export default feed_assets_assetSchema;
