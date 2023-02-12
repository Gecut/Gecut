import {
  AlwatrDummyElement,
  css,
  html,
  customElement,
  unsafeCSS,
} from '@alwatr/element';
import userAddIcon from '@gecut/iconsax-cdn/broken/user-add?raw';
import clockIcon from '@gecut/iconsax-cdn/broken/clock?raw';
import ticketIcon from '@gecut/iconsax-cdn/broken/ticket-2?raw';
import callIcon from '@gecut/iconsax-cdn/broken/call-calling?raw';
import logoImage from '/images/logo.png?inline';
import iconImage from '/images/icon.png?inline';
import baseElementStyle from '../styles/element.css?inline';
import config from '../config.js';

import '@gecut/ui-kit/icon/icon.js';

import '../components/button/button';

import type {LitRenderType} from '../types/lit-render.js';

@customElement('page-home')
export class PageHome extends AlwatrDummyElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        height: 100%;

        gap: var(--sys-spacing-track);
        padding: 2vh calc(3 * var(--sys-spacing-track));
      }

      .buttons {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        gap: var(--sys-spacing-track);
      }
      .buttons gecut-button {
        width: 100%;
      }

      .row {
        display: flex;
        width: 100%;
        gap: var(--sys-spacing-track);
      }
      .row gecut-button {
        flex-grow: 1;
      }

      .logo {
        display: flex;

        margin: calc(2 * var(--sys-spacing-track)) 0;
        max-height: calc(40 * var(--sys-spacing-track));
        height: 35vh;
        width: auto;
      }

      .version {
        display: flex;
        align-items: center;
        justify-content: center;
        direction: ltr;
        gap: var(--sys-spacing-track);
        width: 100%;
        color: var(--sys-color-surface);
        opacity: 40%;

        font-weight: 200;
        font-family: var(--sys-typescale-title-large-font-family-name);
        font-size: var(--sys-typescale-title-large-font-size);
        line-height: var(--sys-typescale-title-large-line-height);
        letter-spacing: 2px;
      }
      .version img {
        opacity: 40%;
        width: calc(7 * var(--sys-spacing-track));
      }
    `,
  ];

  override render(): LitRenderType {
    return html`
      <img .src=${logoImage} class="logo" alt="logo" />
      <div class="buttons">
        <gecut-button href="/sign-up-details">
          <gecut-icon slot="icon" .svgContent=${userAddIcon}></gecut-icon>

          <span>ثبت نام</span>
        </gecut-button>

        <div class="row">
          <gecut-button icon-button background="neutral">
            <gecut-icon slot="icon" .svgContent=${clockIcon}></gecut-icon>

            <span>سانس اجرا</span>
          </gecut-button>

          <gecut-button icon-button background="neutral" text="tertiary">
            <gecut-icon slot="icon" .svgContent=${ticketIcon}></gecut-icon>

            <span>پیگیری بلیط</span>
          </gecut-button>
        </div>

        <gecut-button background="neutral">
          <gecut-icon slot="icon" .svgContent=${callIcon}></gecut-icon>

          <span>پشتیبانی</span>
        </gecut-button>
      </div>
      <div class="version">
        <img .src=${iconImage} alt="icon" />
        <span>v${config.version}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-home': PageHome;
  }
}
