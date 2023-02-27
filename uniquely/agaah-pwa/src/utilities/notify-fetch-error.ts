import {snackbarSignalTrigger} from '@gecut/ui-kit/snackbar/controller.js';

import config from '../config.js';

import type {AlwatrServiceResponseFailed} from '@alwatr/type';
import type {Errors} from '../config.js';

export function notifyError(
  error: AlwatrServiceResponseFailed,
): AlwatrServiceResponseFailed {
  if (error != null) {
    const _error = (error.errorCode ?? error.message) as Errors;

    snackbarSignalTrigger.request({
      message: config.errMessage(_error),
    });
  }

  return error;
}
