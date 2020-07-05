import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bucket } from '../entity/bucket.entity';
import { Repository } from 'typeorm';
import mkdirp from 'mkdirp';
import sharp from 'sharp';
import HashUtils from '../utils/HashUtils';
import { StaticResource } from '../entity/static.entity';
import { UploadFile } from '../type/UploadFile';
import { join, extname } from 'path';
import { writeFile } from 'fs';
import COS from 'cos-nodejs-sdk-v5';

@Injectable()
export class StaticService {
    constructor(
        @InjectRepository(Bucket) private bucketDao: Repository<Bucket>,
        @InjectRepository(StaticResource) private staticDao: Repository<StaticResource>,
    ) {}

    addBucket(bucket: Bucket) {
        return this.bucketDao.insert(bucket);
    }

    listBucket() {
        return this.bucketDao.findAndCount();
    }

    async storeStatic(file: UploadFile, staticResource: StaticResource, bucket: Bucket) {
        if (!staticResource) {
            staticResource = new StaticResource();
            staticResource.projectName = 'gallery';
        }
        if (!bucket) {
            bucket = await this.bucketDao.findOneOrFail();
        }
        staticResource.filename = file.originalname;
        staticResource.sha1 = HashUtils.sha1Hex(file.buffer);
        staticResource.bucket = bucket;
        const ext = extname(file.originalname);
        staticResource.path = {
            webp: `${staticResource.sha1}.webp`,
            resize: `${staticResource.sha1}.resize${ext}`,
            origin: `${staticResource.sha1}${ext}`,
        };
        await this.staticDao.insert(staticResource);
        const resizeBuffer = await sharp(file.buffer).resize(300).toBuffer();
        const webpBuffer = await sharp(resizeBuffer).webp().toBuffer();
        const resizePath = join(process.cwd(), 'upload', staticResource.projectName, 'resize');
        const webpPath = join(process.cwd(), 'upload', staticResource.projectName, 'webp');
        const originPath = join(process.cwd(), 'upload', staticResource.projectName, 'origin');
        mkdirp(resizePath).then(() => {
            // write file
            writeFile(join(resizePath, staticResource.path.resize), resizeBuffer, () => {
                console.log('save resize');
            });
        });
        mkdirp(webpPath).then(() => {
            writeFile(join(webpPath, staticResource.path.webp), webpBuffer, () => {
                console.log('save webp');
            });
        });
        mkdirp(originPath).then(() => {
            writeFile(join(originPath, staticResource.path.origin), file.buffer, () => {
                console.log('save origin');
            });
        });
        const { SecretId, SecretKey, bucketRegion, bucketName } = bucket;
        const cosUtils = new COS({ SecretId, SecretKey });

        new Promise(() => {
            cosUtils.putObject({
                Body: file.buffer,
                ContentLength: file.size,
                Key: staticResource.path.origin,
                Region: bucketRegion,
                Bucket: bucketName,
            });
            cosUtils.putObject({
                Body: resizeBuffer,
                ContentLength: resizeBuffer.length,
                Key: staticResource.path.resize,
                Region: bucketRegion,
                Bucket: bucketName,
            });
            cosUtils.putObject({
                Body: webpBuffer,
                ContentLength: webpBuffer.length,
                Key: staticResource.path.webp,
                Region: bucketRegion,
                Bucket: bucketName,
            });
        });
    }
}
