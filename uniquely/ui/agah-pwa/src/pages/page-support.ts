import {
  AlwatrDummyElement,
  css,
  html,
  customElement,
  unsafeCSS,
} from '@alwatr/element';
import callIcon from '@gecut/iconsax-cdn/broken/call-calling?raw';
import baseElementStyle from '../styles/element.css?inline';

import '../components/button/button';

import type {LitRenderType} from '../types/lit-render.js';

@customElement('page-support')
export class PageSupport extends AlwatrDummyElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    css`
      :host {
        --_box-border-size: 0.3;
        --sys-scrollbar-background: var(--sys-color-on-surface-variant);
        --sys-scrollbar-size: calc(0.5 * var(--sys-spacing-track));
        --sys-scrollbar-color: var(--sys-color-surface);

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        height: 100%;

        color: var(--sys-color-on-primary);
        gap: var(--sys-spacing-track);
        padding: 3vh calc(2 * var(--sys-spacing-track));
      }

      .box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: 100%;

        border: calc(var(--_box-border-size) * var(--sys-spacing-track)) dashed
          hsla(var(--sys-color-surface-hsl), 30%);
        border-radius: var(--sys-radius-xlarge);
      }

      .logo {
        display: flex;

        margin: calc(2 * var(--sys-spacing-track)) 0;
        max-height: calc(30 * var(--sys-spacing-track));
        height: 20vh;
        width: auto;
      }

      .title {
        margin: 0 0 var(--sys-spacing-track);

        font-weight: 800;
        font-family: var(--sys-typescale-title-large-font-family-name);
        font-size: var(--sys-typescale-title-large-font-size);
        letter-spacing: var(--sys-typescale-title-large-letter-spacing);
        line-height: var(--sys-typescale-title-large-line-height);
      }

      .description {
        margin: 0 0 var(--sys-spacing-track);

        text-align: center;
        font-weight: 300;
        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
        line-height: var(--sys-typescale-body-medium-line-height);
      }

      .icon {
        --_size: 0.4px;

        color: var(--sys-color-primary-container);

        margin: auto 0 5vh;

        min-height: calc(15 * var(--sys-spacing-track));
        min-width: calc(15 * var(--sys-spacing-track));

        max-height: calc(23 * var(--sys-spacing-track));
        max-width: calc(23 * var(--sys-spacing-track));

        height: 20vh;
        width: 20vh;
      }

      gecut-button {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        width: calc(
          2 * var(--_box-border-size) * var(--sys-spacing-track) + 100%
        );
        margin-bottom: calc(
          -1 * var(--_box-border-size) * var(--sys-spacing-track)
        );
      }

      .input-box {
        display: flex;
        align-items: center;
        align-self: stretch;
        justify-content: center;
        direction: ltr;

        text-decoration: none;
        border-radius: var(--sys-radius-large);
        box-shadow: inset 0 0 calc(0.25 * var(--sys-spacing-track))
          hsla(var(--sys-color-surface-hsl), 50%);
        padding: 0 calc(1.5 * var(--sys-spacing-track));
        margin: calc(2 * var(--sys-spacing-track))
          calc(2 * var(--sys-spacing-track)) auto;
        height: calc(8 * var(--sys-spacing-track));
        color: var(--sys-color-on-primary);
        background-color: var(--sys-color-on-primary-container);

        font-weight: 800;
        font-family: var(--sys-typescale-title-large-font-family-name);
        font-size: var(--sys-typescale-title-large-font-size);
        letter-spacing: var(--sys-typescale-title-large-letter-spacing);
      }
    `,
  ];

  override render(): LitRenderType {
    return html`
      <div class="box">
        <gecut-icon .svgContent=${callIcon} class="icon"></gecut-icon>
        <h2 class="title">پشتیبانی آگاه</h2>
        <div class="description">
          لطفا جهت امور پشتیبانی با شماره زیر تماس حاصل فرمایید
        </div>

        <a href="tel:09155595488" class="input-box">0915 559 5488</a>

        <gecut-button href="/home">
          <span>بازگشت به صفحه اصلی</span>
        </gecut-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-support': PageSupport;
  }
}
