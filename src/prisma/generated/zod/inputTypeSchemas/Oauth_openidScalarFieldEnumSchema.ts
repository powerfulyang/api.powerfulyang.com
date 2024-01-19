import { z } from 'zod';

export const Oauth_openidScalarFieldEnumSchema = z.enum(['id','openid','applicationId','userId','createdAt','updatedAt']);

export default Oauth_openidScalarFieldEnumSchema;
