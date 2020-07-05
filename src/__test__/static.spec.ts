import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { StaticResource } from '../entity/static.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bucket } from '../entity/bucket.entity';
import COS from 'cos-nodejs-sdk-v5';

describe('static module test', () => {
    let staticDao: Repository<StaticResource>;
    let bucketDao: Repository<Bucket>;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        staticDao = module.get<Repository<StaticResource>>(getRepositoryToken(StaticResource));
        bucketDao = module.get<Repository<Bucket>>(getRepositoryToken(Bucket));
    });

    it('save , duplicate uniq error , delete', async function () {
        const testStatic = {
            projectName: '',
            filename: '',
            sha1: 'test-sha1',
            path: {},
            bucket: new Bucket(),
        };
        expect((await staticDao.insert(testStatic)).identifiers.length).toBe(1);
        await expect(staticDao.insert(testStatic)).rejects.toThrowError();
        expect((await staticDao.delete({ sha1: testStatic.sha1 })).affected).toBe(1);
    });

    it('cos delete object', async function () {
        const bucket = await bucketDao.findOneOrFail();
        const { SecretId, SecretKey, bucketName, bucketRegion } = bucket;
        const cosUtils = new COS({
            SecretId,
            SecretKey,
        });
        const staticResource = await staticDao.findOneOrFail();

        const res = (await new Promise((resolve) => {
            cosUtils.deleteObject(
                {
                    Key: '不存在的key',
                    Region: bucketRegion,
                    Bucket: bucketName,
                },
                (_err: any, data: any) => {
                    console.log(data);
                    resolve(data);
                },
            );
        })) as any;
        expect(res.statusCode).toBe(204);
        const res2 = (await new Promise((resolve) => {
            cosUtils.deleteObject(
                {
                    Key: staticResource.path.resize,
                    Region: bucketRegion,
                    Bucket: bucketName,
                },
                (_err: any, data: any) => {
                    console.log(data);
                    resolve(data);
                },
            );
        })) as any;
        expect(res2.statusCode).toBe(204);
        await staticDao.delete(staticResource.staticId);
    });

    it('cos delete multiple object', async function () {
        const bucket = await bucketDao.findOneOrFail();
        const { SecretId, SecretKey, bucketName, bucketRegion } = bucket;
        const cosUtils = new COS({
            SecretId,
            SecretKey,
        });
        const staticResource = await staticDao.findOneOrFail();
        const paths = staticResource.path as any;
        cosUtils.deleteMultipleObject({
            Bucket: bucketName,
            Region: bucketRegion,
            Objects: [
                Object.keys(paths).map((item) => ({
                    Key: paths[item],
                })),
            ],
        });
        await staticDao.delete(staticResource.staticId);
    });
});
