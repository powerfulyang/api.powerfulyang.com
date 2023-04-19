import process from 'node:process';

export const isQA = process.env.APP_ENV === 'qa';
export const isProd = process.env.APP_ENV === 'prod';
export const isTest = process.env.NODE_ENV === 'test';

export const is_TEST_BUCKET_ONLY = isQA || isTest;
export const TEST_BUCKET_ONLY = 'test';
