import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bucket } from '../entity/bucket.entity';
import COS from 'cos-nodejs-sdk-v5';

describe('cos libs test', () => {
    let bucketDao: Repository<Bucket>;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        bucketDao = module.get<Repository<Bucket>>(getRepositoryToken(Bucket));
    });

    it('cos delete multiple object', async function () {
        const bucket = await bucketDao.findOneOrFail();
        const { SecretId, SecretKey, bucketName, bucketRegion } = bucket;
        const cosUtils = new COS({
            SecretId,
            SecretKey,
        });
        const paths = {
            a: '152b21261997cb44981c9550df3de9837082d0be.jpg',
            b: '152b21261997cb44981c9550df3de9837082d0be.resize.jpg',
            c: '152b21261997cb44981c9550df3de9837082d0be.webp',
        };
        cosUtils.deleteMultipleObject({
            Bucket: bucketName,
            Region: bucketRegion,
            Objects: Object.values(paths).map((Key) => ({
                Key,
            })),
        });
    });
});
