import { LoggerService } from '@/common/logger/logger.service';
import type { OnModuleDestroy } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { VoidFunction } from '@powerfulyang/utils';
import { createSocket } from 'dgram';
import { Subject } from 'rxjs';

@Injectable()
export class UdpServerService implements OnModuleDestroy {
  private observable = new Subject();

  private udpServer;

  private udpSocket;

  constructor(private readonly logger: LoggerService) {
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

  onModuleDestroy() {
    this.close();
  }

  on(callback: VoidFunction) {
    this.observable.subscribe(callback);
  }

  close() {
    this.udpSocket.close();
    this.udpServer.close();
    this.observable.unsubscribe();
  }

  send(val: any, port = 30000, server = 'localhost') {
    this.udpSocket.send(val, port, server);
  }
}
