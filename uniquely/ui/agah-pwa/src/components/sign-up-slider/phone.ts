import {html, customElement} from '@alwatr/element';
import callIcon from '@gecut/iconsax-cdn/broken/call-calling?raw';

import {Slider} from './slider.js';

import type {LitRenderType} from '../../types/lit-render.js';

@customElement('phone-slider')
export class PhoneSlider extends Slider {
  override connectedCallback(): void {
    super.connectedCallback();

    this.data = {
      phone: '',

      ...this.data,
    };
  }

  override render(): LitRenderType {
    return html`
      <gecut-icon .svgContent=${callIcon} class="title-icon"></gecut-icon>
      <h1 class="title-text">شماره تلفن همراه</h1>
      <p class="description">
        لطفا تلفن همراه خودرا به دقت وارد کنید
        <br />
        توجه‌کنید ادرس برنامه به همین شماره پیامک خواهد شد
      </p>
      <div class="input-box">
        <input
          name="phone"
          type="tel"
          autocomplete="off"
          placeholder="شماره تلفن همراه خود را وارد کنید"
          @input=${this.dataItemChange('phone')}
        />
      </div>
      <ul class="helpers">
        <li>جنس حروف ورودی اعداد لاتین است</li>
        <li>تعداد ورودی برای شماره تلفن همراه ۱۱ کاراکتر است</li>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'phone-slider': PhoneSlider;
  }
}
