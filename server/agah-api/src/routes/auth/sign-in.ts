import {config, logger} from '../../config.js';
import {nanoServer} from '../../libs/nano-server.js';
import {storageClient} from '../../libs/storage.js';

import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {UserInterface} from '../../types/user.js';

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
): Promise<AlwatrServiceResponse> {
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

    return {
      ok: true,
      data: {
        user,
      },
    };
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
        cause: err.cause,
      },
    };
  }
}
