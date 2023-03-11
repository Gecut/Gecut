import {contextConsumer, commandTrigger, contextProvider} from '@alwatr/signal';

import type {AlwatrDocumentStorage} from '@alwatr/type';
import type {UserResponseData} from './types/user.js';
import type {SansInterface} from './types/sans.js';

export const sansStorageContextConsumer = contextConsumer.bind<
  AlwatrDocumentStorage<SansInterface>
>('sans-storage-context');

export const userContextProvider =
  contextProvider.bind<UserResponseData>('user-context');
export const userContextConsumer = contextConsumer.bind<UserResponseData>(
  userContextProvider.id,
);

export const sansByGroupIdContextCommandTrigger = commandTrigger.bind<
  {id: string},
  SansInterface
>('sans-by-group-id-context');
