import {logger} from '../../../config.js';
import {nanoServer} from '../../../libs/nano-server.js';
import {storageClient} from '../../../libs/storage.js';
import {requireUserVerify} from '../../../libs/require-user-verify.js';
import getSans from '../../../libs/get-sans.js';

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
): Promise<
  AlwatrServiceResponse<Record<string, SansInterface>, StringifyableRecord>
> {
  logger.logMethod('sansCreateEdit');

  const params = connection.requireQueryParams<{
    id: string;
  }>({id: 'string'});
  const admin = await requireUserVerify(params.id, connection.getToken());

  if (admin.ok !== true || admin.data.user.role !== 'admin') {
    return {
      ok: false,
      statusCode: 403,
      errorCode: 'user_forbidden',
    };
  }

  const jsonBody = await connection.requireJsonBody<
    Record<string, Partial<SansInterface>>
  >();

  try {
    const sansList = await storageClient.getStorage<SansInterface>('sans');

    const newSansList = Object.values(jsonBody).map((sans) => {
      let _sans: SansInterface = {
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

      if (sans.id != null) {
        const oldSans = sansList.data[sans.id];

        if (oldSans != null) {
          _sans = {
            ..._sans,
            ...oldSans,
          };
        }
      }

      _sans = {
        ..._sans,
        ...sans,
      };

      delete _sans.hallCapacityNumber;
      delete _sans.confirmedGuestsNumber;
      delete _sans.guestsNumber;

      return _sans;
    });

    for await (const sans of newSansList) {
      await storageClient.set(sans, 'sans');
    }

    return await getSans();
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
