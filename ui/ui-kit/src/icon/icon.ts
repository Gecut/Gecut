import {customElement, html, property, unsafeSVG} from '@alwatr/element';
import {AlwatrIcon} from '@alwatr/icon';

import type {PropertyDeclaration} from '@alwatr/element';

@customElement('gecut-icon')
/**
 * If the SVG content is not null, return the SVG content,
 * otherwise return the default render function
 *
 * @element gecut-icon
 *
 * @extends {AlwatrIcon}
 *
 * @prop {string} svgContent
 */
export class Icon extends AlwatrIcon {
  @property({attribute: false}) svgContent?: string;

  override requestUpdate(
    name?: PropertyKey | undefined,
    oldValue?: unknown,
    options?: PropertyDeclaration<unknown, unknown> | undefined,
  ): void {
    super.requestUpdate(name, oldValue, options);

    if (name === 'svgContent') {
      this._svg = html`${unsafeSVG(this.svgContent)}`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gecut-icon': Icon;
  }
}
