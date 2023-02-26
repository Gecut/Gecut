import {
  AlwatrDummyElement,
  css,
  html,
  customElement,
  unsafeCSS,
  state,
} from '@alwatr/element';
import {redirect} from '@alwatr/router';
import * as htmlToImage from 'html-to-image';
import downloadIcon from '@gecut/iconsax-cdn/broken/document-download?raw';
import peopleIcon from '@gecut/iconsax-cdn/broken/people?raw';
import clockIcon from '@gecut/iconsax-cdn/broken/clock?raw';
import callIcon from '@gecut/iconsax-cdn/broken/call-calling?raw';
import userRemoveIcon from '@gecut/iconsax-cdn/broken/user-remove?raw';
import messageAddIcon from '@gecut/iconsax-cdn/broken/message-add-1?raw';
import copyIcon from '@gecut/iconsax-cdn/broken/copy?raw';
import copySuccessIcon from '@gecut/iconsax-cdn/broken/copy-success?raw';

import '@gecut/ui-kit/icon/icon.js';

import iconImage from '/images/icon.png?inline';

import baseElementStyle from '../styles/element.css?inline';
import {user} from '../utilities/user.js';
import {userContextConsumer} from '../context.js';
import formatPhoneNumber from '../utilities/format-number.js';

import '../components/button/button';

import type {UserResponseData} from '../types/user.js';
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
        position: relative;
        gap: calc(1.5 * var(--sys-spacing-track));
      }
      .card .invite .invite-code .text {
        white-space: nowrap;
        font-weight: 800;
      }
      .card .invite .invite-code .code {
        white-space: nowrap;
        color: var(--sys-color-tertiary-container);
        text-transform: uppercase;
      }
      .card .invite .invite-code gecut-icon {
        position: absolute;
        left: 0;
        height: calc(3 * var(--sys-spacing-track));
        width: calc(3 * var(--sys-spacing-track));
        color: var(--sys-color-tertiary-container);
        z-index: var(--sys-zindex-above);
        cursor: pointer;

        transition-property: opacity;
        transition-duration: var(--sys-motion-duration-medium);
        transition-timing-function: var(--sys-motion-easing-in-out);
      }
      .card .invite .invite-code gecut-icon[hidden] {
        opacity: 0;
      }
      .card .invite .invite-code gecut-icon.first {
        position: relative;
        z-index: 2;
      }
      .card .invite .invite-code gecut-icon.second {
        z-index: 1;
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
        position: relative;
        text-transform: uppercase;
        overflow: hidden;
        display: flex;
        align-items: center;
        white-space: nowrap;

        gap: calc(2 * var(--sys-spacing-track));
        padding: calc(2 * var(--sys-spacing-track));

        border-radius: var(--sys-radius-medium);
        box-shadow: var(--sys-surface-elevation-3);
        color: var(--sys-color-primary);
        background-color: var(--sys-color-on-primary);
      }
      .card .ticket .code gecut-icon {
        position: absolute;
        height: calc(3.5 * var(--sys-spacing-track));
        width: calc(3.5 * var(--sys-spacing-track));
        color: var(--sys-color-primary);
        z-index: var(--sys-zindex-above);
        cursor: pointer;

        transition-property: opacity;
        transition-duration: var(--sys-motion-duration-medium);
        transition-timing-function: var(--sys-motion-easing-in-out);
      }
      .card .ticket .code gecut-icon[hidden] {
        opacity: 0;
      }
      .card .ticket .code gecut-icon.first {
        position: relative;
        z-index: 2;
      }
      .card .ticket .code gecut-icon.second {
        z-index: 1;
        left: calc(2 * var(--sys-spacing-track));
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

  @state()
  private user?: UserResponseData;

  @state()
  private ticketCopySuccess = false;

  @state()
  private groupCopySuccess = false;

  private timer?: number;

  override connectedCallback(): void {
    super.connectedCallback();

    const userID = localStorage.getItem('user.id');
    const userToken = localStorage.getItem('user.token');

    userContextConsumer.subscribe((user) => {
      this.user = user;
    });

    if (userID == null || userToken == null) {
      redirect('/sign-in');
    } else {
      this.timer = setTimeout(() => {
        if (this.user == null) {
          redirect('/sign-in');
        }
      }, 3000);
    }
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    clearTimeout(this.timer);
  }

  override render(): LitRenderType {
    return html`
      ${this.renderInformationCard()} ${this.renderButtons()}
      <a href="/home" class="back-to-home"> بازگشت به صفحه اصلی </a>
    `;
  }

  static async logout(): Promise<void> {
    await user.logOut();
    redirect('/sign-in');
  }

  private renderInformationCard(): LitRenderType {
    if (!this.user) {
      return html`
        <div class="card no-padding">
          <div class="card" id="ticket">
            <h2 class="title">در حال دریافت اطلاعات...</h2>
          </div>
          <div class="brand">
            <img .src=${iconImage} alt="icon" />
            <span class="text">گروه فرهنگی آگاه</span>
          </div>
        </div>
      `;
    }

    if (!this.user.sans) {
      return html`
        <div class="card no-padding">
          <div class="card" id="ticket">
            <h2 class="title">سانسی برای شما یافت نشد</h2>
          </div>
          <div class="brand">
            <img .src=${iconImage} alt="icon" />
            <span class="text">گروه فرهنگی آگاه</span>
          </div>
        </div>
      `;
    }

    const sansDate = new Date(this.user.sans.date);

    const name = `${this.user.firstName} ${this.user.lastName}`;
    const phone = formatPhoneNumber(this.user.phone);
    const sansDateLocale = sansDate.toLocaleDateString('fa-IR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const sansTime = sansDate.toLocaleTimeString('fa-IR', {
      hour: 'numeric',
      minute: 'numeric',
    });
    const groupId = this.user.groupId;
    const ticketId = this.user.id;

    return html`
      <div class="card no-padding">
        <div class="card" id="ticket">
          <h2 class="title">اطلاعات بلیط</h2>

          <div class="informations">
            <span class="information-large">${name}</span>
            <span class="information-large" dir="ltr">${phone}</span>
            <span class="information-small">
              رزرو شده برای ${sansDateLocale}، ساعت ${sansTime}
            </span>
            <span class="information-small">
              لطفا بلیط خود را به همراه داشته باشید
            </span>
          </div>

          <div class="invite">
            <span class="text">کد دعوت به گروه:</span>
            <div class="invite-code">
              <span class="code">${groupId ?? 'ندارید'}</span>

              <gecut-icon
                .svgContent=${copyIcon}
                class="first"
                @click=${this.groupCopy(groupId)}
              ></gecut-icon>
              <gecut-icon
                .svgContent=${copySuccessIcon}
                class="second"
                ?hidden=${!this.groupCopySuccess}
              ></gecut-icon>
            </div>
          </div>

          <div class="ticket">
            <span class="text">کد بلیط</span>
            <div class="code">
              ${ticketId}

              <gecut-icon
                .svgContent=${copyIcon}
                class="first"
                @click=${this.ticketCopy(ticketId)}
              ></gecut-icon>
              <gecut-icon
                .svgContent=${copySuccessIcon}
                class="second"
                ?hidden=${!this.ticketCopySuccess}
              ></gecut-icon>
            </div>
          </div>
        </div>

        <div class="brand">
          <img .src=${iconImage} alt="icon" />
          <span class="text">گروه فرهنگی آگاه</span>
        </div>
      </div>
    `;
  }
  private renderButtons(): LitRenderType {
    if (this.user == null) return html`<div class="buttons"></div>`;

    return html`
      <div class="buttons">
        <div class="row">
          <gecut-button background="tertiary" @click=${this.downloadTicket}>
            <gecut-icon .svgContent=${downloadIcon} slot="icon"></gecut-icon>

            <span>دانلود بلیط</span>
          </gecut-button>

          <gecut-button background="error" @click=${PageUser.logout}>
            <gecut-icon .svgContent=${userRemoveIcon} slot="icon"></gecut-icon>

            <span>خروج</span>
          </gecut-button>
        </div>

        <div class="row">
          <gecut-button href="/group" background="primary">
            <gecut-icon .svgContent=${peopleIcon} slot="icon"></gecut-icon>

            <span>هم گروهی ها</span>
          </gecut-button>

          <gecut-button background="secondary">
            <gecut-icon .svgContent=${messageAddIcon} slot="icon"></gecut-icon>

            <span>دعوت دوستان</span>
          </gecut-button>
        </div>

        <div class="row">
          <gecut-button href="/support" background="error">
            <gecut-icon .svgContent=${clockIcon} slot="icon"></gecut-icon>

            <span>درخواست لغو بلیط</span>
          </gecut-button>

          <gecut-button href="/support" background="neutral">
            <gecut-icon .svgContent=${callIcon} slot="icon"></gecut-icon>

            <span>پشتیبانی</span>
          </gecut-button>
        </div>
      </div>
    `;
  }

  private groupCopy(value: string | null): (event: Event) => void {
    return async (event: Event): Promise<void> => {
      event.preventDefault();
      event.stopPropagation();

      if (this.groupCopySuccess === false && value != null) {
        await navigator.clipboard
          .write([new ClipboardItem({'text/plain': value})])
          .then(() => {
            setTimeout(() => {
              this.groupCopySuccess = false;
            }, 1000);
            this.groupCopySuccess = true;
          });
      }
    };
  }

  private ticketCopy(value: string | null): (event: Event) => void {
    return async (event: Event): Promise<void> => {
      event.preventDefault();
      event.stopPropagation();

      if (this.ticketCopySuccess === false && value != null) {
        await navigator.clipboard
          .write([new ClipboardItem({'text/plain': value})])
          .then(() => {
            setTimeout(() => {
              this.ticketCopySuccess = false;
            }, 1000);
            this.ticketCopySuccess = true;
          });
      }
    };
  }

  private downloadTicket(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const ticket = this.renderRoot.querySelector<HTMLDivElement>('#ticket');

    if (ticket) {
      htmlToImage
        .toCanvas(ticket as HTMLDivElement, {})
        .then(function(canvas) {
          const link = document.createElement('a');
          link.download = 'ticket.jpg';
          link.href = canvas.toDataURL('image/jpeg');
          link.click();
        });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-user': PageUser;
  }
}
