import {
  AlwatrBaseElement,
  css,
  customElement,
  html,
  property,
  query,
  unsafeCSS,
} from '@alwatr/element';

import baseElementStyle from '../../styles/element.css?inline';
import surfaceStyle from '../../styles/surface.css?inline';

import checkIcon from './checkmark-outline.svg?raw';

import type {PropertyValues} from '@alwatr/element';
import type {LitRenderType} from '../../types/lit-render.js';

@customElement('gecut-checkbox')
export class Checkbox extends AlwatrBaseElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    unsafeCSS(surfaceStyle),
    css`
      :host {
        --_surface-elevation: var(--sys-surface-elevation-0) !important;
        --_surface-color-on: var(--sys-color-surface-variant-hsl);
        --_surface-color-bg: var(--sys-color-surface-variant-hsl);

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        flex: 0 0 auto;
        width: calc(4 * var(--sys-spacing-track));
        height: calc(4 * var(--sys-spacing-track));
        border-radius: var(--sys-radius-medium);
        white-space: nowrap;
        user-select: none;
        cursor: pointer;
        font-size: calc(3.3 * var(--sys-spacing-track));

        transition-property: background-color, color;
        transition-duration: var(--sys-motion-duration-small);
        transition-timing-function: var(--sys-motion-easing-in-out);
      }

      :host([checked]) {
        --_surface-color-on: var(--sys-color-surface-hsl);
        --_surface-color-bg: var(--sys-color-primary-hsl);
      }

      :host([disabled]) {
        pointer-events: none;
        opacity: 0.38;
      }

      input {
        appearance: none;
        outline: none;
        margin: 0;
      }
    `,
  ];

  @property({reflect: true, type: Boolean})
    checked = false;

  @property({reflect: true, type: Boolean})
    disabled = false;

  @property({type: String})
    name = '';

  @query('input', true)
    inputElement?: HTMLInputElement;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('stated', '');
  }

  override render(): LitRenderType {
    super.render();

    return html`
      <gecut-icon .svgContent=${checkIcon}></gecut-icon>
      <input
        type="checkbox"
        name=${this.name}
        .checked=${this.checked}
        ?disabled=${this.disabled}
        @change=${this.handleChange}
      />
    `;
  }

  override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    this.addEventListener('click', () => {
      const event = new MouseEvent('click', {bubbles: true});
      this.inputElement?.dispatchEvent(event);
    });
  }

  private handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const _event = new CustomEvent('change', {
      detail: {checked: target.checked},
    });

    this.checked = target.checked;
    this.dispatchEvent(_event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gecut-checkbox': Checkbox;
  }
}
