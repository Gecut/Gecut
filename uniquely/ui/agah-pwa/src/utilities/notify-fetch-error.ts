import {snackbarSignalTrigger} from '@gecut/ui-kit/snackbar/controller.js';

import config from '../config.js';

import type {Errors} from '../config.js';

export function notifyError<T extends Error>(error: T): T {
  if (error != null) {
    const _error = error.message as Errors;

    snackbarSignalTrigger.request({
      message: config.errMessage(_error),
    });
  }

  return error;
}
