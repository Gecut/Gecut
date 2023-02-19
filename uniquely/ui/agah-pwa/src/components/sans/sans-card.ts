import {
  AlwatrSmartElement,
  css,
  customElement,
  html,
  LocalizeMixin as localizeMixin,
  property,
  unsafeCSS,
} from '@alwatr/element';

import maleIcon from '/icons/gender/man-outline.svg?raw';
import femaleIcon from '/icons/gender/woman-outline.svg?raw';

import baseElementStyle from '../../styles/element.css?inline';

import type {SansInterface} from '../../types/sans.js';
import type {LitRenderType} from '../../types/lit-render.js';

@customElement('gecut-sans-card')
export class SansCard extends localizeMixin(AlwatrSmartElement) {
  static override styles = [
    unsafeCSS(baseElementStyle),
    css`
      :host {
        --_surface-color-on: var(--sys-color-secondary-hsl);
        --_surface-color-bg: var(--sys-color-on-secondary-hsl);

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

      :host([disabled]) {
        pointer-events: none;
        box-shadow: var(--sys-surface-elevation-0) !important;
        opacity: var(--sys-surface-disabled-opacity);
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

      .gender {
        display: flex;
        height: 100%;
        position: absolute;
        right: 0;
        padding: calc(1.5 * var(--sys-spacing-track));
        font-size: calc(4 * var(--sys-spacing-track));
        border-radius: var(--sys-radius-medium) 0 0 var(--sys-radius-medium);

        color: var(--sys-color-on-tertiary);
        background: var(--sys-color-tertiary);

        box-shadow: var(--sys-surface-elevation-4);
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
        position: relative;
        flex-grow: 1;
        color: var(--sys-color-on-secondary);
        background-color: var(--sys-color-secondary);
        padding: var(--sys-spacing-track);
        min-height: calc(7 * var(--sys-spacing-track));
        box-shadow: var(--sys-surface-elevation-4);
        width: 100%;
        overflow: hidden;

        font-family: var(--sys-typescale-body-large-font-family-name);
        font-weight: var(--sys-typescale-body-large-font-weight);
        font-size: var(--sys-typescale-body-large-font-size);
      }
    `,
  ];

  @property({attribute: false, type: Object})
    sans?: SansInterface;

  @property({type: String})
    value = '';

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('stated', '');
    this.setAttribute('elevated', '3');
  }

  override render(): LitRenderType {
    super.render();

    if (this.sans == null) return html``;

    const date = new Date(this.sans.date);

    const timeLocale = date.toLocaleTimeString('fa-IR', {
      hour: 'numeric',
      minute: 'numeric',
    });
    const dateLocale = date.toLocaleDateString('fa-IR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const capacityLocale =
      this.sans.hallCapacityNumber?.toLocaleString('fa-iR');

    return html`
      <span class="time">${timeLocale}</span>
      <div class="date">
        <div class="gender">
          <gecut-icon
            .svgContent=${this.sans.gender === 'male' ? maleIcon : femaleIcon}
          ></gecut-icon>
        </div>
        ${dateLocale}
      </div>
      <span class="capacity">ظرفیت ${capacityLocale} نفر</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gecut-sans-card': SansCard;
  }
}
