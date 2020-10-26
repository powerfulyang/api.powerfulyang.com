import { AppLogger } from '../logger/app.logger';
import { RequestMiddleware } from './request.middleware';

describe('RequestMiddleware', () => {
    it('should be defined', () => {
        expect(new RequestMiddleware(new AppLogger())).toBeDefined();
    });
});
