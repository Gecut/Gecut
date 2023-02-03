import {config, logger} from '../../config.js';
import {nanoServer} from '../../libs/nano-server.js';
import {storageClient} from '../../libs/storage.js';

import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {SansInterface} from '../../types/sans.js';

nanoServer.route('POST', '/sans', addSans);
/**
 * It adds a Sans to the database
 * @param {AlwatrConnection} connection - AlwatrConnection
 * @returns A function that returns a promise that resolves
 *  to an AlwatrServiceResponse.
 */
async function addSans(
  connection: AlwatrConnection,
): Promise<AlwatrServiceResponse> {
  logger.logMethod('addSans');

  connection.requireToken(config.nanoServer.accessToken);

  const bodyJson = await connection.requireJsonBody<SansInterface>();

  bodyJson.id ??= 'auto_increment';

  try {
    return {
      ok: true,
      data: await storageClient.set(bodyJson, 'sans'),
    };
  } catch (_err) {
    const err = _err as Error;
    logger.error('addSans', err.message || 'storage_error', err);
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
