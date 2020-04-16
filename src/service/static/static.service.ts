import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bucket } from '../../entity/bucket.entity';
import { Repository } from 'typeorm';
import COS from 'cos-nodejs-sdk-v5';
import { Static } from '../../entity/static.entity';
import { BucketUtils } from '../../utils/BucketUtils';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import * as fs from 'fs';
import * as path from 'path';
import mkdirp from 'mkdirp';
import sharp from 'sharp';
import groupBy from '../../utils/groupBy';
import HashUtils from '../../utils/HashUtils';

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

  getStaticDao() {
    return this.staticDao;
  }

  getBucketDao() {
    return this.bucketDao;
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
    const isExist = await this.staticDao.findOne({
      where: { filePath: staticEntity.filePath },
    });
    if (isExist) {
      throw new BadRequestException();
    }
    staticEntity.sha1 = HashUtils.sha1Hex(file.buffer);
    const isExistSha1 = await this.staticDao.findOne({
      sha1: staticEntity.sha1,
    });
    if (isExistSha1) {
      throw new BadRequestException();
    }
    let minFileBuffer = await imagemin.buffer(file.buffer, {
      plugins: [
        imageminMozjpeg({
          quality: 50,
        }),
        imageminPngquant({
          quality: [0.5, 0.6],
        }),
      ],
    });
    minFileBuffer = await sharp(minFileBuffer).resize(300).toBuffer();
    const webpBuffer = await sharp(minFileBuffer).webp().toBuffer();
    await mkdirp(path.join(process.cwd(), 'upload', staticEntity.dirPath));
    fs.writeFileSync(
      path.join(
        process.cwd(),
        'upload',
        staticEntity.dirPath,
        file.originalname,
      ),
      file.buffer,
    );
    await mkdirp(path.join(process.cwd(), 'upload', staticEntity.minDirPath));
    fs.writeFileSync(
      path.join(
        process.cwd(),
        'upload',
        staticEntity.minDirPath,
        file.originalname,
      ),
      minFileBuffer,
    );
    await mkdirp(path.join(process.cwd(), 'upload', staticEntity.webpDirPath));
    fs.writeFileSync(
      path.join(
        process.cwd(),
        'upload',
        staticEntity.webpDirPath,
        `${file.originalname}.webp`,
      ),
      webpBuffer,
    );
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
              resolve('//' + data.Location);
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
              resolve('//' + data.Location);
            }
          }
        },
      );
    });
    staticEntity.webpAccessUrl = await new Promise((resolve, reject) => {
      this.cosUtils.putObject(
        {
          Body: webpBuffer,
          ContentLength: webpBuffer.length,
          Key: staticEntity.webpFilePath,
          Region: staticEntity.bucket.bucketRegion,
          Bucket: staticEntity.bucket.bucketName,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            if (data.statusCode === 200) {
              resolve('//' + data.Location);
            }
          }
        },
      );
    });
    return await this.staticDao.insert(staticEntity);
  }
  async list() {
    const list = await this.staticDao.find({
      order: { uploadDate: 'DESC' },
    });
    return groupBy(list, 'uploadDate');
  }

  async sha1AllUnHashFile() {
    const unShaList = await this.staticDao.find({ sha1: '' });
    for (const staticInfo of unShaList) {
      const file = fs.readFileSync(
        path.join(process.cwd(), 'upload', staticInfo.filePath),
      );
      staticInfo.sha1 = HashUtils.sha1Hex(file);
      await this.staticDao.save(staticInfo);
    }
    return 'ok';
  }
}
