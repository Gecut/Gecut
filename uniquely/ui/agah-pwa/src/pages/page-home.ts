import {
  AlwatrDummyElement,
  css,
  html,
  customElement,
  LocalizeMixin as localizeMixin,
} from '@alwatr/element';

import type {LitRenderType} from '../types/lit-render.js';

@customElement('page-home')
export class PageHome extends localizeMixin(AlwatrDummyElement) {
  static override styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        height: 100%;

        padding: calc(3 * var(--sys-spacing-track));
      }
    `,
  ];

  override render(): LitRenderType {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-home': PageHome;
  }
}
