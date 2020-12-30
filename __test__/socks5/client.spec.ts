import { Socks5Client } from 'api/proxy-fetch/socks5/Socks5Client';

describe('test socks5client', function () {
  it('authenticate', function (done) {
    const client = new Socks5Client();
    client.socket.on('data', (data) => {
      console.log(data);
    });

    client.socket.on('error', () => {
      done();
    });
  });
});
