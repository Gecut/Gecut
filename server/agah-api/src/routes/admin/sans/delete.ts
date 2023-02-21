import {logger} from '../../../config.js';
import {nanoServer} from '../../../libs/nano-server.js';
import {storageClient} from '../../../libs/storage.js';
import {requireUserVerify} from '../../../libs/require-user-verify.js';
import getSans from '../../../libs/get-sans.js';

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
  const admin = await requireUserVerify(params.id, connection.getToken());

  if (admin.ok !== true || admin.data.user.role !== 'admin') {
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