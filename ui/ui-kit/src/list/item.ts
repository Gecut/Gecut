import {
  AlwatrBaseElement,
  css,
  customElement,
  html,
  nothing,
  property,
} from '@alwatr/element';

import '@gecut/ui-kit/icon/icon.js';

import surface from '../card/surface.js';

import type {ItemData} from './type.js';
import type {TemplateResult, PropertyDeclaration} from '@alwatr/element';

function isString(str?: string): boolean {
  if (str == null || str.trim() == '') return false;

  return true;
}

@customElement('gecut-item')
export class Item extends AlwatrBaseElement {
  static override styles = [
    surface,
    css`
      * {
        box-sizing: border-box;
      }

      :host {
        --_surface-color-on: var(--sys-color-on-surface-hsl);
        --_surface-color-bg: var(--sys-color-surface-hsl);

        display: flex;
        align-items: center;
        justify-content: center;

        padding-top: var(--sys-spacing-track);
        padding-bottom: var(--sys-spacing-track);
        padding-inline-start: calc(2 * var(--sys-spacing-track));
        padding-inline-end: calc(3 * var(--sys-spacing-track));

        width: 100%;
        min-height: calc(9 * var(--sys-spacing-track));

        user-select: none;
        border-radius: 0;
      }

      .gecut-item {
        display: flex;
        width: 100%;

        list-style: none;
      }

      .gecut-item__body {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .gecut-item__headline {
        margin: 0;

        white-space: nowrap;
        text-overflow: ellipsis;

        color: var(--sys-color-on-surface);

        font-family: var(--sys-typescale-body-large-font-family-name);
        font-weight: var(--sys-typescale-body-large-font-weight);
        font-size: var(--sys-typescale-body-large-font-size);
        letter-spacing: var(--sys-typescale-body-large-letter-spacing);
        line-height: var(--sys-typescale-body-large-line-height);
      }

      .gecut-item__supporting-text {
        color: var(--sys-color-on-surface-variant);

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-weight: var(--sys-typescale-body-medium-font-weight);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
        line-height: var(--sys-typescale-body-medium-line-height);
      }
      .gecut-item__supporting-text.gecut-item__supporting-text-multi-line {
        white-space: wrap;
        text-overflow: ellipsis;
      }

      .gecut-item__leading__icon,
      .gecut-item__leading__avatar,
      .gecut-item__leading__media {
        flex-shrink: 0;
      }

      .gecut-item__leading__icon {
        width: calc(3 * var(--sys-spacing-track));
        height: calc(3 * var(--sys-spacing-track));

        margin-top: 2px;
        margin-bottom: auto;
        margin-inline-start: 0;
        margin-inline-end: 16px;
      }

      .gecut-item__leading__avatar {
        display: flex;
        align-items: center;
        justify-content: center;

        overflow: hidden;
        border-radius: 50%;
        width: calc(5 * var(--sys-spacing-track));
        height: calc(5 * var(--sys-spacing-track));
        margin: 2px 0;
        margin-inline-end: calc(2 * var(--sys-spacing-track));

        color: var(--sys-color-on-primary-container);
        background-color: var(--sys-color-primary-container);
      }
      .gecut-item__leading__avatar img,
      .gecut-item__leading__media img {
        width: 100%;
        height: auto;
      }

      .gecut-item__leading__avatar.gecut-item__leading__avatar-text {
        text-transform: uppercase;

        font-family: var(--sys-typescale-title-medium-font-family-name);
        font-weight: var(--sys-typescale-title-medium-font-weight);
        font-size: var(--sys-typescale-title-medium-font-size);
        letter-spacing: var(--sys-typescale-title-medium-letter-spacing);
      }

      .gecut-item__leading__media {
        display: flex;
        align-items: center;
        justify-content: center;

        overflow: hidden;
        border-radius: var(--sys-radius-xsmall);
        width: calc(7 * var(--sys-spacing-track));
        height: calc(7 * var(--sys-spacing-track));
        margin-inline-end: calc(2 * var(--sys-spacing-track));

        color: var(--sys-color-on-primary-container);
        background-color: var(--sys-color-primary-container);
      }

      :host([dragging]) {
        box-shadow: var(--sys-surface-elevation-5);
        border-radius: var(--sys-radius-medium);
      }
    `,
  ];

  @property({type: Object, attribute: false})
    data?: ItemData;

  @property({type: Boolean, reflect: true})
    dragging = false;

  private events: NonNullable<ItemData['events']> = {};

  override render(): TemplateResult {
    super.render();

    const supportingTextMultiLine =
      this.data?.supportingTextMultiLine === true ?
        'gecut-item__supporting-text-multi-line' :
        '';

    return this.renderItem(
      html`
        ${this.renderItemLeading()}

        <div class="gecut-item__body">
          <h3 class="gecut-item__headline">${this.data?.headline}</h3>
          <span class="gecut-item__supporting-text ${supportingTextMultiLine}">
            ${this.data?.supportingText}
          </span>
        </div>

        ${this.renderItemTrailing()}
      `,
    );
  }

  override requestUpdate(
    name?: PropertyKey | undefined,
    oldValue?: unknown,
    options?: PropertyDeclaration<unknown, unknown> | undefined,
  ): void {
    super.requestUpdate(name, oldValue, options);

    if (name === 'data' && this.data?.href != null) {
      this.setAttribute('stated', '');
    }

    if (name === 'data' && this.data?.events != null) {
      for (const [eventName, event] of Object.entries(this.events)) {
        this.removeEventListener(eventName, event);
      }

      this.events = {};

      for (const [eventName, event] of Object.entries(this.data.events)) {
        this.addEventListener(eventName, event);

        this.events[eventName as keyof HTMLElementEventMap] = event;
      }
    }
  }

  private renderItem(slots: TemplateResult): TemplateResult {
    if (this.data != null && isString(this.data?.href)) {
      return html`
        <a class="gecut-item gecut-link-item" href=${this.data.href}>
          ${slots}
        </a>
      `;
    }

    return html`<li class="gecut-item">${slots}</li>`;
  }
  private renderItemLeading(): TemplateResult | typeof nothing {
    if (this.data == null || this.data.leading == null) return nothing;

    if (this.data.leading.type === 'icon') {
      return html`
        <gecut-icon
          class="gecut-item__leading__icon"
          .svgContent=${this.data.leading.icon}
        ></gecut-icon>
      `;
    }

    if (this.data.leading.type === 'avatar-text') {
      return html`
        <div
          class="gecut-item__leading__avatar gecut-item__leading__avatar-text"
        >
          ${this.data.leading.text}
        </div>
      `;
    }

    if (
      this.data.leading.type === 'avatar' ||
      this.data.leading.type === 'media'
    ) {
      return html`
        <div class="gecut-item__leading__${this.data.leading.type}">
          <img .src=${this.data.leading.source} alt=${this.data.headline} />
        </div>
      `;
    }

    return nothing;
  }
  private renderItemTrailing(): TemplateResult | typeof nothing {
    if (this.data == null || this.data.trailing == null) return nothing;

    if (this.data.trailing.type === 'icon') {
      return html`
        <gecut-icon
          class="gecut-item__trailing__icon"
          .svgContent=${this.data.trailing.icon}
        ></gecut-icon>
      `;
    }

    if (this.data.trailing.type === 'text') {
      return html`
        <span class="gecut-item__trailing__text">
          ${this.data.trailing.text}
        </span>
      `;
    }

    return nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gecut-item': Item;
  }
}
