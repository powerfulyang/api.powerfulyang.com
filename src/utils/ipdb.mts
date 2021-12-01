import IPDB from 'ipdb';
import Ipdb from 'qqwry.ipdb';

const ipdb = new IPDB(Ipdb);

export const findIpInfo = ipdb.find.bind(ipdb);
