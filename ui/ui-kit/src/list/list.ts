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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: var(--sys-radius-medium);
        padding: 0;
      }

      .list {
        display: flex;
        flex-direction: column;
        height: max-content;
        overflow-y: auto;
        width: 100%;
      }
    `,
  ];

  @property({type: Object, attribute: false})
    data: Record<string, ItemData> = {};

  @property({type: Boolean, reflect: true, attribute: 'order-animation'})
    orderAnimation = false;

  private listState: Record<string, DOMRect> = {};

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('elevated', '3');
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
      const newBox = item.getBoundingClientRect();
      const oldBox =
        this.listState[item.id] ??
        this.getBoundingClientRectItems(list)[item.id];

      if (newBox != null && oldBox != null) {
        const deltaY = oldBox.top - newBox.top;
        const displacementVectorLength = Math.abs(deltaY);
        const duration = clamp(displacementVectorLength * 7.5, 0, 1_500);
        const transition = `box-shadow 200ms, border-radius 200ms`;

        if (displacementVectorLength > newBox.height) {
          item.dragging = true;

          const zIndex = this.getZIndexItem(item);

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
          });
      }
    }

    this.listState = this.getBoundingClientRectItems(list);
  }

  private get itemsList(): Item[] {
    return new Array(...this.renderRoot.querySelectorAll<Item>('gecut-item'));
  }

  private getZIndexItem(item: Item): number {
    let zIndex = Number(item.style.zIndex);

    if (!zIndex && item.id) {
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
