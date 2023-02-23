import {logger} from '../../../config.js';
import {nanoServer} from '../../../libs/nano-server.js';
import getSans from '../../../libs/get-sans.js';
import {storageClient} from '../../../libs/storage.js';
import {requireUserVerify} from '../../../libs/require-user-verify.js';

import type {StringifyableRecord} from '@alwatr/type';
import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {UserInterface, UserResponseData} from '../../../types/user.js';

nanoServer.route('GET', '/admin/users', getUserStorage);
/**
 * It gets the list of users from the storage service
 *
 * @param {AlwatrConnection} connection - AlwatrConnection
 *
 * @returns An array of UserResponseData objects.
 */
export async function getUserStorage(
  connection: AlwatrConnection,
): Promise<
  AlwatrServiceResponse<Record<string, UserResponseData>, StringifyableRecord>
> {
  logger.logMethod('getUserStorage');

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

  try {
    const sansList = await getSans();
    const userList = await storageClient.getStorage<UserInterface>('user');

    const userListResponseData: Record<string, UserResponseData> =
      Object.fromEntries(
        Object.values(userList.data).map((user): [string, UserResponseData] => {
          const group = Object.fromEntries(
            Object.values(userList.data)
              .filter(
                (_user) =>
                  user.groupId === _user.groupId && user.id !== _user.id,
              )
              .map((user: Partial<UserInterface>) => {
                delete user.auth;

                return [user.id, user as Omit<UserInterface, 'auth'>];
              }),
          );
          let sans = null;

          if (user.sansCode != null) {
            const sansKey = Object.keys(sansList.data).find(
              (sansKey) => sansKey === user.sansCode,
            );

            if (sansKey != null) {
              const _sans = sansList.data[sansKey];

              if (_sans != null) {
                sans = _sans;
              }
            }
          }

          return [user.id, {...user, group, sans}];
        }),
      );

    return {
      ok: true,
      data: userListResponseData,
    };
  } catch (_err) {
    const err = _err as Error;

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
