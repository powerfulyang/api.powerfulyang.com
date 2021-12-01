export const MICROSERVICE_NAME = 'RABBIT_MQ_MICROSERVICE';
export const RMQ_QUEUE = 'COS_UPLOAD';
export const COS_UPLOAD_MSG_PATTERN = 'COS_UPLOAD_MSG_PATTERN';
export const SUCCESS = 'SUCCESS';

export const Authorization = 'authorization';

export const { SERVER_HOST_DOMAIN } = process.env;
export const WILDCARD_HOST_DOMAIN = `*.${SERVER_HOST_DOMAIN}`;

export const CookieOptions = {
  httpOnly: true,
  sameSite: true,
  secure: true,
  domain: SERVER_HOST_DOMAIN,
  maxAge: 24 * 60 * 60 * 1000,
};

export const PRIMARY_ORIGIN = `https://${SERVER_HOST_DOMAIN}`;
export const WILDCARD_ORIGIN = `https://${WILDCARD_HOST_DOMAIN}`;
