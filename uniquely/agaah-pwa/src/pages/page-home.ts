import {
  AlwatrBaseElement,
  css,
  html,
  customElement,
  unsafeCSS,
  state,
} from '@alwatr/element';
import userAddIcon from '@gecut/iconsax-cdn/broken/user-add?raw';
import clockIcon from '@gecut/iconsax-cdn/broken/clock?raw';
import ticketIcon from '@gecut/iconsax-cdn/broken/ticket-2?raw';
import callIcon from '@gecut/iconsax-cdn/broken/call-calling?raw';
import refreshIcon from '@gecut/iconsax-cdn/broken/refresh-2?raw';

import logoImage from '/images/logo.png?inline';
import iconImage from '/images/icon.webp?inline';

import baseElementStyle from '../styles/element.css?inline';
import config from '../config.js';
import {userContextConsumer} from '../context.js';

import '@gecut/ui-kit/icon/icon.js';

import '../components/button/button';

import type {UserResponseData} from '../types/user.js';
import type {LitRenderType} from '../types/lit-render.js';

@customElement('page-home')
export class PageHome extends AlwatrBaseElement {
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

      gecut-icon[hidden] {
        display: none;
      }
      gecut-icon.loader {
        animation: rotate-center 1000ms linear infinite both;
      }

      .buttons {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: auto;
        gap: var(--sys-spacing-track);
      }
      .buttons gecut-button {
        width: 100%;
      }
      gecut-button[hidden] {
        display: none;
      }

      .row {
        display: flex;
        width: 100%;
        gap: var(--sys-spacing-track);
      }
      .row gecut-button {
        flex-grow: 1;
      }
      .row[hidden] {
        display: none;
      }

      .logo {
        display: flex;

        margin: auto;

        padding: calc(2 * var(--sys-spacing-track)) 0;
        max-height: calc(30 * var(--sys-spacing-track));
        height: 30vh;
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
        user-select: none;

        font-weight: 200;
        font-family: var(--sys-typescale-label-large-font-family-name);
        font-size: var(--sys-typescale-label-large-font-size);
        line-height: var(--sys-typescale-label-large-line-height);
        letter-spacing: 2px;
      }
      .version img {
        opacity: 40%;
        width: calc(5 * var(--sys-spacing-track));
      }

      @keyframes rotate-center {
        0% {
          transform: rotate(0);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ];

  @state()
  private user?: UserResponseData;

  override connectedCallback(): void {
    super.connectedCallback();

    userContextConsumer.subscribe((_user) => {
      if (_user != null) {
        this.user = _user;
      }
    });
  }

  override render(): LitRenderType {
    return html`
      <img .src=${logoImage} class="logo" alt="logo" />
      <div class="buttons">
        <gecut-button
          href="/sign-up-details"
          ?disabled=${this.loading}
          ?hidden=${this.user != null}
        >
          <gecut-icon
            slot="icon"
            .svgContent=${userAddIcon}
            ?hidden=${this.loading}
          ></gecut-icon>
          <gecut-icon
            slot="icon"
            class="loader"
            .svgContent=${refreshIcon}
            ?hidden=${!this.loading}
          ></gecut-icon>

          <span>ثبت نام</span>
        </gecut-button>
        <gecut-button background="tertiary" ?hidden=${this.user == null}>
          <span> ${this.user?.firstName} ${this.user?.lastName} </span>
        </gecut-button>

        <div
          class="row"
          ?hidden=${!(this.user != null && this.user.role === 'admin')}
        >
          <gecut-button href="/admin-user-list" background="secondary">
            <span> کاربران </span>
          </gecut-button>
          <gecut-button href="/admin-sans-list" background="secondary">
            <span> سانس ها </span>
          </gecut-button>
        </div>

        <div class="row">
          <gecut-button href="/sans-list" icon-button background="neutral">
            <gecut-icon slot="icon" .svgContent=${clockIcon}></gecut-icon>

            <span>سانس اجرا</span>
          </gecut-button>

          <gecut-button
            href="/user"
            icon-button
            background="neutral"
            text="tertiary"
          >
            <gecut-icon slot="icon" .svgContent=${ticketIcon}></gecut-icon>

            <span>پیگیری بلیط</span>
          </gecut-button>
        </div>

        <gecut-button href="/support" background="neutral">
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

  private get loading(): boolean {
    const userID = localStorage.getItem('user.id');
    const userToken = localStorage.getItem('user.token');

    return userID != null && userToken != null && this.user == null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-home': PageHome;
  }
}
