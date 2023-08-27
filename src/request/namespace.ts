import cls from 'cls-hooked';

// 创建名为 'request' 的命名空间
export const requestNamespace = cls.createNamespace('request');

export const setRequestId = (requestId: string) => {
  requestNamespace.set('requestId', requestId);
};

export const getRequestId = () => {
  return requestNamespace.get('requestId');
};
