import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@/common/logger/logger.service';
import { Pagination } from '@/common/decorator/pagination/pagination.decorator';
import { QueryUsersDto } from '@/modules/user/dto/query-users.dto';
import { EditUserDto } from '@/modules/user/dto/edit-user.dto';
import { UserService } from './user.service';

@AdminAuthGuard()
@Controller('user-manage')
@ApiTags('user-manage')
export class UserManageController {
  constructor(private readonly logger: LoggerService, private readonly userService: UserService) {
    this.logger.setContext(UserManageController.name);
  }

  @Post('query-users')
  @ApiOperation({
    summary: '分页查询用户列表',
    operationId: 'queryUsers',
  })
  queryUsers(@Pagination() pagination: QueryUsersDto) {
    return this.userService.queryUsers(pagination);
  }

  /**
   * @description 根据用户id获取用户信息
   */
  @Get(':id')
  @ApiOperation({
    summary: '根据用户id获取用户信息',
    operationId: 'queryUserById',
  })
  async queryUserById(@Param('id') id: string) {
    return this.userService.queryUserById(id);
  }

  /**
   * @description 根据用户id编辑用户信息
   */
  @Post(':id')
  @ApiOperation({
    summary: '根据用户id编辑用户信息',
    operationId: 'editUserById',
  })
  async editUserById(@Param('id') id: string, @Body() body: EditUserDto) {
    return this.userService.editUserById(id, body);
  }
}
