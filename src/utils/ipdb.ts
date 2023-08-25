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

export const getIpInfo = (ip: string) => {
  const { code, data } = inspectIp(ip);
  if (code === 0) {
    const { country_name, region_name, city_name, owner_domain, isp_domain } = data;
    return `${country_name}-${region_name}-${city_name} | ${owner_domain}-${isp_domain}`;
  }
  return '';
};
