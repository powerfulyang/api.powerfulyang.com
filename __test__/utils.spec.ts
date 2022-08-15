import { sha1 } from '@powerfulyang/node-utils';
import { createSocket } from 'dgram';
import { basename, extname } from 'path';
import { inspectIp } from '@/utils/ipdb';
import { convertUuidToNumber } from '@/utils/uuid';

describe('utils test', () => {
  it('sha1', () => {
    expect(sha1('我是机器人')).toBe('425a666053295fecbdd5815872ccb9a6196b5df2');
  });

  it('inspectIp', () => {
    expect(inspectIp('1.1.1.1')).toStrictEqual({
      code: 0,
      data: {
        bitmask: 24,
        city_name: '',
        country_name: '美国',
        ip: '1.1.1.1',
        isp_domain: '',
        owner_domain: 'apnic.net',
        region_name: '美国',
      },
    });
  });

  it('UDP test', () => {
    const socket = createSocket('udp4');
    socket.send('你好', 30000, 'localhost');
  });

  it('extname', () => {
    const filename = '/a/b/c/d.test.jpg';
    const ext = extname(filename);
    const base = basename(filename, ext);
    expect(ext).toBe('.jpg');
    expect(base).toBe('d.test');
  });

  it('uuid', () => {
    const result = convertUuidToNumber();
    const mod = result % 10000;
    expect(mod).toBeLessThan(10000);
  });
});
