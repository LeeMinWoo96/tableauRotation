// logger.js
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// 로그 형식 설정
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// 일 단위로 로그 회전 설정
const dailyRotateFileTransport = new DailyRotateFile({
  filename: path.join('logs', 'application-%DATE%.log'), // 로그 파일 이름 패턴
  datePattern: 'YYYY-MM-DD', // 일 단위로 회전
  maxFiles: '30d', // 최대 보관 기간: 30일
  zippedArchive: true, // 로그 파일을 압축하여 저장
  level: 'info', // 기록할 최소 로그 수준
});

const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.Console(), // 콘솔에 로그 출력
    dailyRotateFileTransport, // 파일에 로그 저장 및 회전 설정
  ],
});

export default logger;
