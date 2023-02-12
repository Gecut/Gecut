import {logger} from '../../config.js';
import {nanoServer} from '../../libs/nano-server.js';
import {storageClient} from '../../libs/storage.js';

import type {AlwatrServiceResponse} from '@alwatr/nano-server';
import type {SansInterface} from '../../types/sans.js';
import type {UserInterface} from '../../types/user.js';
import type {StringifyableRecord} from '@alwatr/type';

nanoServer.route('GET', '/sans', getSansList);
/**
 * It gets the list of sans from the storage service
 *
 * @returns A Promise that resolves to an AlwatrServiceResponse
 */
async function getSansList(): Promise<
  AlwatrServiceResponse<StringifyableRecord, StringifyableRecord>
  > {
  logger.logMethod('getSansList');

  try {
    const userList = await storageClient.getStorage<UserInterface>('user');
    const sansList = await storageClient.getStorage<SansInterface>('sans');

    for (const sansKey of Object.keys(sansList.data)) {
      const sans = sansList.data[sansKey];

      const guestsKeys = Object.keys(userList.data).filter(
        (userKey) => userList.data[userKey].sansCode === sansKey,
      );
      const confirmedGuestsKeys = guestsKeys.filter(
        (userKey) => userList.data[userKey].status === 'confirmed',
      );

      sans.hallCapacityNumber = sans.groupsNumber * sans.groupsCapacityNumber;
      sans.guestsNumber = guestsKeys.length;
      sans.confirmedGuestsNumber = confirmedGuestsKeys.length;
    }

    return sansList;
  } catch (_err) {
    const err = _err as Error;
    logger.error('getSansList', err.message || 'storage_error', err);
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
