import { z } from 'zod';

/////////////////////////////////////////
// MENU CLOSURE SCHEMA
/////////////////////////////////////////

export const menu_closureSchema = z.object({
  id_ancestor: z.number(),
  id_descendant: z.number(),
})

export type menu_closure = z.infer<typeof menu_closureSchema>

/////////////////////////////////////////
// MENU CLOSURE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const menu_closureOptionalDefaultsSchema = menu_closureSchema.merge(z.object({
}))

export type menu_closureOptionalDefaults = z.infer<typeof menu_closureOptionalDefaultsSchema>

export default menu_closureSchema;
