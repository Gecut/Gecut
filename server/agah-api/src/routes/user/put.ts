import {logger} from '../../config.js';
import {nanoServer} from '../../libs/nano-server.js';
import {storageClient} from '../../libs/storage.js';
import {requireUserVerify} from '../../libs/require-user-verify.js';

import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {SansInterface} from '../../types/sans.js';
import type {UserInterface} from '../../types/user.js';
import type {StringifyableRecord} from '@alwatr/type';

nanoServer.route('PUT', '/user', editUser);
/**
 * `editUser` edits a user
 *
 * @param {AlwatrConnection} connection - AlwatrConnection
 *
 * @returns A function that returns a promise that resolves
 *  to an AlwatrServiceResponse.
 */
async function editUser(
  connection: AlwatrConnection,
): Promise<AlwatrServiceResponse<StringifyableRecord, StringifyableRecord>> {
  logger.logMethod('editUser');

  const jsonBody = await connection.requireJsonBody<Partial<UserInterface>>();
  const token = connection.getToken();

  if (jsonBody.id == null) {
    return {
      ok: false,
      statusCode: 404,
      errorCode: 'user_id_required',
    };
  }

  const userVerifyResult = await requireUserVerify(jsonBody.id, token);
  if (userVerifyResult.ok === false) {
    return userVerifyResult;
  }

  try {
    const sansList = await storageClient.getStorage<SansInterface>('sans');

    const user: UserInterface = {
      ...userVerifyResult.data.user,
      ...jsonBody,
    };

    if (jsonBody.sansCode != null && sansList.data[user.sansCode].id == null) {
      return {
        ok: false,
        statusCode: 404,
        errorCode: 'sans_code_not_found',
      };
    }

    return {
      ok: true,
      data: await storageClient.set(user, 'user'),
    };
  } catch (_err) {
    const err = _err as Error;
    logger.error('editUser', err.message || 'storage_error', err);
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
