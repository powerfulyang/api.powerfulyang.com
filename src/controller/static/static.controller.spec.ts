import { Test, TestingModule } from '@nestjs/testing';
import { StaticController } from './static.controller';
import { StaticService } from '../../service/static/static.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bucket } from '../../entity/bucket.entity';
import { Static } from '../../entity/static.entity';
import config from '../../config';

describe('Static Controller', () => {
  let controller: StaticController;
  let staticService: StaticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([Bucket, Static]),
      ],
      controllers: [StaticController],
      providers: [StaticService],
    }).compile();

    controller = module.get<StaticController>(StaticController);
    staticService = module.get<StaticService>(StaticService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should not exist id = -1 entity', async function () {
    expect(await staticService.getStaticDao().findOne({ id: -1 })).toBe(
      undefined,
    );
  });

  it('should bucket define', async function () {
    const bucket = await staticService
      .getBucketDao()
      .findOne({ isDefault: true });
    expect(bucket.isDefault).toBe(true);
  });

  it('relation query', async () => {
    const staticEntity = await staticService
      .getStaticDao()
      .findOne({ relations: ['bucket'] });
    expect(staticEntity.bucket.bucketId).toBe(1);
    expect(staticEntity.bucketId).toBe(1);
  });

  it('insert static', async () => {
    const staticEntity = await staticService.getStaticDao().findOne();
    expect(staticEntity.bucket).toBe(undefined);
    expect(staticEntity.bucketId).toBe(1);
    await staticService.getStaticDao().findOneOrFail({ where: { id: -1 } });
    // const fail = await staticService.getStaticDao().findOneOrFail({ id: 3 });
    // const fail = await staticService.getStaticDao().findOneOrFail(3);
  });
});
