import { ResponseInterceptor } from './response.interceptor';
import { AppLogger } from '@/common/logger/app.logger';

describe('ResponseInterceptor', () => {
    it('should be defined', () => {
        expect(
            new ResponseInterceptor(new AppLogger()),
        ).toBeDefined();
    });
});
