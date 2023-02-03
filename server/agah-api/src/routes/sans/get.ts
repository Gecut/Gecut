import {logger} from '../../config.js';
import {nanoServer} from '../../libs/nano-server.js';
import {storageClient} from '../../libs/storage.js';

import type {AlwatrServiceResponse} from '@alwatr/nano-server';
import type {SansInterface} from '../../types/sans.js';

nanoServer.route('GET', '/sans', getSansList);
/**
 * It gets the list of SANS from the storage service
 *
 * @returns A Promise that resolves to an AlwatrServiceResponse
 */
async function getSansList(): Promise<AlwatrServiceResponse> {
  logger.logMethod('getSansList');

  try {
    return await storageClient.getStorage<SansInterface>('sans');
  } catch (_err) {
    const err = _err as Error;
    logger.error('getSansList', err.message || 'storage_error', err);
    return {
      ok: false,
      statusCode: 500,
      errorCode: 'storage_error',
      meta: {
        name: err.name,
        message: err.message,
        cause: err.cause,
      },
    };
  }
}
