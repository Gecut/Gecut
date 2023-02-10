import {customElement, property, unsafeSVG} from '@alwatr/element';
import {AlwatrIcon} from '@alwatr/icon';

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

  /**
   * If the SVG content is not null, return the
   * SVG content, otherwise return the default render
   * function
   *
   * @returns The SVG content is being returned.
   */
  override render(): unknown {
    if (this.svgContent != null) {
      return unsafeSVG(this.svgContent);
    }

    return super.render();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gecut-icon': Icon;
  }
}
