import {config, logger} from '../config.js';
import {nanoServer} from '../lib/nano-server.js';
import {storageProvider} from '../lib/storage-provider.js';

import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';

nanoServer.route('GET', '/keys', getStorageKeys);

/**
 * It requires a token, requires a query parameter
 * called `storage` and returns the keys of the storage
 * engine with that name
 *
 * @param {AlwatrConnection} connection - AlwatrConnection -
 * this is the connection object that is
 * passed to the service. It contains the request
 * , response, and other useful information.
 *
 * @returns An object with a boolean property called ok and a data property.
 */
function getStorageKeys(connection: AlwatrConnection): AlwatrServiceResponse {
  logger.logMethod('getStorageKeys');

  connection.requireToken(config.nanoServer.accessToken);

  const params = connection.requireQueryParams<{storage: string}>({
    storage: 'string',
  });

  const storageEngine = storageProvider.get({name: params.storage});

  return {
    ok: true,
    data: {keys: storageEngine.keys},
  };
}
