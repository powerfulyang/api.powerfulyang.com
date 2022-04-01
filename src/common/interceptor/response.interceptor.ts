import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import type { Response } from 'express';
import { LoggerService } from '@/common/logger/logger.service';
import { UserService } from '@/modules/user/user.service';
import { Authorization, CookieOptions } from '@/constants/constants';
import { PathViewCountService } from '@/modules/path-ip-view-count/path-view-count.service';
import type { RequestExtend } from '@/type/RequestExtend';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private logger: LoggerService,
    private userService: UserService,
    private pathViewCountService: PathViewCountService,
  ) {
    this.logger.setContext(ResponseInterceptor.name);
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = _context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestExtend>();
    const path = request.url;
    const { xRealIp } = request.extend;

    return next.handle().pipe(
      tap(() => {
        // check token expire time;
        if (request.user) {
          const { user } = request;
          const ValidPeriod = user.exp - Date.now() / 1000;
          this.logger.debug(`token 剩余有效期 ${ValidPeriod}`);
          if (ValidPeriod < 6 * 60 * 60) {
            // 小于6小时 refresh token
            const authorization = this.userService.generateAuthorization(user);
            response.cookie(Authorization, authorization, CookieOptions);
          }
        }
      }),
      mergeMap(async (data) => {
        let pathViewCount = 0;
        if (xRealIp) {
          pathViewCount = await this.pathViewCountService.handlePathViewCount(path, xRealIp);
        }
        if (data) {
          return {
            data,
            timestamp: new Date().toISOString(),
            path: request.url,
            pathViewCount,
          };
        }
        return data;
      }),
    );
  }
}
