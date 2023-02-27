import {
  AlwatrDummyElement,
  css,
  html,
  customElement,
  unsafeCSS,
  state,
} from '@alwatr/element';

import baseElementStyle from '../styles/element.css?inline';

import logoImage from '/images/logo.png?inline';

import {sansStorageContextConsumer} from '../context.js';

import '../components/button/button';

import type {SansInterface} from '../types/sans.js';
import type {LitRenderType} from '../types/lit-render.js';

@customElement('page-sans-list')
export class PageSansList extends AlwatrDummyElement {
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

      .sans-box {
        display: flex;
        flex-direction: column;
        align-self: stretch;
        overflow: auto;
        flex: 1 1 auto;
        margin: calc(var(--sys-scrollbar-size) + var(--sys-spacing-track));
      }

      .sans-list {
        display: flex;
        flex-direction: column;
        gap: var(--sys-spacing-track);
        padding: var(--sys-spacing-track);
        height: max-content;
      }

      .sans-box::-webkit-scrollbar {
        width: var(--sys-scrollbar-size);
        height: var(--sys-scrollbar-size);
      }
      .sans-box::-webkit-scrollbar-corner,
      .sans-box::-webkit-scrollbar-track {
        background-color: var(--sys-scrollbar-background);
        border-radius: var(--sys-scrollbar-radius);
      }
      .sans-box::-webkit-scrollbar-thumb {
        background-color: var(--sys-scrollbar-color);
        border-radius: var(--sys-scrollbar-radius);
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
    `,
  ];

  @state()
  private sansList: Record<string, SansInterface> = {};

  override connectedCallback(): void {
    super.connectedCallback();

    sansStorageContextConsumer.subscribe((sansStorage) => {
      this.sansList = sansStorage.data;
    });
  }

  override render(): LitRenderType {
    const sansListTemplate = Object.values(this.sansList).map(
      (sans) =>
        html`<gecut-sans-card
          .sans=${sans}
          .value=${sans.id}
        ></gecut-sans-card>`,
    );

    return html`
      <div class="box">
        <img .src=${logoImage} class="logo" alt="logo" />
        <h2 class="title">اطلاعات سانس های برنامه</h2>

        <div class="sans-box">
          <div class="sans-list">${sansListTemplate}</div>
        </div>

        <gecut-button href="/home">
          <span>بازگشت به صفحه اصلی</span>
        </gecut-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-sans-list': PageSansList;
  }
}
