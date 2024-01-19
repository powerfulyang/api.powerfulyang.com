import { z } from 'zod';

export const Oauth_applicationScalarFieldEnumSchema = z.enum(['id','platformName','clientId','clientSecret','callbackUrl','createdAt','updatedAt']);

export default Oauth_applicationScalarFieldEnumSchema;
