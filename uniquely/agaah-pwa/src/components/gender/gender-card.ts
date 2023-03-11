import {
  AlwatrBaseElement,
  css,
  customElement,
  html,
  nothing,
  property,
  unsafeCSS,
} from '@alwatr/element';

import baseElementStyle from '../../styles/element.css?inline';

import maleIcon from '/icons/gender/man-outline.svg?raw';
import femaleIcon from '/icons/gender/woman-outline.svg?raw';

import type {Gender} from '../../types/user.js';
import type {LitRenderType} from '../../types/lit-render.js';

@customElement('gecut-gender-card')
export class GenderCard extends AlwatrBaseElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    css`
      :host {
        --_surface-color-on: var(--sys-color-primary-container-hsl);
        --_surface-color-bg: var(--sys-color-on-primary-container-hsl);

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0;
        border-radius: var(--sys-radius-medium);
        user-select: none;
        overflow: hidden;
        cursor: pointer;

        color: hsla(var(--_surface-color-on), 30%);
        background-color: hsl(var(--_surface-color-bg));

        border: calc(0.25 * var(--sys-spacing-track)) solid
          hsla(var(--_surface-color-on), 30%);

        font-size: calc(8 * var(--sys-spacing-track));
        margin: calc(0.5 * var(--sys-spacing-track));
        width: calc(12 * var(--sys-spacing-track));
        height: calc(12 * var(--sys-spacing-track));

        transition-property: border-color, color;
        transition-duration: var(--sys-motion-duration-medium);
        transition-timing-function: var(--sys-motion-easing-in-out);
      }

      :host([selected]) {
        color: var(--_surface-color-on);
        border: calc(0.25 * var(--sys-spacing-track)) solid
          hsla(var(--_surface-color-on), 100%);
      }
    `,
  ];

  @property({type: String})
    value: Gender = 'unknown';

  @property({type: Boolean, reflect: true})
    selected = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('stated', '');
    this.setAttribute('elevated', '3');
  }

  override render(): LitRenderType {
    super.render();

    const icon = this.value === 'male' ? maleIcon : femaleIcon;

    if (this.value === 'male' || this.value === 'female') {
      return html`<gecut-icon .svgContent=${icon}></gecut-icon>`;
    }

    return nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gecut-gender-card': GenderCard;
  }
}
