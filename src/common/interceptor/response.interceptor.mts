import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import type { Request, Response } from 'express';
import { AppLogger } from '@/common/logger/app.logger.mjs';
import { UserService } from '@/modules/user/user.service.mjs';
import { Authorization, CookieOptions, SUCCESS } from '@/constants/constants.mjs';
import { PathViewCountService } from '@/modules/path-ip-view-count/path-view-count.service.mjs';
import type { ReqExtend } from '@/type/ReqExtend.mjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private logger: AppLogger,
    private userService: UserService,
    private pathViewCountService: PathViewCountService,
  ) {
    this.logger.setContext(ResponseInterceptor.name);
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = _context.switchToHttp();
    this.logger.debug(`handle in ${ResponseInterceptor.name}`);
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & ReqExtend>();
    const path = request.url;
    const { xRealIp } = request.extend;

    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`tap in ${ResponseInterceptor.name}`);
      }),
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
        const count = await this.pathViewCountService.handlePathViewCount(path, xRealIp);
        if (data) {
          return {
            status: SUCCESS,
            data,
            timestamp: new Date().toISOString(),
            path: request.url,
            pathViewCount: count,
          };
        }
        return data;
      }),
    );
  }
}
