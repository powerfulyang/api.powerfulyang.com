import IPDB from 'ipdb';
import Ipdb from 'qqwry.ipdb';

const ipdb = new IPDB(Ipdb);

export const inspectIp = ipdb.find.bind(ipdb);
