import {config, logger} from '../config.js';
import {nanoServer} from '../lib/nano-server.js';
import {storageProvider} from '../lib/storage-provider.js';

import type {
  AlwatrConnection,
  AlwatrServiceResponse,
} from '@alwatr/nano-server';
import type {AlwatrDocumentObject} from '@alwatr/storage-engine';

nanoServer.route('PATCH', 'all', updateDocument);

/**
 * It updates a document in a storage engine
 *
 * @param {AlwatrConnection} connection - AlwatrConnection
 *
 * @returns A promise that resolves to an object with the following properties:
 *   ok: boolean
 *   statusCode: number
 *   errorCode: string
 *   data: AlwatrDocumentObject
 */
async function updateDocument(
  connection: AlwatrConnection,
): Promise<AlwatrServiceResponse> {
  logger.logMethod('updateDocument');

  connection.requireToken(config.nanoServer.accessToken);

  const param = connection.requireQueryParams<{storage: string}>({
    storage: 'string',
  });

  const document = await connection.requireJsonBody<AlwatrDocumentObject>();

  if (!(typeof document.id === 'string' && document.id.length !== 0)) {
    return {
      ok: false,
      statusCode: 406,
      errorCode: 'doc_id_required',
    };
  }

  const storageEngine = storageProvider.get({name: param.storage});

  return {
    ok: true,
    data: storageEngine.set(document, true),
  };
}
