import { Injectable, NestMiddleware } from '@nestjs/common';
import { mapValues } from 'lodash';
import { isPlainObject } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class FormatMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    // 去掉头尾空格
    if (isPlainObject(req.query)) {
      req.query = mapValues(req.query, x => {
        return typeof x === 'string' ? x.trim() : x;
      });
    }
    /**
     * 2019-10-12 17:46:44 血与泪的教训 mapValues array参数 返回值是 plainObject
     */
    if (isPlainObject(req.body)) {
      req.body = mapValues(req.body, x => {
        return typeof x === 'string' ? x.trim() : x;
      });
    }
    next();
  }
}
