import { Test, TestingModule } from '@nestjs/testing';
import { StaticService } from './static.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bucket } from '../../entity/bucket.entity';
import { Static } from '../../entity/static.entity';
import config from '../../config';

describe('StaticService', () => {
  let service: StaticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([Bucket, Static]),
      ],
      providers: [StaticService],
    }).compile();

    service = module.get<StaticService>(StaticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
