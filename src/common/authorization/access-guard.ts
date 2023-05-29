import { LoggerService } from '@/common/logger/logger.service';
import { Role } from '@/modules/user/entities/role.entity';
import type { FastifyExtendRequest } from '@/type/FastifyExtendRequest';
import type { UploadFile } from '@/type/UploadFile';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';

type AccessRequest = FastifyExtendRequest & {
  body: {
    public?: boolean | string;
    assets?: UploadFile[];
  };
};

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(AccessGuard.name);
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AccessRequest>();
    const useRoles = request.user.roles;
    const isAdmin = useRoles.some((role) => role.name === Role.IntendedRoles.admin);
    const body = request.body || {};
    const isPublic = body.public === 'true' || body.public === true;
    if (isPublic && !isAdmin) {
      throw new ForbiddenException(
        'Only admin can create public content, please set public field to false or remove it.',
      );
    }
    const hasAttachments = body.assets?.length;
    if (hasAttachments && !isAdmin) {
      throw new ForbiddenException('Only admin can upload assets, please remove assets field.');
    }
    return true;
  }
}
