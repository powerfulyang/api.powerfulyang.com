import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { join } from 'path';
import mkdirp from 'mkdirp';
import COS from 'cos-nodejs-sdk-v5';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFileSync, promises } from 'fs';
import { StaticResource } from '../entity/static.entity';
import { Bucket } from '../entity/bucket.entity';

const { writeFile } = promises;

@Injectable()
export class UploadStaticService {
    constructor(
        @InjectRepository(StaticResource)
        private staticDao: Repository<StaticResource>,
    ) {}

    async persistent(sha1: string) {
        const staticResource = await this.staticDao.findOneOrFail(
            { sha1 },
            { relations: ['bucket'] },
        );
        const originPath = join(
            process.cwd(),
            'upload',
            staticResource.projectName,
            'origin',
        );
        const originBuffer = await readFileSync(
            join(originPath, staticResource.path.origin),
        );
        const resizeBuffer = await sharp(originBuffer)
            .resize(300)
            .toBuffer();
        const webpBuffer = await sharp(resizeBuffer)
            .webp()
            .toBuffer();
        const resizePath = join(
            process.cwd(),
            'upload',
            staticResource.projectName,
            'resize',
        );
        const webpPath = join(
            process.cwd(),
            'upload',
            staticResource.projectName,
            'webp',
        );

        mkdirp(resizePath).then(() => {
            writeFile(
                join(resizePath, staticResource.path.resize),
                resizeBuffer,
            );
        });
        mkdirp(webpPath).then(() => {
            writeFile(
                join(webpPath, staticResource.path.webp),
                webpBuffer,
            );
        });
        const { bucket } = staticResource;
        await this.putCosObject(
            bucket,
            originBuffer,
            staticResource.path.origin,
        );
        await this.putCosObject(
            bucket,
            resizeBuffer,
            staticResource.path.resize,
        );
        await this.putCosObject(
            bucket,
            webpBuffer,
            staticResource.path.webp,
        );
    }

    async putCosObject(bucket: Bucket, buffer: Buffer, path: string) {
        const {
            SecretId,
            SecretKey,
            bucketRegion,
            bucketName,
        } = bucket;
        const cosUtils = new COS({ SecretId, SecretKey });
        return new Promise((resolve) =>
            cosUtils.putObject(
                {
                    Body: buffer,
                    ContentLength: buffer.length,
                    Key: path,
                    Region: bucketRegion,
                    Bucket: bucketName,
                },
                () => {
                    resolve();
                },
            ),
        );
    }
}
