import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { LoggerService } from '@/common/logger/logger.service';
import { Role } from '@/modules/user/entities/role.entity';
import type { ExtendRequest } from '@/type/ExtendRequest';
import type { UploadFile } from '@/type/UploadFile';

type AccessRequest = ExtendRequest & {
  body: {
    public?: boolean | string;
    assets?: UploadFile[];
  };
};

@Injectable()
export class AccessInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {
    this.loggerService.setContext(AccessInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<AccessRequest>();
    const useRoles = request.user.roles;
    const isAdmin = useRoles.some((role) => role.roleName === Role.IntendedRoles.admin);
    const body = request.body || {};
    const isPublic = body.public === 'true' || body.public === true;
    if (isPublic && !isAdmin) {
      throw new ForbiddenException(
        'Only admin can create public content, please set public field to false or remove it.',
      );
    }
    const hasAttachments = request.body.assets?.length;
    if (hasAttachments && !isAdmin) {
      throw new ForbiddenException('Only admin can upload assets, please remove assets field.');
    }
    return next.handle();
  }
}
