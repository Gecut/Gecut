import {storageClient} from '../libraries/storage.js';

import type {AlwatrServiceResponseSuccess} from '@alwatr/type';
import type {SansInterface} from '../types/sans.js';
import type {UserInterface} from '../types/user.js';

export default async function getSans(): Promise<
  AlwatrServiceResponseSuccess<Record<string, SansInterface>>
  > {
  try {
    const userList = await storageClient.getStorage<UserInterface>('user');
    const sansList = await storageClient.getStorage<SansInterface>('sans');

    for (const sansKey of Object.keys(sansList.data)) {
      const sans = sansList.data[sansKey];

      const guestsKeys = Object.keys(userList.data)
        .filter((userKey) => userList.data[userKey].sansCode === sansKey)
        .filter((userKey) => userList.data[userKey].status !== 'was-rejected');
      const confirmedGuestsKeys = guestsKeys.filter(
        (userKey) => userList.data[userKey].status === 'confirmed',
      );

      sans.hallCapacityNumber = sans.groupsNumber * sans.groupsCapacityNumber;
      sans.guestsNumber = guestsKeys.length;
      sans.confirmedGuestsNumber = confirmedGuestsKeys.length;
    }

    return {
      ok: true,
      data: sansList.data,
    };
  } catch (_err) {
    const err = _err as Error;

    throw {
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
