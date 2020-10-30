import { BucketRegion } from 'cos-nodejs-sdk-v5';

export interface BaseCosOptions {
    Bucket: string;
    Region: BucketRegion;
}
export interface GetObjectUrlOptions extends BaseCosOptions {
    Key: string;
    Sign?: boolean;
    Method?: string;
    Query?: object;
    Headers?: object;
    Expires?: number;
}
export type GetObjectUrlData = {
    Url: string;
};
