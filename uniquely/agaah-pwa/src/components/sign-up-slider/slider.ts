import {AlwatrBaseElement, css, property, unsafeCSS} from '@alwatr/element';

import {sansByGroupIdContextCommandTrigger} from '../../context.js';
import baseElementStyle from '../../styles/element.css?inline';
import formStyle from '../../styles/form.css?inline';

import type {SansInterface} from '../../types/sans.js';
import type {UserInterface} from '../../types/user.js';

export class Slider extends AlwatrBaseElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    unsafeCSS(formStyle),
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

        max-height: calc(20 * var(--sys-spacing-track));
        max-width: calc(20 * var(--sys-spacing-track));

        height: 18vh;
        width: 18vh;
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
        width: 100%;
      }

      .sans-card {
        display: flex;
        padding: calc(0.5 * var(--sys-spacing-track));
        border-radius: var(--sys-radius-large);
        border: 2px dashed transparent;
        min-width: 100%;

        transition-property: border-color;
        transition-duration: var(--sys-motion-duration-small);
        transition-timing-function: var(--sys-motion-easing-in-out);
      }
      .sans-card > * {
        width: 100%;
      }
      .sans-card.selected {
        border: 2px dashed var(--sys-color-surface-variant);
      }
    `,
  ];

  static sansList: Record<string, SansInterface> = {};
  static groupId: string | null = null;

  @property({attribute: false, type: Object})
    data: Partial<UserInterface> = {};

  @property({type: Boolean, reflect: true})
    active = false;

  @property({type: Boolean, reflect: true})
    disabled = false;

  dataItemChange<TName extends keyof UserInterface>(
    name: TName,
  ): (event: Event) => void {
    return async (event: Event) => {
      this._logger.logMethodArgs('dataItemChange', {
        data: this.data,
        active: this.active,
        disabled: this.disabled,
        event,
      });

      if (this.disabled === true) {
        return;
      }

      const target = event.currentTarget as HTMLInputElement;
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

      if (name === 'groupId' && this.data[name] != null) {
        Slider.groupId = this.data[name] as string;

        this.data.groupId = '';

        sansByGroupIdContextCommandTrigger
          .requestWithResponse({id: Slider.groupId})
          .then((sans) => {
            Slider.sansList = {[sans.id]: sans};

            this.data = {
              ...this.data,

              sansCode: sans.id,
              groupId: Slider.groupId,
            };

            console.log('fuck', this.data, this.data.groupId, Slider.groupId);

            this.dispatchEvent(_event);
          });
      }

      this.dispatchEvent(_event);
      this.requestUpdate('data');
    };
  }
}
