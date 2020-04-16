import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bucket } from '../../entity/bucket.entity';
import { Repository } from 'typeorm';
import COS from 'cos-nodejs-sdk-v5';
import { Static } from '../../entity/static.entity';
import { BucketUtils } from '../../utils/BucketUtils';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

@Injectable()
export class StaticService {
  private cosUtils: COS;
  constructor(
    @InjectRepository(Bucket) private bucketDao: Repository<Bucket>,
    @InjectRepository(Static) private staticDao: Repository<Static>,
  ) {
    this.cosUtils = new COS({
      SecretId: process.env.SecretId,
      SecretKey: process.env.SecretKey,
    });
  }

  addBucket(bucket: Bucket) {
    return this.bucketDao.insert(bucket);
  }
  listBucket() {
    return this.bucketDao.find();
  }
  async storeStatic(file, staticEntity: Static) {
    staticEntity.bucket = await this.bucketDao.findOne({ isDefault: true });
    staticEntity.filename = file.originalname;
    staticEntity = BucketUtils.formatFilePath(staticEntity);
    const minFileBuffer = await imagemin.buffer(file.buffer, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
    staticEntity.accessUrl = await new Promise((resolve, reject) => {
      this.cosUtils.putObject(
        {
          Body: file.buffer,
          ContentLength: file.size,
          Key: staticEntity.filePath,
          Region: staticEntity.bucket.bucketRegion,
          Bucket: staticEntity.bucket.bucketName,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            if (data.statusCode === 200) {
              resolve(data.Location);
            }
          }
        },
      );
    });
    staticEntity.minAccessUrl = await new Promise((resolve, reject) => {
      this.cosUtils.putObject(
        {
          Body: minFileBuffer,
          ContentLength: minFileBuffer.length,
          Key: staticEntity.minFilePath,
          Region: staticEntity.bucket.bucketRegion,
          Bucket: staticEntity.bucket.bucketName,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            if (data.statusCode === 200) {
              resolve(data.Location);
            }
          }
        },
      );
    });
    return await this.staticDao.insert(staticEntity);
  }
}
