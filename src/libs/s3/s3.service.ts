import { LoggerService } from '@/common/logger/logger.service';
import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import process from 'node:process';

@Injectable()
export class S3Service extends S3Client {
  constructor(private readonly logger: LoggerService) {
    // private readonly CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
    //
    //   private readonly R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
    //
    //   private readonly R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
    const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
    const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    super({
      region: 'us-east-1',
      endpoint: `https://${cloudflareAccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey,
      },
    });
    this.logger.setContext(S3Service.name);
  }
}
