import {logger} from '../../config.js';
import {nanoServer} from '../../libs/nano-server.js';
import getSans from '../../libs/get-sans.js';

import type {SansInterface} from '../../types/sans.js';
import type {StringifyableRecord} from '@alwatr/type';
import type {AlwatrServiceResponse} from '@alwatr/nano-server';

nanoServer.route('GET', '/sans', getSansList);
/**
 * It gets the list of sans from the storage service
 *
 * @returns A Promise that resolves to an AlwatrServiceResponse
 */
async function getSansList(): Promise<
  AlwatrServiceResponse<Record<string, SansInterface>, StringifyableRecord>
  > {
  logger.logMethod('getSansList');

  return await getSans();
}
