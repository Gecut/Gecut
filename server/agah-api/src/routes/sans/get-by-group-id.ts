import {logger} from '../../config.js';
import {nanoServer} from '../../libs/nano-server.js';
import getSans from '../../libs/get-sans.js';
import {storageClient} from '../../libs/storage.js';

import type {StringifyableRecord} from '@alwatr/type';
import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {UserInterface} from '../../types/user.js';

nanoServer.route('GET', '/sans/group-id', getSansByGroupId);
/**
 * It gets the list of sans from the storage service
 *
 * @returns A Promise that resolves to an AlwatrServiceResponse
 */
async function getSansByGroupId(
  connection: AlwatrConnection,
): Promise<AlwatrServiceResponse<StringifyableRecord, StringifyableRecord>> {
  logger.logMethod('getSansByGroupId');

  const param = connection.requireQueryParams<{id: string}>({id: 'string'});

  try {
    const userList = await storageClient.getStorage<UserInterface>('user');
    const sansList = await getSans();
    const userSans = Object.values(userList.data).find(
      (sans) => sans.groupId === param.id,
    );
    const sansCode = userSans?.sansCode;

    if (sansCode == null || sansCode.trim() == '') {
      return {
        ok: false,
        statusCode: 404,
        errorCode: 'sans_code_not_found',
        meta: {sansCode, userSans},
      };
    }

    const sans = sansList.data[sansCode];

    if (sans == null) {
      return {
        ok: false,
        statusCode: 404,
        errorCode: 'sans_not_found',
      };
    }

    return {
      ok: true,
      data: sans,
    };
  } catch (_err) {
    const err = _err as Error;
    logger.error('getSansByGroupId', err.message || 'storage_error', err);

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
