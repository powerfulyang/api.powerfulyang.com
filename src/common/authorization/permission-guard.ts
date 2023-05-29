import { Permission } from '@/common/decorator/permissions.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import type { FastifyExtendRequest } from '@/type/FastifyExtendRequest';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly logger: LoggerService, private readonly reflector: Reflector) {
    this.logger.setContext(PermissionGuard.name);
  }

  canActivate(context: ExecutionContext) {
    const permissions = this.reflector.get<Permission[]>(Permission, context.getHandler()) || [];
    const req = context.switchToHttp().getRequest<FastifyExtendRequest>();
    const { user } = req;
    this.logger.debug(`Action needs permissions: ${permissions.join(', ')}`);
    const hasPermission = user.roles.some((role) => {
      return role.permissions.some((permission) => {
        return permissions.includes(permission);
      });
    });
    return hasPermission || permissions.length === 0;
  }
}
