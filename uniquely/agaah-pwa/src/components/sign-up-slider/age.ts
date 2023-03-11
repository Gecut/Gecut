import {html, customElement} from '@alwatr/element';
import calendarIcon from '@gecut/iconsax-cdn/broken/calendar?raw';

import {Slider} from './slider.js';

import type {LitRenderType} from '../../types/lit-render.js';

@customElement('age-slider')
export class AgeSlider extends Slider {
  override connectedCallback(): void {
    super.connectedCallback();

    this.data = {
      age: 15,

      ...this.data,
    };
  }

  override render(): LitRenderType {
    return html`
      <gecut-icon .svgContent=${calendarIcon} class="title-icon"></gecut-icon>
      <h1 class="title-text">سن</h1>
      <p class="description">
        این برنامه برای عزیزان ۱۵ الی ۲۳ سال می‌باشد
        <br />
        اگر در این بازه سنی قرار ندارید، ثبت نام خودداری کنید
      </p>
      <div class="input-box small">
        <input
          name="age"
          type="number"
          autocomplete="off"
          placeholder="سن خود را وارد کنید"
          value="15"
          min="15"
          max="23"
          @input=${this.dataItemChange('age')}
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'age-slider': AgeSlider;
  }
}
