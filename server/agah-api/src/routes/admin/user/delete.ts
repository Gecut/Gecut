import {logger} from '../../../config.js';
import {nanoServer} from '../../../libs/nano-server.js';
import {storageClient} from '../../../libs/storage.js';
import {requireUserVerify} from '../../../libs/require-user-verify.js';

import {getUserStorage} from './get.js';

import type {UserResponseData} from '../../../types/user.js';
import type {StringifyableRecord} from '@alwatr/type';
import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';

nanoServer.route('DELETE', '/admin/user', userDelete);
/**
 * It delete user
 *
 * @param {AlwatrConnection} connection - AlwatrConnection
 *
 * @returns A function that returns a promise that
 * resolves to an AlwatrServiceResponse
 */
async function userDelete(
  connection: AlwatrConnection,
): Promise<
  AlwatrServiceResponse<Record<string, UserResponseData>, StringifyableRecord>
> {
  logger.logMethod('userDelete');

  const params = connection.requireQueryParams<{
    id: string;
    userId: string;
  }>({id: 'string', userId: 'string'});
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
    await storageClient.delete(params.userId, 'user');

    return await getUserStorage(connection);
  } catch (_err) {
    const err = _err as Error;
    logger.error('userDelete', err.message || 'storage_error', err);
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
