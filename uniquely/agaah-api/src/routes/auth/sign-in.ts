import {config, logger} from '../../config.js';
import {nanoServer} from '../../libraries/nano-server.js';
import {storageClient} from '../../libraries/storage.js';
import getUser from '../../utilities/get-user.js';

import type {StringifyableRecord} from '@alwatr/type';
import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {UserInterface, UserResponseData} from '../../types/user.js';

type UserLoginType = {
  id: string;
  phone: string;
};

nanoServer.route('POST', '/authentication/sign-in', signIn);
/**
 * It takes a connection object, and returns a promise
 * that resolves to a service response object
 *
 * @param {AlwatrConnection} connection - AlwatrConnection
 *
 * @returns A promise that resolves to an
 *  AlwatrServiceResponse object.
 */
async function signIn(
  connection: AlwatrConnection,
): Promise<AlwatrServiceResponse<UserResponseData, StringifyableRecord>> {
  logger.logMethod('signIn');

  try {
    const userList = await storageClient.getStorage<UserInterface>('user');
    const jsonBody = await connection.requireJsonBody<UserLoginType>();

    let user = userList.data[jsonBody.id];

    if (user == null || user.phone != jsonBody.phone) {
      return {
        ok: false,
        statusCode: 404,
        errorCode: 'user_not_found',
      };
    }

    const token = config.token.generate(`${user.id}-${user.phone}`);

    if (user.auth !== token) {
      user.auth = token;
      user = await storageClient.set(user, 'user');
    }

    return await getUser(user);
  } catch (_err) {
    const err = _err as Error;
    logger.error('signIn', err.message || 'storage_error', err);
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
