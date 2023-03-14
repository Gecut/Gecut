import {
  css,
  html,
  nothing,
  property,
  unsafeSVG,
  SignalMixin,
  customElement,
  DirectionMixin,
  AlwatrBaseElement,
} from '@alwatr/element';

import type {TemplateResult} from '@alwatr/element';

@customElement('gecut-icon')
export class Icon extends DirectionMixin(SignalMixin(AlwatrBaseElement)) {
  static override styles = css`
    :host {
      display: inline-block;
      width: 1em;
      height: 1em;
      contain: size layout paint style;
      box-sizing: content-box;
      vertical-align: middle;
    }
    :host([flip-rtl][dir='rtl']) svg {
      transform: scaleX(-1);
    }
    svg {
      display: block;
      height: 100%;
      width: 100%;
    }
  `;

  @property({attribute: false})
    svgContent?: string;

  @property({type: Boolean, reflect: true, attribute: 'flip-rtl'})
    flipRtl?: string;

  override render(): TemplateResult | typeof nothing {
    const svg = unsafeSVG(this.svgContent);

    if (this.svgContent == null) return nothing;

    return html`${svg}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gecut-icon': Icon;
  }
}
