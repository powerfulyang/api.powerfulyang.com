import { beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@/service/prisma/prisma.service';
import { PrismaModule } from '@/service/prisma/prisma.module';

describe('prisma service', () => {
  let service: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    service = await module.resolve<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('query post', async () => {
    const post = await service.post.findUniqueOrThrow({
      where: {
        id: 101,
      },
    });
    expect(post).toBeDefined();
    const asset = await service.asset.findUniqueOrThrow({
      where: {
        id: 15,
      },
    });
    expect(asset).toBeDefined();
  });
});
