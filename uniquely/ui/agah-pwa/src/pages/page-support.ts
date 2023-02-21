import {
  AlwatrDummyElement,
  css,
  html,
  customElement,
  unsafeCSS,
  state,
} from '@alwatr/element';
import callIcon from '@gecut/iconsax-cdn/broken/call-calling?raw';
import copyIcon from '@gecut/iconsax-cdn/broken/copy?raw';
import copySuccessIcon from '@gecut/iconsax-cdn/broken/copy-success?raw';

import baseElementStyle from '../styles/element.css?inline';
import formStyle from '../styles/form.css?inline';
import formatPhoneNumber from '../utilities/format-number.js';

import '../components/button/button';

import type {LitRenderType} from '../types/lit-render.js';

@customElement('page-support')
export class PageSupport extends AlwatrDummyElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    unsafeCSS(formStyle),
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

        max-height: calc(20 * var(--sys-spacing-track));
        max-width: calc(20 * var(--sys-spacing-track));

        height: 18vh;
        width: 18vh;
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
        margin: calc(2 * var(--sys-spacing-track))
          calc(2 * var(--sys-spacing-track)) auto;
        color: var(--sys-color-on-primary);
        background-color: var(--sys-color-on-primary-container);
        position: relative;
        width: auto;
        align-self: stretch;
        cursor: pointer;
        user-select: none;
      }
      .input-box,
      .input-box input {
        direction: ltr;
        text-decoration: none;

        font-weight: 800;
        font-family: var(--sys-typescale-title-large-font-family-name);
        font-size: var(--sys-typescale-title-large-font-size);
        letter-spacing: var(--sys-typescale-title-large-letter-spacing);
      }
      .input-box gecut-icon {
        position: absolute;
        left: calc(1.5 * var(--sys-spacing-track));
        height: calc(4 * var(--sys-spacing-track));
        width: calc(4 * var(--sys-spacing-track));
        color: var(--sys-color-tertiary-container);
        z-index: var(--sys-zindex-above);

        transition-property: opacity;
        transition-duration: var(--sys-motion-duration-medium);
        transition-timing-function: var(--sys-motion-easing-in-out);
      }
      .input-box gecut-icon[hidden] {
        opacity: 0;
      }
      .input-box gecut-icon.first {
        z-index: 2;
      }
      .input-box gecut-icon.second {
        z-index: 1;
      }
    `,
  ];

  @state()
  private supportPhone = '09155595488';

  @state()
  private copySuccess = false;

  override render(): LitRenderType {
    return html`
      <div class="box">
        <gecut-icon .svgContent=${callIcon} class="icon"></gecut-icon>

        <h2 class="title">پشتیبانی آگاه</h2>
        <div class="description">
          لطفا جهت امور پشتیبانی با شماره زیر تماس حاصل فرمایید
        </div>

        <a href="tel:09155595488" class="input-box">
          <gecut-icon
            .svgContent=${copyIcon}
            class="first"
            @click=${this.copySupportPhone}
          ></gecut-icon>
          <gecut-icon
            .svgContent=${copySuccessIcon}
            class="second"
            ?hidden=${!this.copySuccess}
          ></gecut-icon>

          <input
            type="text"
            .value=${formatPhoneNumber(this.supportPhone)}
            readonly
          />
        </a>

        <gecut-button href="/home">
          <span>بازگشت به صفحه اصلی</span>
        </gecut-button>
      </div>
    `;
  }

  private copySupportPhone(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();

    navigator.clipboard.writeText(this.supportPhone).then(() => {
      this.copySuccess = true;

      setTimeout(() => {
        this.copySuccess = false;
      }, 1000);
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-support': PageSupport;
  }
}
