import { beforeEach, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ClickUpResolver } from './click-up.resolver';
import { ClickUpService } from './click-up.service';

describe('ClickUpResolver', () => {
  let resolver: ClickUpResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClickUpResolver, ClickUpService],
    }).compile();

    resolver = module.get<ClickUpResolver>(ClickUpResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
