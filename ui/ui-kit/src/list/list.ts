import {
  AlwatrDummyElement,
  css,
  customElement,
  html,
  property,
  repeat,
} from '@alwatr/element';
import {clamp} from '@alwatr/math';
import {untilNextFrame, delay} from '@alwatr/util';

import surface from '../card/surface.js';

import type {Item} from './item.js';
import type {ItemData} from './type.js';
import type {TemplateResult, PropertyValues} from '@alwatr/element';

@customElement('gecut-list')
export class List extends AlwatrDummyElement {
  static override styles = [
    surface,
    css`
      * {
        box-sizing: border-box;
      }

      :host {
        --_surface-tint-opacity: 0 !important;
        --_surface-state-opacity: 0 !important;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: var(--sys-radius-medium);
        padding: calc(0.5 * var(--sys-spacing-track));
      }

      .list {
        --sys-scrollbar-size: calc(0.5 * var(--sys-spacing-track));

        display: flex;
        flex-direction: column;
        height: max-content;
        overflow-y: auto;
        width: 100%;
        border-radius: var(--sys-radius-medium);
      }

      .list::-webkit-scrollbar {
        width: var(--sys-scrollbar-size);
        height: var(--sys-scrollbar-size);
      }
      .list::-webkit-scrollbar-corner,
      .list::-webkit-scrollbar-track {
        background-color: var(--sys-scrollbar-background);
        border-radius: var(--sys-scrollbar-radius);
      }
      .list::-webkit-scrollbar-thumb {
        background-color: var(--sys-scrollbar-color);
        border-radius: var(--sys-scrollbar-radius);
      }
    `,
  ];

  @property({type: Object, attribute: false})
    data: Record<string, ItemData> = {};

  @property({type: Boolean, reflect: true, attribute: 'order-animation'})
    orderAnimation = false;

  @property({type: Boolean, reflect: true})
    animating = false;

  @property({type: Number, reflect: true, attribute: 'animating-items'})
    animatingItems = 0;

  private listState: Record<string, DOMRect> = {};

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('elevated', '2');
  }

  override render(): TemplateResult {
    super.render();

    const itemsListTemplate = repeat(
      Object.entries(this.data),
      ([id]) => id,
      ([id, content]) => {
        return html` <gecut-item .data=${content} id=${id}></gecut-item> `;
      },
    );

    return html`<div class="list">${itemsListTemplate}</div>`;
  }

  override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    if (this.orderAnimation !== true) return;

    const list = this.itemsList;

    for (const item of list) {
      item.style.zIndex = this.getZIndexItem(item, true) + '';

      if (item.dragging === false) {
        const newBox = item.getBoundingClientRect();
        const oldBox =
          this.listState[item.id] ??
          this.getBoundingClientRectItems(list)[item.id];

        if (newBox != null && oldBox != null) {
          const deltaY = oldBox.top - newBox.top;
          const isMoving = deltaY > 0;
          const displacementVectorLength = Math.abs(deltaY);
          const duration = clamp(displacementVectorLength * 2.5, 0, 1_000);
          const transition = `box-shadow ${duration / 4}ms, border-radius ${
            duration / 4
          }ms`;

          if (isMoving) {
            this.animatingItems++;

            if (this.animatingItems > 0) {
              this.animating = true;
            }
          }

          if (displacementVectorLength > newBox.height) {
            item.dragging = true;

            const zIndex = this.getZIndexItem(item, true);

            item.style.zIndex = zIndex + 10 + '';
          }

          untilNextFrame()
            .then(() => {
              item.style.transform = `translate(${0}px, ${deltaY}px)`;
              item.style.transition = `${transition}, transform 0s`;
            })
            .then(() => untilNextFrame())
            .then(() => {
              item.style.transform = '';
              item.style.transition = `${transition}, transform ${duration}ms`;
            })
            .then(() => delay(duration))
            .then(() => {
              if (item.dragging === true) {
                item.dragging = false;

                const zIndex = this.getZIndexItem(item);
                item.style.zIndex = zIndex - 10 + '';
              }

              if (isMoving) {
                this.animatingItems--;

                if (this.animatingItems <= 0) {
                  this.animating = false;
                }
              }
            });
        }
      }
    }

    this.listState = this.getBoundingClientRectItems(list);
  }

  private get itemsList(): Item[] {
    return new Array(...this.renderRoot.querySelectorAll<Item>('gecut-item'));
  }

  private getZIndexItem(item: Item, force = false): number {
    let zIndex = Number(item.style.zIndex);

    if ((!zIndex && item.id) || force === true) {
      const items = Object.keys(this.data);

      zIndex = items.length - items.indexOf(item.id) + 10 ?? 10;
    }

    return zIndex;
  }
  private getBoundingClientRectItems(list?: Item[]): Record<string, DOMRect> {
    if (list == null) {
      list = this.itemsList;
    }

    return Object.fromEntries(
      list.map((item) => [item.id, item.getBoundingClientRect()]),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gecut-list': List;
  }
}
