import { BucketRegion } from '../enum/Bucket';
import { Bucket as BucketEntity } from '../entity/bucket.entity';
import { Static } from '../entity/static.entity';
import dayjs from 'dayjs';

export class BucketUtils {
  static getAccess(bucketName: string, region: BucketRegion) {
    return `${bucketName}.${BucketRegion[region]}`;
  }

  static getAccessUrl(bucket: BucketEntity) {
    return BucketUtils.getAccess(bucket.bucketName, bucket.bucketRegion);
  }

  static formatFilePath(staticEntity: Static) {
    const currentDay = dayjs().format('YYYY-MM-DD');
    staticEntity = {
      projectName: staticEntity.projectName || 'default',
      folder: staticEntity.folder || 'default',
      comment: staticEntity.comment || '',
      ...staticEntity,
    };
    staticEntity.filePath = `${staticEntity.projectName}/${staticEntity.folder}/${currentDay}/${staticEntity.filename}`;
    staticEntity.minFilePath = `${staticEntity.projectName}/${
      staticEntity.folder
    }/${currentDay + 'min'}/${staticEntity.filename}`;
    return staticEntity;
  }
}
