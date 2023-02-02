import {config, logger} from '../config.js';
import {nanoServer} from '../lib/nano-server.js';
import {storageProvider} from '../lib/storage-provider.js';

import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';

nanoServer.route('GET', '/storage', getStorage);

/**
 * It requires a token, requires a query parameter called `name`,
 *  and returns the storage object
 *
 * @param {AlwatrConnection} connection - AlwatrConnection -
 * this is the connection object that is
 * passed to the function. It contains the request and
 * response objects, as well as some helper
 * methods.
 *
 * @returns The storage object.
 */
function getStorage(connection: AlwatrConnection): AlwatrServiceResponse {
  logger.logMethod('getStorage');

  connection.requireToken(config.nanoServer.accessToken);

  const params = connection.requireQueryParams<{name: string}>({
    name: 'string',
  });

  const storageEngine = storageProvider.get({name: params.name});

  return {...storageEngine._storage};
}
