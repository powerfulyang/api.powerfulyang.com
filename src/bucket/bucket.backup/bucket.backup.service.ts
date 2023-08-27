import { getBucketAssetPath } from '@/constants/asset_constants';
import { TencentCloudAccountService } from '@/tencent-cloud-account/tencent-cloud-account.service';
import { Injectable } from '@nestjs/common';
import { existsSync, writeFileSync, ensureFileSync } from 'fs-extra';

@Injectable()
export class BucketBackupService {
  constructor(private readonly tencentCloudAccountService: TencentCloudAccountService) {}

  async backup(accountId: string | number) {
    const cosUtil = await this.tencentCloudAccountService.getCosUtilByAccountId(Number(accountId));
    const result = await cosUtil.getService();
    const buckets = result.Buckets;
    const actionResult = [];
    for (const bucket of buckets) {
      const objects = await cosUtil.getBucket({
        Bucket: bucket.Name,
        Region: bucket.Location,
      });
      for (const content of objects.Contents) {
        const path = getBucketAssetPath(bucket.Name, content.Key);
        // check if file exists
        // not exists, download
        if (!existsSync(path)) {
          const object = await cosUtil.getObject({
            Bucket: bucket.Name,
            Region: bucket.Location,
            Key: content.Key,
          });
          ensureFileSync(path);
          writeFileSync(path, object.Body);
          actionResult.push({
            bucket: bucket.Name,
            key: content.Key,
            status: 'downloaded',
          });
        }
      }
    }
    return actionResult;
  }
}
