import { Test, TestingModule } from '@nestjs/testing';
import { UdpServerService } from './udp-server.service';
import { Subject } from 'rxjs';
import { AppLogger } from '@/common/logger/app.logger';

describe('UdpServerService', () => {
    let service: UdpServerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppLogger, UdpServerService],
        }).compile();

        service = module.get<UdpServerService>(UdpServerService);
    });

    it('should be defined', (done) => {
        service.on((message) => {
            expect(message).toBe('尼嚎');
            done();
        });
        service.send('尼嚎');
    });

    it('rxjs test', function () {
        const fn = jest.fn();
        const subject = new Subject();
        subject.subscribe(() => {
            fn();
        });
        subject.next(1);
        subject.subscribe(() => {
            fn();
        });
        subject.next(1);
        expect(fn).toBeCalledTimes(3);
    });
});
