import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { createParamDecorator, ForbiddenException, Injectable } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import type { Multipart, MultipartValue } from '@fastify/multipart';
import type { UploadFile } from '@/type/UploadFile';
import type { ImagesRequest } from '@/type/ExtendRequest';

export const Images = createParamDecorator((_data: number, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ImagesRequest>();
  return request.images;
});

@Injectable()
export class ImagesInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {
    this.loggerService.setContext(ImagesInterceptor.name);
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<ImagesRequest>();
    const parts = request.parts();
    const body = {};
    const images: UploadFile[] = [];
    for await (const part of parts) {
      if (part.file) {
        if (part.mimetype.startsWith('image/')) {
          const buffer = await part.toBuffer();
          images.push({
            buffer,
            fieldname: part.fieldname,
            encoding: part.encoding,
            mimetype: part.mimetype,
            originalname: part.fieldname,
            size: buffer.length,
          });
        } else {
          throw new ForbiddenException('Only image file is allowed!');
        }
      } else {
        const field = part as MultipartValue<string> & Multipart;
        // 判断 key 是否存在, 如果存在, 则转换为数组
        if (body[field.fieldname]) {
          if (!Array.isArray(body[field.fieldname])) {
            body[field.fieldname] = [body[field.fieldname]];
          } else {
            body[field.fieldname] = [...body[field.fieldname], field.value];
          }
        } else {
          body[field.fieldname] = field.value;
        }
      }
    }
    request.body = body;
    request.images = images;
    return next.handle();
  }
}
