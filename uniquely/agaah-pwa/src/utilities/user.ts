import {serviceRequest} from '@alwatr/fetch';

import {provideUserContext} from '../director/user-context.js';
import config from '../config.js';
import {userContextProvider} from '../context.js';

import {notifyError} from './notify-fetch-error.js';

import type {StringifyableRecord} from '@alwatr/type';
import type {
  AlwatrServiceResponseSuccess,
  AlwatrServiceResponseSuccessWithMeta,
} from '@alwatr/fetch';
import type {UserInterface, UserResponseData} from '../types/user.js';

async function signUp(
  user: Partial<UserInterface>,
): Promise<
  | AlwatrServiceResponseSuccess<UserResponseData>
  | AlwatrServiceResponseSuccessWithMeta<UserResponseData, StringifyableRecord>
> {
  const response = await serviceRequest<UserResponseData>({
    url: config.api + '/authentication/sign-up',
    method: 'POST',
    bodyJson: user,
  }).catch((error) => notifyError(error));

  if (response.ok === true) {
    localStorage.setItem('user.id', response.data.id);
    localStorage.setItem('user.token', response.data.auth);
    userContextProvider.setValue(response.data);
  }

  if (response.ok === false) {
    throw new Error(response.errorCode);
  }

  return response;
}

async function logOut(): Promise<void> {
  localStorage.removeItem('user.id');
  localStorage.removeItem('user.token');

  await provideUserContext();

  userContextProvider.expire();

  await provideUserContext();
}

export const user = {
  signUp,
  logOut,
};
