import {createLogger} from '@alwatr/logger';
import {clamp} from '@alwatr/math';
import {commandHandler, commandTrigger} from '@alwatr/signal';

import '@gecut/ui-kit/snackbar/snackbar.js';

import type {SnackbarOptions, SnackbarResponse} from './type.js';

const logger = createLogger('gecut-snackbar-controller');
const paintDelay = 60;
let closeLastSnackbar: ((response: SnackbarResponse) => void) | null = null;

commandHandler.define<SnackbarOptions, SnackbarResponse>(
  'show-snackbar-command',
  (options) => {
    if (options.duration === -1 && !options.actionLabel) {
      delete options.duration;
    }
    logger.logMethodArgs('showSnackbar', options);
    return new Promise((resolve) => {
      const element = document.body.appendChild(
        document.createElement('gecut-snackbar'),
      );

      let closed = false;
      const _closeSnackbar = (response: SnackbarResponse): void => {
        // return if element closed
        if (closed) return;

        // WTF ??
        if (response.actionButton !== true && options.duration === -1) return;

        logger.logMethodArgs('closeSnackbar', response);
        closed = true;
        closeLastSnackbar = null;

        // start exit animation
        element.open = false;

        // return snackbar response (actionButton)
        resolve(response);

        // remove element after exit animation
        setTimeout(() => {
          element.remove();
        }, 500);
      };

      element.message = options.message;

      if (options.actionLabel != null) {
        element.actionLabel = options.actionLabel;
        element.addEventListener(
          'action-button-click',
          () => _closeSnackbar?.({actionButton: true}),
          {once: true},
        );
      }

      setTimeout(() => {
        requestAnimationFrame(() => {
          element.open = true;

          closeLastSnackbar?.({});
          closeLastSnackbar = _closeSnackbar;

          if (options.duration !== -1) {
            setTimeout(
              () => _closeSnackbar?.({}),
              clamp(options.duration ?? 5_000, 4_000, 10_000),
            );
          }
        });
      }, paintDelay);
    });
  },
);

/**
 * Show snackbar with optional action.
 *
 * Example:
 *
 * Simple toast:
 * ```ts
 * snackbarSignalTrigger.request({message: 'Form submitted successfully.'});
 * ```
 *
 * With action label:
 * ```ts
 * const response = await snackbarSignalTrigger.requestWithResponse({
 *   message: 'Email archived.',
 *   actionLabel: 'Undo',
 * });
 * if (response.actionClicked) {
 *   // undo...
 * }
 * ```
 */
export const snackbarSignalTrigger = commandTrigger.bind<
  SnackbarOptions,
  SnackbarResponse
>('show-snackbar-command');
