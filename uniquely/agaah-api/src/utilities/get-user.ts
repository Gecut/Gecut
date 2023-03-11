import {storageClient} from '../libraries/storage.js';

import getSans from './get-sans.js';

import type {AlwatrServiceResponse, StringifyableRecord} from '@alwatr/type';
import type {UserInterface, UserResponseData} from '../types/user.js';

export default async function getUser(
  user: UserInterface,
): Promise<AlwatrServiceResponse<UserResponseData, StringifyableRecord>> {
  try {
    const sansList = await getSans();

    const group = await storageClient.getStorage<UserInterface>('user');

    group.data = Object.fromEntries(
      Object.values(group.data)
        .filter((_user) => _user.groupId === user.groupId)
        .map((user: Partial<UserInterface>) => {
          delete user.auth;
          return [user.id, user as Omit<UserInterface, 'auth'>];
        }),
    );

    const sansKey =
      user.sansCode != null ?
        Object.keys(sansList.data).find(
          (sansKey) => sansKey === user.sansCode,
        ) ?? null :
        null;

    return {
      ok: true,
      data: {
        ...user,
        group: group.data,
        sans: sansKey != null ? sansList.data[sansKey] : null,
      },
    };
  } catch (_err) {
    const err = _err as Error;

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
