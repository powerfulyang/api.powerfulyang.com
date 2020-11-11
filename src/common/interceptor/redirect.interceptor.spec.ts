import { RedirectInterceptor } from './redirect.interceptor';
import { AppLogger } from '@/common/logger/app.logger';

describe('RedirectInterceptor', () => {
  it('should be defined', () => {
    expect(new RedirectInterceptor(new AppLogger())).toBeDefined();
  });
});
