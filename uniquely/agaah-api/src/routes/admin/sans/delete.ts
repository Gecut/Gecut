import {logger} from '../../../config.js';
import {nanoServer} from '../../../libraries/nano-server.js';
import {storageClient} from '../../../libraries/storage.js';
import {requireUserVerify} from '../../../utilities/require-user-verify.js';
import getSans from '../../../utilities/get-sans.js';

import type {StringifyableRecord} from '@alwatr/type';
import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {SansInterface} from '../../../types/sans.js';

nanoServer.route('DELETE', '/admin/sans', sansDelete);
/**
 * It creates a new sans
 *
 * @param {AlwatrConnection} connection - AlwatrConnection
 *
 * @returns A function that returns a promise that
 * resolves to an AlwatrServiceResponse
 */
async function sansDelete(
  connection: AlwatrConnection,
): Promise<
  AlwatrServiceResponse<Record<string, SansInterface>, StringifyableRecord>
> {
  logger.logMethod('sansDelete');

  const params = connection.requireQueryParams<{
    id: string;
    sansId: string;
  }>({id: 'string', sansId: 'string'});
  const user = await requireUserVerify(params.id, connection.getToken());

  if (user.ok !== true) {
    return {
      ok: false,
      statusCode: 404,
      errorCode: 'user_not_found',
    };
  }

  if (user.data.user.role !== 'admin') {
    return {
      ok: false,
      statusCode: 403,
      errorCode: 'user_forbidden',
    };
  }

  try {
    await storageClient.delete(params.sansId, 'sans');

    return await getSans();
  } catch (_err) {
    const err = _err as Error;
    logger.error('sansDelete', err.message || 'storage_error', err);
    return {
      ok: false,
      statusCode: 500,
      errorCode: 'storage_error',
      meta: {
        name: err.name,
        message: err.message,
      },
    };
  }
}
