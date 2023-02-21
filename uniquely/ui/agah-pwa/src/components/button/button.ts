import {
  AlwatrDummyElement,
  css,
  customElement,
  html,
  ifDefined,
  property,
  unsafeCSS,
} from '@alwatr/element';

import baseElementStyle from '../../styles/element.css?inline';
import surfaceStyle from '../../styles/surface.css?inline';

import type {LitRenderType} from '../../types/lit-render.js';

@customElement('gecut-button')
/**
 * @attr {Boolean} icon-button
 *
 * @prop {Boolean} iconButton
 */
export class Button extends AlwatrDummyElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    unsafeCSS(surfaceStyle),
    css`
      :host {
        --_surface-color-on: var(--sys-color-on-primary-hsl);
        --_surface-color-bg: var(--sys-color-primary-hsl);

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        min-width: calc(10 * var(--sys-spacing-track));
        min-height: calc(7 * var(--sys-spacing-track));
        font-weight: 700;
        font-family: var(--sys-typescale-body-large-font-family-name);
        font-size: var(--sys-typescale-body-large-font-size);
        letter-spacing: var(--sys-typescale-body-large-letter-spacing);
        line-height: normal;
        border-radius: var(--sys-radius-large);
        white-space: nowrap;
        user-select: none;
        cursor: pointer;
      }

      a {
        display: flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        padding: calc(1.5 * var(--sys-spacing-track)) var(--sys-spacing-track);
        width: 100%;
        height: 100%;
        text-decoration: none;
        color: inherit;
      }

      :host([small]) {
        min-height: calc(4 * var(--sys-spacing-track));

        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
      }

      :host([strong][small]) {
        font-family: var(--sys-typescale-body-large-font-family-name);
        font-size: var(--sys-typescale-body-large-font-size);
        letter-spacing: var(--sys-typescale-body-large-letter-spacing);
      }

      :host([icon-button]) a {
        gap: var(--sys-spacing-track);
        flex-direction: column;
        justify-content: space-between;
      }

      :host([icon-button]) .icon {
        padding: calc(3 * var(--sys-spacing-track));
        width: calc(11 * var(--sys-spacing-track));
        height: calc(11 * var(--sys-spacing-track));
        border-radius: 50%;
        background-color: #fff2;
      }

      :host([icon-button]) ::slotted(gecut-icon) {
        width: 100%;
        height: 100%;
        margin: 0;
      }

      .icon,
      .content {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      ::slotted(gecut-icon) {
        width: calc(3.5 * var(--sys-spacing-track));
        height: calc(3.5 * var(--sys-spacing-track));
        margin-inline-end: var(--sys-spacing-track);
      }
    `,
    css`
      :host([background='neutral']) {
        --_surface-color-bg: var(--sys-color-inverse-surface-hsl);
      }
      :host([background='primary']) {
        --_surface-color-bg: var(--sys-color-primary-hsl);
      }
      :host([background='secondary']) {
        --_surface-color-bg: var(--sys-color-secondary-hsl);
      }
      :host([background='tertiary']) {
        --_surface-color-bg: var(--sys-color-tertiary-hsl);
      }
      :host([background='error']) {
        --_surface-color-bg: var(--sys-color-on-error-container-hsl);
      }
    `,
    css`
      :host([text='neutral']) {
        --_surface-color-on: var(--sys-color-surface-hsl);
      }
      :host([text='primary']) {
        --_surface-color-on: var(--sys-color-primary-container-hsl);
      }
      :host([text='secondary']) {
        --_surface-color-on: var(--sys-color-secondary-container-hsl);
      }
      :host([text='tertiary']) {
        --_surface-color-on: var(--sys-color-tertiary-container-hsl);
      }
      :host([text='error']) {
        --_surface-color-on: var(--sys-color-error-container-hsl);
      }
    `,
  ];

  @property()
    href?: string;

  @property({attribute: 'icon-button', reflect: true, type: Boolean})
    iconButton = false;

  @property({reflect: true, type: Boolean})
    small = false;

  @property({reflect: true, type: Boolean})
    strong = false;

  @property({reflect: true})
    background: 'primary' | 'secondary' | 'tertiary' | 'neutral' = 'primary';

  @property({reflect: true})
    text: 'primary' | 'secondary' | 'tertiary' | 'neutral' = 'neutral';

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('stated', '');
    this.setAttribute('elevated', '3');
  }

  override render(): LitRenderType {
    super.render();

    return html`
      <a href=${ifDefined(this.href)}>
        <div class="icon">
          <slot name="icon"></slot>
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gecut-button': Button;
  }
}
