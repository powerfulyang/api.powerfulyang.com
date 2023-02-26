import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from '@/modules/user/role/role.service';
import { LoggerService } from '@/common/logger/logger.service';
import { Pagination } from '@/common/decorator/pagination/pagination.decorator';
import { QueryRolesDto } from '@/modules/user/dto/query-roles.dto';
import { pick } from 'ramda';
import { CreateRoleDto } from '@/modules/user/dto/create-role.dto';

@Controller('role-manage')
@AdminAuthGuard()
@ApiTags('role-manage')
export class RoleController {
  constructor(private readonly roleService: RoleService, private readonly logger: LoggerService) {
    this.logger.setContext(RoleController.name);
  }

  @Post('query-roles')
  @ApiOperation({
    summary: '查询角色列表',
    operationId: 'queryRoles',
  })
  @ApiBody({
    type: QueryRolesDto,
  })
  async queryRoles(@Pagination() pagination: QueryRolesDto) {
    this.logger.debug(`queryRoles: ${JSON.stringify(pagination)}`);
    return this.roleService.queryRoles(pagination);
  }

  @Get(':id')
  @ApiOperation({
    summary: '查询角色详情',
    operationId: 'queryRoleById',
  })
  async queryRoleById(@Param('id') id: string) {
    return this.roleService.queryRoleById(id);
  }

  @Post()
  @ApiOperation({
    summary: '创建角色',
    operationId: 'createRole',
  })
  createRole(@Body() role: CreateRoleDto) {
    return this.roleService.createRole(role);
  }

  @Post(':id')
  @ApiOperation({
    summary: '更新角色',
    operationId: 'updateRoleById',
  })
  async updateRoleById(@Param('id') id: string, @Body() role: CreateRoleDto) {
    const updated = pick(['name'], role);
    return this.roleService.updateRoleById(id, updated);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '删除角色',
    operationId: 'deleteRoleById',
  })
  async deleteRoleById(@Param('id') id: string) {
    return this.roleService.deleteRoleById(id);
  }
}
