import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogsViewerService } from 'api/logs-viewer/logs-viewer.service';

@Controller('logs-viewer')
@ApiTags('logs-viewer')
export class LogsViewerController {
  constructor(private readonly logsViewerService: LogsViewerService) {}

  @Get('containers')
  listContainers() {
    return this.logsViewerService.listContainers();
  }

  @Get(':container')
  listLogs(@Param('container') container: string) {
    return this.logsViewerService.showContainerLogs(container);
  }
}
