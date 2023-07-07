import { beforeEach, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ClickUpService } from './click-up.service';

describe('ClickUpService', () => {
  let service: ClickUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClickUpService],
    }).compile();

    service = module.get<ClickUpService>(ClickUpService);
  });

  it('should be defined', async () => {
    const teams = await service.getTeams();
    expect(teams).toBeDefined();
    const lists = await service.getLists();
    expect(lists).toBeDefined();
  });
});
