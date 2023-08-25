import type { User } from '@/user/entities/user.entity';
import cls from 'cls-hooked';

// 创建名为 'request' 的命名空间
export const requestNamespace = cls.createNamespace('request');

export const setRequestId = (requestId: string) => {
  requestNamespace.set('requestId', requestId);
};

export const getRequestId = () => {
  return requestNamespace.get('requestId');
};

export interface RequestUser extends User {
  iat: number;
  exp: number;
}

export const setRequestUser = (user: RequestUser) => {
  requestNamespace.set('user', user);
};

export const getRequestUser = (): RequestUser => {
  return requestNamespace.get('user');
};

interface RequestExtend {
  xRealIp: string;
  address: string;
  start: [number, number];
}

export const setRequestExtend = (extend: RequestExtend) => {
  requestNamespace.set('extend', extend);
};

export const getRequestExtend = (): RequestExtend => {
  return requestNamespace.get('extend');
};
