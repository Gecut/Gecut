import {config, logger} from '../../config.js';
import {nanoServer} from '../../libs/nano-server.js';
import {storageClient} from '../../libs/storage.js';
import {
  generateUniqueGroupId,
  generateUniqueTicketCode,
} from '../../libs/unique-code.js';
import getUser from '../../libs/get-user.js';

import type {StringifyableRecord} from '@alwatr/type';
import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {SansInterface} from '../../types/sans.js';
import type {UserInterface, UserResponseData} from '../../types/user.js';

nanoServer.route('POST', '/authentication/sign-up', signUp);
/**
 * It creates a new user
 *
 * @param {AlwatrConnection} connection - AlwatrConnection
 *
 * @returns A function that returns a promise that
 * resolves to an AlwatrServiceResponse
 */
async function signUp(
  connection: AlwatrConnection,
): Promise<AlwatrServiceResponse<UserResponseData, StringifyableRecord>> {
  logger.logMethod('signUp');

  const sansList = await storageClient.getStorage<SansInterface>('sans');
  const userList = await storageClient.getStorage<UserInterface>('user');
  const phones = Object.values(userList.data)
    .filter((user) => user.deleted === false)
    .map((user) => user.phone);
  const jsonBody = await connection.requireJsonBody<Partial<UserInterface>>();

  if (
    jsonBody.role === 'admin' &&
    connection.getToken() !== config.nanoServer.accessToken
  ) {
    return {
      ok: false,
      statusCode: 403,
      errorCode: 'you_can_not_create_admin_user',
    };
  }

  if (jsonBody.id != null) {
    return {
      ok: false,
      statusCode: 403,
      errorCode: 'you_can_not_set_id',
    };
  }

  if (jsonBody.phone != null && phones.includes(jsonBody.phone)) {
    return {
      ok: false,
      statusCode: 401,
      errorCode: 'this_phone_exists',
    };
  }

  for (const key of Object.keys(jsonBody)) {
    if (jsonBody[key] == null || jsonBody[key]?.toString().trim() == '') {
      delete jsonBody[key];
    }
  }

  const user: UserInterface = {
    id: generateUniqueTicketCode(Object.keys(userList.data)),
    phone: '09xxxxxxxxx',
    callsNumber: 'no-call',
    firstName: '',
    lastName: '',
    sansCode: '',
    auth: '',
    role: 'user',
    gender: 'unknown',

    age: 0,
    groupId: generateUniqueGroupId(
      Object.values(userList.data).map((user) => user.groupId),
    ),

    deleted: false,
    smsAddressSent: false,
    status: 'awaiting-confirmation',

    ...jsonBody,
  };

  user.auth = config.token.generate(`${user.id}-${user.phone}`);

  if (user.role === 'user') {
    const userSans = sansList.data[user.sansCode] as Partial<SansInterface>;

    if (userSans?.id == null) {
      return {
        ok: false,
        statusCode: 404,
        errorCode: 'sans_code_not_found',
      };
    }

    if (userSans.gender !== user.gender) {
      return {
        ok: false,
        statusCode: 403,
        errorCode: 'bad_gender',
      };
    }
  }

  try {
    await storageClient.set(user, 'user');

    const userResp = await getUser(user);

    if (userResp == null || userResp.ok !== true) {
      return {
        ok: false,
        statusCode: 404,
        errorCode: 'user_not_found',
      };
    }

    return userResp;
  } catch (_err) {
    const err = _err as Error;
    logger.error('signUp', err.message || 'storage_error', err);
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
