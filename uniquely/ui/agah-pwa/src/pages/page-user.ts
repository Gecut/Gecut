import {
  AlwatrDummyElement,
  css,
  html,
  customElement,
  unsafeCSS,
} from '@alwatr/element';
import downloadIcon from '@gecut/iconsax-cdn/broken/document-download?raw';
import peopleIcon from '@gecut/iconsax-cdn/broken/people?raw';
import clockIcon from '@gecut/iconsax-cdn/broken/clock?raw';
import callIcon from '@gecut/iconsax-cdn/broken/call-calling?raw';
import messageAddIcon from '@gecut/iconsax-cdn/broken/message-add-1?raw';
import logoImage from '/images/logo.png?inline';
import iconImage from '/images/icon.png?inline';
import baseElementStyle from '../styles/element.css?inline';
import config from '../config.js';

import '@gecut/ui-kit/icon/icon.js';

import '../components/button/button';

import type {LitRenderType} from '../types/lit-render.js';

@customElement('page-user')
export class PageUser extends AlwatrDummyElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        height: 100%;

        gap: calc(1.5 * var(--sys-spacing-track));
        padding: 2vh calc(3 * var(--sys-spacing-track));

        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-weight: var(--sys-typescale-body-medium-font-weight);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
      }
      .card {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: calc(1.5 * var(--sys-spacing-track));
        overflow: hidden;
        margin-top: auto;

        box-shadow: var(--sys-surface-elevation-1);
        border-radius: var(--sys-radius-medium);
        color: var(--sys-color-surface);
        background-color: hsla(var(--sys-color-on-surface-variant-hsl), 50%);
      }
      .card.no-padding {
        padding: 0;
      }

      .card .title {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 0 calc(2 * var(--sys-spacing-track));
        color: var(--sys-color-tertiary-container);

        font-family: var(--sys-typescale-title-medium-font-family-name);
        font-weight: var(--sys-typescale-title-medium-font-weight);
        font-size: var(--sys-typescale-title-medium-font-size);
        letter-spacing: var(--sys-typescale-title-medium-letter-spacing);
      }

      .card .informations {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
      }
      .card .informations .information-large,
      .card .informations .information-small {
        display: inline-flex;
        width: max-content;
        padding: calc(0.9 * var(--sys-spacing-track))
          calc(1.5 * var(--sys-spacing-track)) var(--sys-spacing-track);
        border-bottom: 1px dashed hsla(var(--sys-color-surface-hsl), 50%);

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .card .informations .information-large {
        font-family: var(--sys-typescale-body-large-font-family-name);
        font-weight: 800;
        font-size: var(--sys-typescale-body-large-font-size);
        letter-spacing: var(--sys-typescale-body-large-letter-spacing);
      }
      .card .informations .information-small,
      .card .invite .invite-code .text,
      .card .ticket .text {
        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-weight: 700;
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
      }

      .card .invite .invite-code .code,
      .card .ticket .code {
        font-weight: 900;
        font-family: var(--sys-typescale-title-medium-font-family-name);
        font-size: var(--sys-typescale-title-medium-font-size);
        letter-spacing: var(--sys-typescale-title-medium-letter-spacing);
      }

      .card .invite {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: var(--sys-spacing-track);
      }
      .card .invite .invite-code {
        display: inline-flex;
        align-items: center;
      }
      .card .invite .invite-code .text {
        font-weight: 800;
      }
      .card .invite .invite-code .code {
        color: var(--sys-color-tertiary-container);
        text-transform: uppercase;
      }

      .card .ticket {
        display: flex;
        align-items: center;
        justify-content: center;

        margin: calc(3 * var(--sys-spacing-track)) auto
          calc(2 * var(--sys-spacing-track));
        overflow: hidden;

        border-radius: var(--sys-radius-medium);
        box-shadow: var(--sys-surface-elevation-1);
        color: var(--sys-color-on-primary);
        background-color: var(--sys-color-primary);
      }
      .card .ticket .text {
        font-weight: 800;
        padding: calc(2 * var(--sys-spacing-track)) var(--sys-spacing-track);
      }
      .card .ticket .code {
        text-transform: uppercase;
        overflow: hidden;

        padding: calc(2 * var(--sys-spacing-track));

        border-radius: var(--sys-radius-medium);
        box-shadow: var(--sys-surface-elevation-3);
        color: var(--sys-color-primary);
        background-color: var(--sys-color-on-primary);
      }

      .card .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        direction: ltr;
        gap: var(--sys-spacing-track);
        width: 100%;
        color: var(--sys-color-surface);
        opacity: 40%;
        margin: calc(1.5 * var(--sys-spacing-track)) 0;

        font-family: var(--sys-typescale-body-large-font-family-name);
        font-weight: var(--sys-typescale-body-large-font-weight);
        font-size: var(--sys-typescale-body-large-font-size);
        letter-spacing: var(--sys-typescale-body-large-letter-spacing);
      }
      .card .brand img {
        opacity: 40%;
        width: calc(6 * var(--sys-spacing-track));
      }

      .buttons {
        display: flex;
        flex-direction: column;
        gap: var(--sys-spacing-track);
        width: 100%;
      }
      .buttons .row {
        display: flex;
        gap: var(--sys-spacing-track);
      }
      .buttons .row gecut-button:first-child {
        flex-grow: 1;
      }

      .back-to-home {
        display: flex;

        margin-top: auto;
        opacity: 80%;
        color: var(--sys-color-surface);
        text-decoration: underline hsla(var(--sys-color-surface-hsl), 80%);

        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-weight: var(--sys-typescale-body-medium-font-weight);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
      }
    `,
  ];

  override render(): LitRenderType {
    return PageUser.renderInformationCard();
  }

  static renderInformationCard(): LitRenderType {
    return html`
      <div class="card no-padding">
        <div class="card">
          <h2 class="title">اطلاعات بلیط</h2>

          <div class="informations">
            <span class="information-large">مهدیار صهبایی احمدی</span>
            <span class="information-large" dir="ltr">0915 559 5488</span>
            <span class="information-small">
              رزرو شده برای سه شنبه ۳ بهمن، ساعت ۱۸:۳۰
            </span>
            <span class="information-large">
              مدت این برنامه ۹۰ دقیقه می باشد
            </span>
          </div>

          <div class="invite">
            <span class="text">کد دعوت به گروه:</span>
            <div class="invite-code">
              <span class="code">fb905</span>
              <gecut-icon class="copy"></gecut-icon>
            </div>
          </div>

          <div class="ticket">
            <span class="text">کد بلیط</span>
            <div class="code">e4590</div>
          </div>
        </div>

        <div class="brand">
          <img .src=${iconImage} alt="icon" />
          <span class="text">گروه فرهنگی آگاه</span>
        </div>
      </div>

      <div class="buttons">
        <gecut-button background="tertiary">
          <gecut-icon .svgContent=${downloadIcon} slot="icon"></gecut-icon>

          <span>دانلود بلیط</span>
        </gecut-button>

        <div class="row">
          <gecut-button background="primary">
            <gecut-icon .svgContent=${peopleIcon} slot="icon"></gecut-icon>

            <span>هم گروهی ها</span>
          </gecut-button>

          <gecut-button background="secondary">
            <gecut-icon .svgContent=${messageAddIcon} slot="icon"></gecut-icon>

            <span>دعوت دوستان</span>
          </gecut-button>
        </div>

        <div class="row">
          <gecut-button background="error">
            <gecut-icon .svgContent=${clockIcon} slot="icon"></gecut-icon>

            <span>درخواست لغو بلیط</span>
          </gecut-button>

          <gecut-button background="neutral">
            <gecut-icon .svgContent=${callIcon} slot="icon"></gecut-icon>

            <span>پشتیبانی</span>
          </gecut-button>
        </div>
      </div>
      <a href="/home" class="back-to-home"> بازگشت به صفحه اصلی </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-user': PageUser;
  }
}
