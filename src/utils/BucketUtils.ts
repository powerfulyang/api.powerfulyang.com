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
    const uploadDate = dayjs().format('YYYY-MM-DD');
    staticEntity = {
      projectName: staticEntity.projectName || 'default',
      folder: staticEntity.folder || 'default',
      comment: staticEntity.comment || '',
      ...staticEntity,
    };
    staticEntity.dirPath = `${staticEntity.projectName}/${staticEntity.folder}/${uploadDate}`;
    staticEntity.filePath = `${staticEntity.dirPath}/${staticEntity.filename}`;
    staticEntity.minDirPath = `${staticEntity.projectName}/${
      staticEntity.folder
    }/${uploadDate + '-min'}`;
    staticEntity.minFilePath = `${staticEntity.minDirPath}/${staticEntity.filename}`;
    staticEntity.webpDirPath = `${staticEntity.projectName}/${
      staticEntity.folder
    }/${uploadDate + '-webp'}`;
    staticEntity.webpFilePath = `${staticEntity.webpDirPath}/${staticEntity.filename}.webp`;
    staticEntity.uploadDate = uploadDate;
    return staticEntity;
  }
}
