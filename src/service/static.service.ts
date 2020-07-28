import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bucket } from '../entity/bucket.entity';
import { Repository } from 'typeorm';
import mkdirp from 'mkdirp';
import HashUtils from '../utils/HashUtils';
import { StaticResource } from '../entity/static.entity';
import { UploadFile } from '../type/UploadFile';
import { extname, join } from 'path';
import { promises } from 'fs';
import COS from 'cos-nodejs-sdk-v5';
import { BucketRegionUrl } from '../enum/Bucket';
import { ClientProxy } from '@nestjs/microservices';
import { COS_UPLOAD_MSG_PATTERN, MICROSERVICE_NAME } from '../constants/constants';
import { phash } from '@powerfulyang/utils/build/main/lib/image';

const { writeFile } = promises;

@Injectable()
export class StaticService {
    constructor(
        @InjectRepository(Bucket) private bucketDao: Repository<Bucket>,
        @InjectRepository(StaticResource) private staticDao: Repository<StaticResource>,
        @Inject(MICROSERVICE_NAME) private readonly microserviceClient: ClientProxy,
    ) {}

    addBucket(bucket: Bucket) {
        bucket.bucketRegionUrl = `//${bucket.bucketName}.${BucketRegionUrl[bucket.bucketRegion]}`;
        return this.bucketDao.insert(bucket);
    }

    listBucket() {
        return this.bucketDao.findAndCount();
    }

    sendMsg(msg: string) {
        return this.microserviceClient.emit(COS_UPLOAD_MSG_PATTERN, msg);
    }

    async storeStatic(file: UploadFile, staticResource: StaticResource, bucket: Bucket) {
        if (!staticResource) {
            staticResource = new StaticResource();
            staticResource.projectName = 'gallery';
        }
        if (!bucket) {
            bucket = await this.bucketDao.findOneOrFail();
        }
        staticResource.pHash = await phash(file.buffer);
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
        // 只把原图存起来 其他的交给异步MQ
        const originPath = join(process.cwd(), 'upload', staticResource.projectName, 'origin');
        mkdirp(originPath).then(() => {
            writeFile(join(originPath, staticResource.path.origin), file.buffer).then(() =>
                this.sendMsg(staticResource.sha1),
            );
        });
    }

    listStatic(projectName?: string, page?: number) {
        const query = {} as { projectName?: string; skip: number; take: number };
        if (projectName) {
            query.projectName = projectName;
        }
        if (page) {
            query.skip = (page - 1) * 20;
            query.take = 20;
        }
        return this.staticDao.findAndCount({
            ...query,
            relations: ['bucket'],
            order: {
                staticId: 'DESC',
            },
        });
    }

    async remove(id: number) {
        const staticResource = await this.staticDao.findOneOrFail({
            relations: ['bucket'],
            where: { staticId: id },
        });
        const { SecretId, SecretKey, bucketName, bucketRegion } = staticResource?.bucket;
        const cosUtils = new COS({
            SecretId,
            SecretKey,
        });
        const paths = staticResource.path;
        cosUtils.deleteMultipleObject({
            Region: bucketRegion,
            Bucket: bucketName,
            Objects: Object.values(paths).map((Key) => ({
                Key,
            })),
        });
        return this.staticDao.delete(id);
    }

    getOriginPath(staticResource: StaticResource) {
        return join(
            process.cwd(),
            'upload',
            staticResource.projectName,
            'origin',
            staticResource.path.origin,
        );
    }

    getStaticDao() {
        return this.staticDao;
    }
}
