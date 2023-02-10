import {createLogger} from '@alwatr/logger';
import {AlwatrTokenGenerator} from '@alwatr/token';

export const logger = createLogger('com-api');

export const config = {
  storage: {
    host: process.env.STORAGE_HOST ?? '127.0.0.1',
    port: process.env.STORAGE_PORT != null ? +process.env.STORAGE_PORT : 9000,
    name: process.env.STORAGE_NAME ?? 'agah',
    token: process.env.STORAGE_TOKEN ?? 'YOUR_SECRET_TOKEN',
  },
  nanoServer: {
    host: process.env.HOST ?? '0.0.0.0',
    port: process.env.PORT != null ? +process.env.PORT : 8000,
    accessToken: process.env.ACCESS_TOKEN ?? 'YOUR_SECRET_TOKEN',
    allowAllOrigin: true,
  },
  token: new AlwatrTokenGenerator({
    secret: 'alwatr-secret-key',
    encoding: 'base64url',
    duration: '1y',
    algorithm: 'sha512',
  }),
};

logger.logProperty('config', config);
