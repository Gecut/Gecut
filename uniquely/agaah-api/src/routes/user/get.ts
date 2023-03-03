import {logger} from '../../config.js';
import {nanoServer} from '../../libraries/nano-server.js';
import {requireUserVerify} from '../../utilities/require-user-verify.js';
import getUser from '../../utilities/get-user.js';

import type {StringifyableRecord} from '@alwatr/type';
import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {UserResponseData} from '../../types/user.js';

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

  return await getUser(userVerifyResult.data.user);
}
