import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { LogsViewerModule } from 'api/logs-viewer/logs-viewer.module';
import { LogsViewerService } from './logs-viewer.service';

describe('LogsViewerService', () => {
  let service: LogsViewerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LogsViewerModule],
    }).compile();

    service = module.get<LogsViewerService>(LogsViewerService);
  });

  it('listContainers', async () => {
    const result = await service.listContainers();
    expect(result).toBeDefined();
  });

  it('showContainerLogs', async () => {
    const containers = await service.listContainers();
    const toShow = containers.find((c) => c?.startsWith('applications_api.powerfulyang.com'));
    if (toShow) {
      const result = await service.showContainerLogs(toShow);
      expect(result).toBeDefined();
    }
  });
});
