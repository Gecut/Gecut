import config from '../config.js';

import {fetchContext} from './fetch-context.js';
import {logger} from './logger.js';

const provideSansStorageContext = async (): Promise<void> => {
  logger.logMethod('provideSansStorageContext');

  try {
    await fetchContext('sans-storage-context', {
      method: 'GET',
      url: config.api + '/sans',
      removeDuplicate: 'auto',
      retry: 10,
      retryDelay: 3_000,
    });
  } catch (err) {
    logger.error('provideSansStorageContext', 'fetch_failed', err);
  }
};

provideSansStorageContext();
