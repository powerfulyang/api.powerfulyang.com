import { Controller, Get } from '@nestjs/common';
import { MenuService } from '@/modules/user/menu/menu.service';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard';
import { UserService } from '@/modules/user/user.service';
import { LoggerService } from '@/common/logger/logger.service';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('menu')
@ApiTags('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly userService: UserService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(MenuController.name);
  }

  @Get()
  @AdminAuthGuard()
  @ApiOperation({
    summary: '获取所有菜单',
    operationId: 'queryAllMenus',
  })
  menus() {
    return this.menuService.menus();
  }

  @Get('current')
  @JwtAuthGuard()
  @ApiOperation({
    summary: '获取当前用户的菜单',
    operationId: 'queryCurrentUserMenus',
  })
  currentUserMenus(@UserFromAuth() user: User) {
    return this.userService.queryMenusByUserId(user.id);
  }
}
