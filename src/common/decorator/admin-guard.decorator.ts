import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { AppLogger } from '@/common/logger/app.logger';
import type { ReqExtend } from '@/type/ReqExtend';
import { Role } from '@/modules/user/entities/role.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(AdminGuard.name);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as ReqExtend;
    const { user } = req;
    this.logger.info(`User ${user?.id} is trying to access admin area`);
    return user.roles.some((role) => role.roleName === Role.IntendedRoles.admin);
  }
}
