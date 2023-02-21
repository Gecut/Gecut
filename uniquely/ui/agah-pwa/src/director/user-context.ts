import {serviceRequest} from '@alwatr/fetch';

import config from '../config.js';
import {userContextProvider} from '../context.js';

import {logger} from './logger.js';

import type {
  AlwatrServiceResponseSuccess,
  AlwatrServiceResponseSuccessWithMeta,
  StringifyableRecord,
} from '@alwatr/type';
import type {UserResponseData} from '../types/user.js';

export const provideUserContext = async (): Promise<void> => {
  logger.logMethod('provideUserContext');

  const userID = localStorage.getItem('user.id');
  const userToken = localStorage.getItem('user.token');

  if (userID != null && userToken != null) {
    try {
      const response = await serviceRequest<UserResponseData>({
        method: 'GET',
        url: config.api + '/user',
        queryParameters: {id: userID},
        token: userToken,
        removeDuplicate: 'until_load',
        retry: 10,
        retryDelay: 3_000,
        revalidateCallback: (response) =>
          response
            .json()
            .then(
              (
                response:
                  | AlwatrServiceResponseSuccess<UserResponseData>
                  | AlwatrServiceResponseSuccessWithMeta<
                      UserResponseData,
                      StringifyableRecord
                    >,
              ) => {
                if (response.ok === true) {
                  userContextProvider.setValue(response.data);
                }
              },
            ),
      });

      userContextProvider.setValue(response.data);
    } catch (err) {
      localStorage.removeItem('user.id');
      localStorage.removeItem('user.token');

      logger.error('provideUserContext', 'fetch_failed', err);
    }
  }
};

provideUserContext();
