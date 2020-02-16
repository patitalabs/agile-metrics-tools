import { createLogger, format, transports } from 'winston';

const IS_NOT_PRODUCTION = process.env.NODE_ENV !== 'production';

export const Logger = createLogger({
  level: IS_NOT_PRODUCTION ? 'debug' : 'info',
  format: IS_NOT_PRODUCTION ? format.simple() : format.json(),
  transports: [new transports.Console()]
});
