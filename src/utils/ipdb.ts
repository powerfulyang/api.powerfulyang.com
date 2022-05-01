import IPDB from 'ipdb';
import db from 'qqwry.ipdb';

const ipdb = new IPDB(db);

export const inspectIp = (
  ip: string,
): {
  code: number;
  data: {
    country_name: string;
    region_name: string;
    city_name: string;
    owner_domain: string;
    isp_domain: string;
  };
} => ipdb.find(ip);
