import { z } from 'zod';

/////////////////////////////////////////
// ROLE MENUS MENU SCHEMA
/////////////////////////////////////////

export const role_menus_menuSchema = z.object({
  roleId: z.number(),
  menuId: z.number(),
})

export type role_menus_menu = z.infer<typeof role_menus_menuSchema>

/////////////////////////////////////////
// ROLE MENUS MENU OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const role_menus_menuOptionalDefaultsSchema = role_menus_menuSchema.merge(z.object({
}))

export type role_menus_menuOptionalDefaults = z.infer<typeof role_menus_menuOptionalDefaultsSchema>

export default role_menus_menuSchema;
