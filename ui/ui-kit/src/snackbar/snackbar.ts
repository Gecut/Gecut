import {
  html,
  css,
  customElement,
  property,
  when,
  AlwatrDummyElement,
} from '@alwatr/element';
import {untilEvent} from '@alwatr/util';

import surface from '../card/surface.js';

import type {TemplateResult} from '@alwatr/element';

@customElement('gecut-snackbar')
export class Snackbar extends AlwatrDummyElement {
  static override styles = [
    surface,
    css`
      :host {
        --_surface-color-on: var(--sys-color-inverse-on-surface-hsl);
        --_surface-color-bg: var(--sys-color-inverse-surface-hsl);

        display: flex;
        align-items: center;
        padding: var(--sys-spacing-track);
        gap: var(--sys-spacing-track);
        position: fixed;
        bottom: calc(2 * var(--sys-spacing-track));
        left: var(--sys-spacing-track);
        right: var(--sys-spacing-track);
        z-index: var(--sys-zindex-snackbar);
        border-radius: var(--sys-radius-xsmall);

        box-sizing: border-box;
        min-height: calc(6 * var(--sys-spacing-track));
        max-width: calc(
          var(--sys-breakpoint-handset) - 8 * var(--sys-spacing-track)
        );
        /* margin: 0 auto; */

        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-weight: var(--sys-typescale-body-medium-font-weight);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
        line-height: var(--sys-typescale-body-medium-line-height);
        user-select: none;

        /* close state */
        opacity: 0;
        transform: translateY(200%) scale(1);
        pointer-events: none;
        transition-property: opacity, transform;
        transition-duration: var(--sys-motion-duration-medium-out);
        transition-timing-function: var(--sys-motion-easing-exiting);
        /* will-change: opacity, transform; */
      }

      :host([opened]) {
        opacity: 1;
        transform: translateY(0px) scale(1);
        pointer-events: auto;
        transition-duration: var(--sys-motion-duration-medium);
        transition-timing-function: var(--sys-motion-easing-incoming);
      }

      :host([closing]) {
        transform: translateY(0px) scale(0.94);
      }

      .message {
        padding: 0 var(--sys-spacing-track);
        flex-grow: 1;
        flex-shrink: 1;
        white-space: pre-line;
      }

      button {
        background-color: transparent;
        color: var(--sys-color-primary);

        border: none;
        outline: none;

        cursor: pointer;
      }
    `,
  ];

  @property({type: String})
    message?: string;

  @property({type: String})
    actionLabel?: string;

  private _opened = false;

  set open(open: boolean) {
    this._logger.logProperty('open', open);
    if (this._opened === open) return;
    this._opened = open;
    this.updateComplete.then(async () => {
      if (this._opened !== open) return;
      this.toggleAttribute('opened', open);
      this.toggleAttribute('closing', !open);
      if (!open) {
        await untilEvent(this, 'transitionend');
        this.removeAttribute('closing');
      }
    });
  }
  get open(): boolean {
    return this._opened;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('elevated', '3');
  }

  override render(): TemplateResult {
    super.render();

    return html`
      <span class="message">${this.message}</span>
      ${when(
        this.actionLabel,
        () =>
          html`<button @click=${this._actionButtonClick}>
            ${this.actionLabel}
          </button>`,
      )}
    `;
  }

  protected _actionButtonClick(): void {
    this.dispatchEvent(new CustomEvent('action-button-click'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gecut-snackbar': Snackbar;
  }

  interface HTMLElementEventMap {
    'action-button-click': CustomEvent;
  }
}
