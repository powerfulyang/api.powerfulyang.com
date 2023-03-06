import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MenuService } from '@/modules/user/menu/menu.service';
import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Pagination } from '@/common/decorator/pagination/pagination.decorator';
import { QueryMenusDto } from '@/modules/user/dto/query-menus.dto';
import { Menu } from '@/modules/user/entities/menu.entity';

@Controller('menu-manage')
@ApiTags('menu-manage')
@AdminAuthGuard()
export class MenuController {
  constructor(private readonly menuService: MenuService, private readonly logger: LoggerService) {
    this.logger.setContext(MenuController.name);
  }

  @Post('query-menus')
  @ApiOperation({
    summary: '获取所有菜单',
    operationId: 'queryMenus',
  })
  @ApiBody({
    type: QueryMenusDto,
  })
  queryMenus(@Pagination() pagination: QueryMenusDto) {
    return this.menuService.queryMenus(pagination);
  }

  @Get(':id')
  @ApiOperation({
    summary: '根据id获取菜单',
    operationId: 'queryMenuById',
  })
  queryMenuById(@Param('id') id: string) {
    return this.menuService.queryMenuById(id);
  }

  @Post()
  @ApiOperation({
    summary: '创建菜单',
    operationId: 'createMenu',
  })
  createMenu(@Body() menu: Menu) {
    return this.menuService.createMenu(menu);
  }

  @Post(':id')
  @ApiOperation({
    summary: '根据id编辑菜单',
    operationId: 'editMenuById',
  })
  editMenuById(@Param('id') id: string, @Body() menu: Menu) {
    return this.menuService.editMenuById(id, menu);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '根据id删除菜单',
    operationId: 'deleteMenuById',
  })
  deleteMenuById(@Param('id') id: string) {
    return this.menuService.deleteMenuById(id);
  }
}
