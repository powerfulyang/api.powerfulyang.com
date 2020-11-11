import { Injectable } from '@nestjs/common';
import { createSocket } from 'dgram';
import { VoidFunction } from '@powerfulyang/utils';
import { Subject } from 'rxjs';
import { AppLogger } from '@/common/logger/app.logger';

@Injectable()
export class UdpServerService {
  private observable = new Subject();

  private udpServer;

  private udpSocket;

  constructor(private logger: AppLogger) {
    this.logger.setContext(UdpServerService.name);
    this.udpServer = createSocket({ type: 'udp4' });
    this.udpServer.bind({
      port: 30000,
    });
    this.udpServer.on('message', (message) => {
      this.observable.next(message.toString());
      this.logger.info(message.toString());
    });
    this.udpServer.on('error', (error) => {
      this.logger.error(error);
    });
    this.udpSocket = createSocket('udp4');
  }

  on(callback: VoidFunction) {
    this.observable.subscribe(callback);
  }

  send(val: any, port = 30000, server = 'localhost') {
    this.udpSocket.send(val, port, server);
  }
}
