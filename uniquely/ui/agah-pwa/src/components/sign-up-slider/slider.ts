import {AlwatrDummyElement, css, property, unsafeCSS} from '@alwatr/element';
import baseElementStyle from '../../styles/element.css?inline';

import type {UserInterface} from '../../types/user.js';

export class Slider extends AlwatrDummyElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    css`
      :host {
        display: flex;
        direction: rtl;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        flex: 1 0 auto;

        width: 100vw;
        max-width: var(--_max-mobile-size);
        max-height: calc(70 * var(--sys-spacing-track));
        gap: var(--sys-spacing-track);
        padding: 0 calc(4 * var(--sys-spacing-track));
        margin: auto 0;

        opacity: 0;
        color: var(--sys-color-on-primary);

        transition-property: opacity;
        transition-duration: var(--sys-motion-duration-small);
        transition-timing-function: var(--sys-motion-easing-in-out);
      }

      :host([active]) {
        opacity: 1;
      }

      .title-icon {
        --_size: 0.4px;

        color: var(--sys-color-primary-container);

        margin: var(--sys-spacing-track) 0;

        min-height: calc(15 * var(--sys-spacing-track));
        min-width: calc(15 * var(--sys-spacing-track));

        max-height: calc(23 * var(--sys-spacing-track));
        max-width: calc(23 * var(--sys-spacing-track));

        height: 23vh;
        width: 23vh;
      }

      .title-text {
        margin: 0;

        font-weight: 800;
        font-family: var(--sys-typescale-title-large-font-family-name);
        font-size: var(--sys-typescale-title-large-font-size);
        letter-spacing: var(--sys-typescale-title-large-letter-spacing);
        line-height: var(--sys-typescale-title-large-line-height);
      }

      .description {
        margin: 0;

        text-align: center;
        font-weight: 300;
        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
        line-height: var(--sys-typescale-body-medium-line-height);
      }

      .cards-box {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
      }

      .sans-card {
        display: flex;
        padding: calc(0.5 * var(--sys-spacing-track));
        border-radius: var(--sys-radius-large);
        border: 2px dashed transparent;

        transition-property: border-color;
        transition-duration: var(--sys-motion-duration-small);
        transition-timing-function: var(--sys-motion-easing-in-out);
      }
      .sans-card[selected] {
        border: 2px dashed var(--sys-color-surface-variant);
      }

      .input-box {
        display: flex;
        flex-direction: column;
        border-radius: var(--sys-radius-large);
        box-shadow: inset 0 0 calc(0.25 * var(--sys-spacing-track))
          var(--sys-color-surface);
        padding: 0 calc(1.5 * var(--sys-spacing-track));
        margin-top: calc(2 * var(--sys-spacing-track));
        width: 100%;
        min-height: calc(7 * var(--sys-spacing-track));
        background-color: var(--sys-color-on-primary-container);
      }
      .input-box input {
        display: flex;
        text-align: center;
        color: var(--sys-color-on-primary);
        border: none;
        background-color: transparent;
        width: 100%;
        height: calc(7 * var(--sys-spacing-track));
        outline: none;

        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-weight: var(--sys-typescale-body-medium-font-weight);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
        line-height: var(--sys-typescale-body-medium-line-height);
      }
      .input-box .separator {
        display: flex;
        width: 90%;
        height: 1px;
        margin: 0 auto;
        border: none;
        background-color: var(--sys-color-surface-variant);
      }

      .helpers {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: var(--sys-spacing-track);
      }
      .helpers li {
        color: var(--sys-color-error);

        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-weight: var(--sys-typescale-body-medium-font-weight);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
      }

      input[type='text'] {
        direction: rtl;
      }

      input[type='number'] {
        direction: ltr;
      }
    `,
  ];

  @property({attribute: false, type: Object})
    data: Partial<UserInterface> = {};

  @property({type: Boolean, reflect: true})
    active = false;

  dataItemChange<TName extends keyof UserInterface>(
    name: TName,
  ): (event: Event) => void {
    return async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const _event = new Event('change');

      /* type number */
      if (name === 'age') {
        this.data[name] = +target.value as UserInterface[TName];
      }

      /* type string */
      if (
        name === 'firstName' ||
        name === 'lastName' ||
        name === 'phone' ||
        name === 'sansCode' ||
        name === 'groupId' ||
        name === 'gender'
      ) {
        this.data[name] = String(target.value).trim() as UserInterface[TName];
      }

      if (name === 'groupId' && this.data[name] === '') {
        this.data[name] = null as UserInterface[TName];
      }

      this.dispatchEvent(_event);
      this._logger.logMethodArgs('dataItemChange', {
        name,
        'value': this.data[name],
        'type-value': typeof this.data[name],
      });
    };
  }
}
