import {logger} from '../../../config.js';
import {nanoServer} from '../../../libraries/nano-server.js';
import {storageClient} from '../../../libraries/storage.js';
import {requireUserVerify} from '../../../utilities/require-user-verify.js';

import {getUserStorage} from './get.js';

import type {StringifyableRecord} from '@alwatr/type';
import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {UserInterface, UserResponseData} from '../../../types/user.js';

nanoServer.route('POST', '/admin/users', userCreateEdit);
/**
 * It creates a new user
 *
 * @param {AlwatrConnection} connection - AlwatrConnection
 *
 * @returns A function that returns a promise that
 * resolves to an AlwatrServiceResponse
 */
async function userCreateEdit(
  connection: AlwatrConnection,
): Promise<
  AlwatrServiceResponse<Record<string, UserResponseData>, StringifyableRecord>
> {
  logger.logMethod('userCreateEdit');

  const params = connection.requireQueryParams<{
    id: string;
  }>({id: 'string'});
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

  const jsonBody = await connection.requireJsonBody<
    Record<string, Partial<UserResponseData>>
  >();

  // for (const key of Object.keys(jsonBody)) {
  //   if (jsonBody[key] == null) {
  //     delete jsonBody[key];
  //   }
  // }

  const users = Object.values(jsonBody).map((user): UserInterface => {
    delete user.sans;
    delete user.group;

    return user as UserInterface;
  });

  try {
    for await (const user of users) {
      await storageClient.set(user, 'user');
    }

    return await getUserStorage(connection);
  } catch (_err) {
    const err = _err as Error;
    logger.error('userCreateEdit', err.message || 'storage_error', err);
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
