import {serviceRequest} from '@alwatr/fetch';
import {commandHandler} from '@alwatr/signal';

import config from '../config.js';
import {sansByGroupIdContextCommandTrigger} from '../context.js';

import {logger} from './logger.js';

import type {SansInterface} from '../types/sans.js';

const provideSansByGroupIdContext = async (
  id: string,
): Promise<SansInterface> => {
  logger.logMethod('provideSansByGroupIdContext');

  try {
    const response = await serviceRequest<SansInterface>({
      method: 'GET',
      url: config.api + '/sans/group-id',
      queryParameters: {id},
      removeDuplicate: 'until_load',
      retry: 10,
      retryDelay: 3_000,
    });

    return response.data;
  } catch (err) {
    logger.error('provideSansByGroupIdContext', 'fetch_failed', err);

    throw err;
  }
};

commandHandler.define<{id: string}, SansInterface>(
  sansByGroupIdContextCommandTrigger.id,
  async (requestParam) => {
    return await provideSansByGroupIdContext(requestParam.id);
  },
);
