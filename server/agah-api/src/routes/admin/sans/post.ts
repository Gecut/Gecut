import {logger} from '../../../config.js';
import {nanoServer} from '../../../libs/nano-server.js';
import {storageClient} from '../../../libs/storage.js';
import {requireUserVerify} from '../../../libs/require-user-verify.js';

import type {StringifyableRecord} from '@alwatr/type';
import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {SansInterface} from '../../../types/sans.js';

nanoServer.route('POST', '/admin/sans', sansCreateEdit);
/**
 * It creates a new sans
 *
 * @param {AlwatrConnection} connection - AlwatrConnection
 *
 * @returns A function that returns a promise that
 * resolves to an AlwatrServiceResponse
 */
async function sansCreateEdit(
  connection: AlwatrConnection,
): Promise<AlwatrServiceResponse<SansInterface, StringifyableRecord>> {
  logger.logMethod('sansCreateEdit');

  try {
    const param = connection.requireQueryParams<{id: string}>({id: 'string'});
    const token = connection.getToken();
    const jsonBody = await connection.requireJsonBody<Partial<SansInterface>>();
    const sansList = await storageClient.getStorage<SansInterface>('sans');

    const userVerifyResult = await requireUserVerify(param.id, token);

    if (userVerifyResult.ok === false) {
      return userVerifyResult;
    }

    if (userVerifyResult.data.user.role !== 'admin') {
      return {
        ok: false,
        statusCode: 403,
        errorCode: 'you_can_not_create_sans',
      };
    }

    let sans: SansInterface = {
      id: 'auto_increment',
      date: new Date().getTime(),
      inactive: false,

      duration: 90,
      groupsNumber: 1,
      groupsCapacityNumber: 1,
      gender: 'unknown',

      ageLimit: {
        min: 1,
        max: 100,
      },
    };

    if (jsonBody.id != null) {
      const oldSans = sansList.data[jsonBody.id];

      if (oldSans != null) {
        sans = {
          ...sans,
          ...oldSans,
        };
      }
    }

    sans = {
      ...sans,
      ...jsonBody,
    };

    delete sans.hallCapacityNumber;
    delete sans.confirmedGuestsNumber;
    delete sans.guestsNumber;

    return {
      ok: true,
      data: await storageClient.set(sans, 'sans'),
    };
  } catch (_err) {
    const err = _err as Error;
    logger.error('addSans', err.message || 'storage_error', err);
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
