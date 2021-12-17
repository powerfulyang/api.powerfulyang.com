import { sha1 } from '@powerfulyang/node-utils';
import { inspectIp } from '@/utils/ipdb';
import { createSocket } from 'dgram';

describe('utils test', function () {
  it('sha1', function () {
    expect(sha1('我是机器人')).toBe('425a666053295fecbdd5815872ccb9a6196b5df2');
  });

  it('str replace', function () {
    const imgUrl = 'https://i.pinimg.com/236x/79/93/6a/79936a4f9dd7217e85bd3ea6948561b8.jpg';
    const newUrl = imgUrl.replace(/(jpg)$/, 'png');
    expect(newUrl).toBe('https://i.pinimg.com/236x/79/93/6a/79936a4f9dd7217e85bd3ea6948561b8.png');
  });

  it('findIpInfo', function () {
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

  it('udp request', function () {
    createSocket('udp4').send('你好', 30000, 'localhost');
  });
});
