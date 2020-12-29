import { Socket } from 'net';

export interface Socks5ClientOptions {
  host: string;
  hostname: string;
  port: number;
  username: string;
  password: string;
}

export class Socks5Client {
  private readonly hostname: string;

  private readonly port: number;

  private socket = new Socket();

  constructor(options: Socks5ClientOptions) {
    const { host, hostname, port } = options;
    this.hostname = hostname || host.split(':')[0] || 'localhost';
    this.port = Number(port || host.split(':')[1] || 1080);
  }

  connect() {
    this.socket.connect(
      {
        host: this.hostname,
        port: this.port,
      },
      () => {},
    );
  }

  authenticate() {
    this.socket.once('data', (data) => {
      console.log(data);
    });
  }
}
