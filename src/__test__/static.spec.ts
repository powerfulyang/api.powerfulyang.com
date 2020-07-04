import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { StaticResource } from '../entity/static.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bucket } from '../entity/bucket.entity';

describe('static module test', () => {
    let staticDao: Repository<StaticResource>;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        staticDao = module.get<Repository<StaticResource>>(getRepositoryToken(StaticResource));
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
});
