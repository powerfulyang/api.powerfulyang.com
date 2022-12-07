import { Controller, Get } from '@nestjs/common';
import { MenuService } from '@/modules/user/menu/menu.service';
import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('menu')
@ApiTags('menu')
@AdminAuthGuard()
export class MenuController {
  constructor(private readonly menuService: MenuService, private readonly logger: LoggerService) {
    this.logger.setContext(MenuController.name);
  }

  @Get()
  @ApiOperation({
    summary: '获取所有菜单',
    operationId: 'queryAllMenus',
  })
  menus() {
    return this.menuService.menus();
  }
}
