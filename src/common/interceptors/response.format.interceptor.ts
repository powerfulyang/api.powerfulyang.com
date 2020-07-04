import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as Res } from 'express';
import { JwtService } from '@nestjs/jwt';

interface Response<T> {
    data: T;
}

@Injectable()
export class ResponseFormatInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private jwtService: JwtService) {}

    intercept(_context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((rawData) => {
                // refresh token
                const { headers } = _context.switchToHttp().getRequest();
                if (headers?.authorization) {
                    try {
                        const tokenInfo = this.jwtService.verify(headers.authorization);
                        if (tokenInfo.exp - Date.now() / 1000 < 10 * 60) {
                            delete tokenInfo.exp;
                            delete tokenInfo.iat;
                            const token = this.jwtService.sign(tokenInfo);
                            _context
                                .switchToHttp()
                                .getResponse<Res>()
                                .setHeader('authorization', token);
                        }
                    } catch (e) {}
                }
                // 设置token
                if (rawData?.setToken) {
                    _context
                        .switchToHttp()
                        .getResponse<Res>()
                        .setHeader('authorization', rawData.setToken);
                }
                return {
                    data: rawData,
                    status: 'ok',
                    message: (typeof rawData === 'string' && rawData) || '',
                };
            }),
        );
    }
}
