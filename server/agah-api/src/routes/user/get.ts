import {logger} from '../../config.js';
import {nanoServer} from '../../libs/nano-server.js';
import {requireUserVerify} from '../../libs/require-user-verify.js';
import {storageClient} from '../../libs/storage.js';

import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {UserInterface, UserResponseData} from '../../types/user.js';
import type {StringifyableRecord} from '@alwatr/type';

nanoServer.route('GET', '/user', getUserData);
/**
 * It gets the list of users from the storage service
 *
 * @param {AlwatrConnection} connection - AlwatrConnection
 *
 * @returns An array of UserResponseData objects.
 */
async function getUserData(
  connection: AlwatrConnection,
): Promise<AlwatrServiceResponse<UserResponseData, StringifyableRecord>> {
  logger.logMethod('getUserData');

  const param = connection.requireQueryParams<{id: string}>({id: 'string'});
  const token = connection.getToken();
  const userVerifyResult = await requireUserVerify(param.id, token);

  if (userVerifyResult.ok === false) {
    return userVerifyResult;
  }

  try {
    const group = await storageClient.getStorage<UserInterface>('user');

    group.data = Object.fromEntries(
      Object.values(group.data)
        .filter((user) => user.groupId === userVerifyResult.data.user.groupId)
        .map((user: Partial<UserInterface>) => {
          delete user.auth;
          return [user.id, user as Omit<UserInterface, 'auth'>];
        }),
    );

    return {
      ok: true,
      data: {
        ...userVerifyResult.data.user,
        group: group.data,
      },
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
