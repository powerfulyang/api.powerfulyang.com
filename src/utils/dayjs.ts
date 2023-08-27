import dayjs from 'dayjs';

export const DateTimeFormat = (date?: Date | string | number): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss.SSS');
};
