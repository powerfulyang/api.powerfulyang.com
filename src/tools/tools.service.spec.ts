import { TEST_ASSETS_IMAGES } from '@/constants/test_constants';
import { ToolsModule } from '@/tools/tools.module';
import { ToolsService } from '@/tools/tools.service';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { concat, delay, firstValueFrom, merge, of, takeUntil, timer, toArray } from 'rxjs';

describe('ToolsService', () => {
  let service: ToolsService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ToolsModule],
    }).compile();

    await module.init();

    service = module.get<ToolsService>(ToolsService);
  }, 1000 * 100);

  afterAll(async () => {
    await module.close();
  });

  it('ocr', async () => {
    const image = join(TEST_ASSETS_IMAGES, 'eng.png');
    const imageBuffer = readFileSync(image);
    const res = await service.ocr(imageBuffer);
    expect(res).toContain('hello');
  });

  it('rxjs', async () => {
    // 创建异步发射的 Observable
    const data$ = of({ type: 'data', data: 'data1' }).pipe(delay(100));
    const error$ = of({ type: 'error', data: 'error1' }).pipe(delay(200));
    const close$ = timer(300);

    const _data$ = of({ type: 'data', data: 'data2' }).pipe(delay(400));
    const _error$ = of({ type: 'error', data: 'error2' }).pipe(delay(500));
    const _close$ = timer(600);

    // 合并和连接 Observables
    const result$ = concat(
      merge(data$, error$).pipe(takeUntil(close$)),
      merge(_data$, _error$).pipe(takeUntil(_close$)),
    );
    const result = await firstValueFrom(result$.pipe(toArray()));
    expect(result).toEqual([
      {
        data: 'data1',
        type: 'data',
      },
      {
        data: 'error1',
        type: 'error',
      },
      {
        data: 'data2',
        type: 'data',
      },
      {
        data: 'error2',
        type: 'error',
      },
    ]);

    // swap order
    const reverse_result$ = concat(
      merge(_data$, _error$).pipe(takeUntil(_close$)),
      merge(data$, error$).pipe(takeUntil(close$)),
    );
    const reverse_result = await firstValueFrom(reverse_result$.pipe(toArray()));
    expect(reverse_result).toEqual([
      {
        data: 'data2',
        type: 'data',
      },
      {
        data: 'error2',
        type: 'error',
      },
      {
        data: 'data1',
        type: 'data',
      },
      {
        data: 'error1',
        type: 'error',
      },
    ]);
  });
});
