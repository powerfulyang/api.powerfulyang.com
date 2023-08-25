import { getRequestId } from '@/request/namespace';
import { isProdProcess, isTestProcess } from '@powerfulyang/utils';
import chalk from 'chalk';
import dayjs from 'dayjs';
import process from 'node:process';
import winston, { format } from 'winston';

const { combine, timestamp, printf } = format;
const transport = new winston.transports.Console();
const packageName = process.env.npm_package_name || '';

function getChalkColor(level: string): chalk.Chalk {
  switch (level) {
    case 'info':
      return chalk.green;
    case 'error':
      return chalk.red;
    case 'debug':
      return chalk.blue;
    case 'warn':
      return chalk.yellow;
    case 'verbose':
      return chalk.gray;
    default:
      return chalk.cyan;
  }
}

function determineLogLevel(): string {
  if (isProdProcess) return 'info';
  // 添加额外的判断逻辑时，可以在此处插入
  return 'debug';
}

const logFormat = printf(({ level, message, ...others }) => {
  const {
    context,
    stack,
    timestamp: t,
    ...json
  } = others as {
    context?: string;
    stack?: string;
    timestamp: string;
    [key: string]: any;
  };
  const write = getChalkColor(level);
  const LEVEL = write(level.toUpperCase());
  const MESSAGE = write(message);
  const requestId = getRequestId();
  const _requestId = requestId ? `@${requestId}` : '';
  const _context = context ? `${context}` : '';
  const CONTEXT = write(`[${_context}${_requestId}]`);
  const APP = write(`[${packageName}] ${process.pid}  -`);
  const STACK = stack ? chalk.magenta(`\n${stack}`) : '';
  const _JSON = Object.keys(json).length
    ? chalk.blueBright(`\n${JSON.stringify(json, undefined, 2)}`)
    : '';

  return `${APP} ${t}     ${LEVEL} ${CONTEXT} ${MESSAGE}${STACK}${_JSON}`;
});

export const loggerInstance = winston.createLogger({
  level: determineLogLevel(),
  transports: [transport],
  silent: isTestProcess,
  format: combine(
    timestamp({
      format: () => {
        return dayjs().format('MM/DD/YYYY, h:mm:ss.SSS A');
      },
    }),
    logFormat,
  ),
});
