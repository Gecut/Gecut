import {serviceRequest} from '@alwatr/fetch';

import {provideUserContext} from '../director/user-context.js';
import config from '../config.js';
import {userContextProvider} from '../context.js';

import type {UserInterface, UserResponseData} from '../types/user.js';

async function signUp(user: Partial<UserInterface>): Promise<UserResponseData> {
  const response = await serviceRequest<UserResponseData>({
    url: config.api + '/authentication/sign-up',
    method: 'POST',
    bodyJson: user,
  });

  if (response.ok === true) {
    localStorage.setItem('user.id', response.data.id);
    localStorage.setItem('user.token', response.data.auth);
    userContextProvider.setValue(response.data);
  }

  return response.data;
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
