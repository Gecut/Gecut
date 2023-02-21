import {AlwatrStorageClient} from '@alwatr/storage-client';

import {config} from '../config.js';

import type {AlwatrDocumentObject} from '@alwatr/type';

export const storageClient: AlwatrStorageClient<AlwatrDocumentObject> =
  new AlwatrStorageClient(config.storage);
