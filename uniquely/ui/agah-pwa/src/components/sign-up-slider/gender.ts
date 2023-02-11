import {html, customElement} from '@alwatr/element';
import manIcon from '@gecut/iconsax-cdn/broken/man?raw';

import {Slider} from './slider.js';

import '../gender/gender-card';

import type {LitRenderType} from '../../types/lit-render.js';
import type {GenderCard} from '../gender/gender-card.js';

@customElement('gender-slider')
export class GenderSlider extends Slider {
  private changeHandler = this.dataItemChange('gender');

  override connectedCallback(): void {
    super.connectedCallback();

    this.data = {
      gender: 'unknown',

      ...this.data,
    };
  }

  override render(): LitRenderType {
    return html`
      <gecut-icon .svgContent=${manIcon} class="title-icon"></gecut-icon>
      <h1 class="title-text">جنسیت</h1>
      <p class="description">
        پس از انتخاب سانس های مخصوص به شما براتون نمایش داده میشه
      </p>
      <div class="cards-box">
        <gecut-gender-card
          value="male"
          @click=${this.genderCardClicked}
        ></gecut-gender-card>
        <gecut-gender-card
          value="female"
          @click=${this.genderCardClicked}
        ></gecut-gender-card>
      </div>
    `;
  }

  private genderCardClicked(event: Event): void {
    const target = event.target as GenderCard;

    for (const sans of this.renderRoot.querySelectorAll('gecut-gender-card')) {
      sans.selected = false;
    }

    this.changeHandler(event);

    target.selected = true;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gender-slider': GenderSlider;
  }
}
