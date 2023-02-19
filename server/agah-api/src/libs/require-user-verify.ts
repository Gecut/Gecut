import {config, logger} from '../config.js';

import {storageClient} from './storage.js';

import type {AlwatrServiceResponse, StringifyableRecord} from '@alwatr/type';
import type {UserInterface} from '../types/user.js';

/**
 * It takes a user ID and a token, and
 * returns the user data if the token is valid
 *
 * @param {string} userID - The user's ID.
 *
 * @param {string | null} token - The token
 * that was sent to the user's phone number.
 *
 * @returns An object with the following properties:
 */
export async function requireUserVerify(
  userID: string,
  token: string | null,
): Promise<
  AlwatrServiceResponse<
    {user: UserInterface; token: string} | Record<string, never>,
    StringifyableRecord
  >
> {
  if (token == null) {
    return {
      ok: false,
      statusCode: 400,
      errorCode: 'token_required',
    };
  }

  try {
    const userList = await storageClient.getStorage<UserInterface>('user');
    const user = userList.data[userID];

    if (user == null) {
      return {
        ok: false,
        statusCode: 404,
        errorCode: 'user_not_found',
      };
    }

    const tokenVerifyResult = config.token.verify(
      `${user.id}-${user.phone}`,
      token,
    );

    if (tokenVerifyResult !== 'valid') {
      return {
        ok: false,
        statusCode: 401,
        errorCode: 'token_' + tokenVerifyResult,
      };
    }

    return {
      ok: true,
      data: {user, token},
    };
  } catch (_err) {
    const err = _err as Error;

    logger.error('getUserData', err.message || 'storage_error', err);

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
