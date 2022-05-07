export const isQA = process.env.APP_ENV === 'qa';
export const isProd = process.env.APP_ENV === 'prod';
export const isTest = process.env.NODE_ENV === 'test';

export const QA_BUCKET_ONLY = 'test';
