import {
  AlwatrBaseElement,
  css,
  html,
  customElement,
  unsafeCSS,
  state,
  nothing,
} from '@alwatr/element';
import callIcon from '@gecut/iconsax-cdn/broken/call-calling?raw';
import messageAddIcon from '@gecut/iconsax-cdn/broken/message-add-1?raw';

import baseElementStyle from '../styles/element.css?inline';
import {userContextConsumer} from '../context.js';

import '../components/button/button';

import logoImage from '/images/logo.png?inline';

import type {LitRenderType} from '../types/lit-render.js';
import type {UserResponseData} from '../types/user.js';

@customElement('page-group')
export class PageGroup extends AlwatrBaseElement {
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
        color: var(--sys-color-on-primary);
      }

      .title {
        margin: 0;

        font-weight: 800;
        font-family: var(--sys-typescale-title-large-font-family-name);
        font-size: var(--sys-typescale-title-large-font-size);
        letter-spacing: var(--sys-typescale-title-large-letter-spacing);
        line-height: var(--sys-typescale-title-large-line-height);
      }

      .description {
        margin: var(--sys-spacing-track) 0;

        text-align: center;
        font-weight: 300;
        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
        line-height: var(--sys-typescale-body-medium-line-height);
      }

      .row {
        display: flex;
        width: 100%;
        gap: var(--sys-spacing-track);
        margin-top: auto;
      }
      .row gecut-button {
        flex-grow: 1;
      }

      .logo {
        display: flex;

        margin: calc(2 * var(--sys-spacing-track)) 0;
        max-height: calc(30 * var(--sys-spacing-track));
        height: 20vh;
        width: auto;
      }

      gecut-button {
        align-self: stretch;
      }

      .users {
        display: flex;
        flex-direction: column;
        gap: var(--sys-spacing-track);
        overflow-y: auto;
        width: 100%;
      }
      .user {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: calc(1.5 * var(--sys-spacing-track));
        min-height: calc(8 * var(--sys-spacing-track));
        width: 100%;
        border-radius: var(--sys-radius-medium);
        box-shadow: inset 0 0 calc(0.25 * var(--sys-spacing-track))
          hsla(var(--sys-color-surface-hsl), 40%);

        font-family: var(--sys-typescale-label-large-font-family-name);
        font-weight: var(--sys-typescale-label-large-font-weight);
        font-size: var(--sys-typescale-label-large-font-size);
      }
    `,
  ];

  @state()
  private user?: UserResponseData;

  override connectedCallback(): void {
    super.connectedCallback();

    userContextConsumer.subscribe((user) => {
      if (user != null) {
        this.user = user;
      }
    });
  }

  override render(): LitRenderType {
    return html`
      <img .src=${logoImage} class="logo" alt="logo" />

      <h1 class="title">گروه من</h1>
      <div class="description">توضیحات مربوطه</div>

      ${this.renderGroup()}

      <div class="row">
        <gecut-button strong small>
          <gecut-icon slot="icon" .svgContent=${messageAddIcon}></gecut-icon>

          <span>دعوت دوستان</span>
        </gecut-button>
        <gecut-button href="/support" background="secondary" small>
          <gecut-icon slot="icon" .svgContent=${callIcon}></gecut-icon>

          <span>تماس با پشتیبانی</span>
        </gecut-button>
      </div>
      <gecut-button href="/user" background="neutral" small>
        <span>بازگشت</span>
      </gecut-button>
    `;
  }

  private renderGroup(): LitRenderType {
    if (this.user == null || this.user.group == null) return nothing;

    const groupUsersTemplate = Object.values(this.user.group).map(
      (user) => html`
        <div class="user">
          <span class="user-name">${user.firstName} ${user.lastName}</span>
        </div>
      `,
    );

    return html`<div class="users">${groupUsersTemplate}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-group': PageGroup;
  }
}
