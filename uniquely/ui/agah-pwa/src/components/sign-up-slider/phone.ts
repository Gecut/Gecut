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
        لطفا شماره تلفن همراه خود را به درستی وارد نمایید
        <br />
        پس از ثبت نام گروه پشتیبانی با شما تماس خواهد گرفت
      </p>
      <div class="input-box">
        <input
          name="phone"
          type="text"
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
