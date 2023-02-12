import {logger} from '../../config.js';
import {nanoServer} from '../../libs/nano-server.js';
import {storageClient} from '../../libs/storage.js';
import {requireUserVerify} from '../../libs/require-user-verify.js';

import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {SansInterface} from '../../types/sans.js';
import type {StringifyableRecord} from '@alwatr/type';

nanoServer.route('POST', '/sans', addSans);

/**
 * It adds a new sans to the database
 *
 * @param {AlwatrConnection} connection - AlwatrConnection
 *
 * @returns SansInterface
 */
async function addSans(
  connection: AlwatrConnection,
): Promise<AlwatrServiceResponse<StringifyableRecord, StringifyableRecord>> {
  logger.logMethod('addSans');

  const param = connection.requireQueryParams<{id: string}>({id: 'string'});
  const token = connection.getToken();
  const jsonBody = await connection.requireJsonBody<Partial<SansInterface>>();

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

  const sans: SansInterface = {
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

    ...jsonBody,
  };

  delete sans.hallCapacityNumber;
  delete sans.confirmedGuestsNumber;
  delete sans.guestsNumber;

  try {
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
