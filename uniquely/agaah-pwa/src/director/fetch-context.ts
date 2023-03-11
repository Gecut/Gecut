import {serviceRequest} from '@alwatr/fetch';
import {contextProvider} from '@alwatr/signal';

import {logger} from './logger.js';

import type {FetchOptions} from '@alwatr/fetch';
import type {DispatchOptions} from '@alwatr/signal/type.js';

const cacheSupported = 'caches' in globalThis;

export async function fetchContext(
  contextName: string,
  fetchOption: FetchOptions,
  dispatchOptions?: Partial<DispatchOptions>,
): Promise<void> {
  logger.logMethodArgs('fetchContext', {contextName});

  if (cacheSupported && contextProvider.getValue(contextName) == null) {
    try {
      fetchOption.cacheStrategy = 'cache_only';
      const response = await serviceRequest(fetchOption);
      contextProvider.setValue<typeof response>(
        contextName,
        response,
        dispatchOptions,
      );
    } catch (err) {
      if ((err as Error).message === 'fetch_cache_not_found') {
        logger.logOther('fetchContext:', 'fetch_cache_not_found');
      } else {
        logger.error('fetchContext', 'fetch_failed', err);
        throw err;
      }
    }
  }

  try {
    fetchOption.cacheStrategy = 'update_cache';
    const response = await serviceRequest(fetchOption);
    if (
      response.meta?.lastUpdated === undefined || // skip lastUpdated check
      response.meta?.lastUpdated !==
        contextProvider.getValue<typeof response>(contextName)?.meta
          ?.lastUpdated
    ) {
      logger.logOther(
        'fetchContext:',
        'contextProvider.setValue(new-received-context)',
        {contextName},
      );
      contextProvider.setValue<typeof response>(
        contextName,
        response,
        dispatchOptions,
      );
    }
  } catch (err) {
    logger.error('fetchContext', 'fetch_failed', err);
    throw err;
  }
}
