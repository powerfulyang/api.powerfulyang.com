import { BucketRegion, COSResult } from 'cos-nodejs-sdk-v5';

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
export interface GetObjectUrlData extends COSResult {
    Url: string;
}

export interface PutBucketCorsOptions extends BaseCosOptions {
    CORSRules: Array<{
        ID?: string;
        AllowedOrigin: string[];
        AllowedMethod: string[];
        AllowedHeader: string[];
        ExposeHeader?: string[];
        MaxAgeSeconds?: string;
    }>;
}
export interface PutBucketCorsData extends COSResult {}

export interface PutBucketRefererOptions extends BaseCosOptions {
    RefererConfiguration: {
        Status: 'Enabled' | 'Disabled';
        RefererType: 'Black-List' | 'White-List';
        DomainList: { Domains: string[] };
        EmptyReferConfiguration?: 'Allow' | 'Deny';
    };
}
export interface PutBucketRefererData extends COSResult {}

export interface GetBucketCorsOptions extends BaseCosOptions {}
export interface GetBucketCorsData extends COSResult {
    CORSRules: Array<{
        AllowedOrigins: string[];
        AllowedHeaders: string[];
        AllowedMethods: string[];
        ExposeHeaders: string[];
    }>;
}

export interface GetBucketRefererOptions extends BaseCosOptions {}
export interface GetBucketRefererData extends COSResult {
    RefererConfiguration: {
        Status: 'Enabled' | 'Disabled';
        RefererType: 'Black-List' | 'White-List';
        DomainList: { Domains: string[] };
        EmptyReferConfiguration?: 'Allow' | 'Deny';
    };
}
