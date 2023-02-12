import {
  AlwatrDummyElement,
  css,
  customElement,
  html,
  property,
  unsafeCSS,
} from '@alwatr/element';
import baseElementStyle from '../../styles/element.css?inline';

import type {UserInterface} from '../../types/user.js';
import type {LitRenderType} from '../../types/lit-render.js';

@customElement('gecut-sans-card')
export class SansCard extends AlwatrDummyElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    css`
      :host {
        --_surface-color-bg: var(--sys-color-primary-container-hsl);
        --_surface-color-on: var(--sys-color-on-primary-container-hsl);

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0;
        border-radius: var(--sys-radius-medium);
        color: hsl(var(--_surface-color-on));
        background-color: hsl(var(--_surface-color-bg));
        user-select: none;
        overflow: hidden;
        cursor: pointer;
      }

      .capacity,
      .time {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: calc(0.5 * var(--sys-spacing-track));
        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-weight: var(--sys-typescale-body-medium-font-weight);
        font-size: var(--sys-typescale-body-medium-font-size);
        overflow: hidden;
      }

      .time {
        font-family: var(--sys-typescale-body-large-font-family-name);
        font-weight: var(--sys-typescale-body-large-font-weight);
        font-size: var(--sys-typescale-body-large-font-size);
      }

      .date {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        color: var(--sys-color-primary-container);
        background-color: var(--sys-color-on-primary-container);
        padding: var(--sys-spacing-track);
        min-height: calc(7 * var(--sys-spacing-track));
        box-shadow: var(--sys-surface-elevation-4);

        font-family: var(--sys-typescale-body-large-font-family-name);
        font-weight: var(--sys-typescale-body-large-font-weight);
        font-size: var(--sys-typescale-body-large-font-size);
      }
    `,
  ];

  @property({attribute: false, type: Object})
    sans: Partial<UserInterface> = {};

  @property({type: String})
    value = '';

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('stated', '');
    this.setAttribute('elevated', '3');
  }

  override render(): LitRenderType {
    super.render();

    return html`
      <span class="time">18:30</span>
      <div class="date">یکشنبه ۱۳ بهمن</div>
      <span class="capacity">ظرفیت ۱۳ نفر</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gecut-sans-card': SansCard;
  }
}
