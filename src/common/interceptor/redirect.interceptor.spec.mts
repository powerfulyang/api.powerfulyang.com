import { RedirectInterceptor } from './redirect.interceptor.mjs';
import { AppLogger } from '../logger/app.logger.mjs';

describe('RedirectInterceptor', () => {
  it('should be defined', () => {
    expect(new RedirectInterceptor(new AppLogger())).toBeDefined();
  });
});
