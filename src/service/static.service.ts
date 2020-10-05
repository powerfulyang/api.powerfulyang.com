import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import mkdirp from 'mkdirp';
import { extname, join } from 'path';
import { promises } from 'fs';
import COS from 'cos-nodejs-sdk-v5';
import { ClientProxy } from '@nestjs/microservices';
import { pHash } from '@powerfulyang/node-utils';
import { StaticResource } from '@/entity/asset.entity';
import { UploadFile } from '@/type/UploadFile';
import { BucketRegionUrl } from '@/enum/Bucket';
import {
    COS_UPLOAD_MSG_PATTERN,
    MICROSERVICE_NAME,
} from '@/constants/constants';
import { Bucket } from '@/entity/bucket.entity';
import HashUtils from '../utils/HashUtils';

const { writeFile } = promises;

@Injectable()
export class StaticService {
    constructor(
        @InjectRepository(Bucket)
        private bucketDao: Repository<Bucket>,
        @InjectRepository(StaticResource)
        private staticDao: Repository<StaticResource>,
        @Inject(MICROSERVICE_NAME)
        private readonly microserviceClient: ClientProxy,
    ) {}

    addBucket(draft: Bucket) {
        draft.bucketRegionUrl = `//${draft.bucketName}.${
            BucketRegionUrl[draft.bucketRegion]
        }`;
        return this.bucketDao.insert(draft);
    }

    listBucket() {
        return this.bucketDao.findAndCount();
    }

    sendMsg(msg: string) {
        return this.microserviceClient.emit(
            COS_UPLOAD_MSG_PATTERN,
            msg,
        );
    }

    async storeStatic(
        file: UploadFile,
        staticResource: StaticResource = new StaticResource(),
        bucket: Bucket,
    ) {
        const toSave = staticResource;
        let toSaveBucket = bucket;
        if (!staticResource) {
            toSave.projectName = 'gallery';
        }
        if (!bucket) {
            toSaveBucket = await this.bucketDao.findOneOrFail();
        }
        toSave.pHash = await pHash(file.buffer);
        toSave.filename = file.originalname;
        toSave.sha1 = HashUtils.sha1Hex(file.buffer);
        toSave.bucket = toSaveBucket;
        const ext = extname(file.originalname);
        toSave.path = {
            webp: `${staticResource.sha1}.webp`,
            resize: `${staticResource.sha1}.resize${ext}`,
            origin: `${staticResource.sha1}${ext}`,
        };
        await this.staticDao.insert(toSave);
        // 只把原图存起来 其他的交给异步MQ
        const originPath = join(
            process.cwd(),
            'upload',
            staticResource.projectName,
            'origin',
        );
        mkdirp(originPath).then(() => {
            writeFile(
                join(originPath, staticResource.path.origin),
                file.buffer,
            ).then(() => this.sendMsg(staticResource.sha1));
        });
    }

    listStatic(projectName?: string, page?: number) {
        const query = {} as {
            projectName?: string;
            skip: number;
            take: number;
        };
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
        const {
            SecretId,
            SecretKey,
            bucketName,
            bucketRegion,
        } = staticResource?.bucket;
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
