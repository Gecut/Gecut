import {html, customElement} from '@alwatr/element';
import userIcon from '@gecut/iconsax-cdn/broken/user-octagon?raw';

import {Slider} from './slider.js';

import type {LitRenderType} from '../../types/lit-render.js';

@customElement('nickname-slider')
export class NickNameSlider extends Slider {
  override connectedCallback(): void {
    super.connectedCallback();

    this.data = {
      firstName: '',
      lastName: '',

      ...this.data,
    };
  }

  override render(): LitRenderType {
    return html`
      <gecut-icon .svgContent=${userIcon} class="title-icon"></gecut-icon>
      <h1 class="title-text">نام و نام خانوادگی</h1>
      <p class="description">
        لطفا نام و نام خانوادگی خود را به طور کامل و صحیح وارد نمایید
        <br />
        (پس از ثبت نام قابل ویرایش نیست)
      </p>
      <div class="input-box">
        <input
          name="firstName"
          type="text"
          autocomplete="off"
          placeholder="نام خود را وارد کنید"
          @input=${this.dataItemChange('firstName')}
        />
        <hr class="separator" />
        <input
          name="lastName"
          type="text"
          autocomplete="off"
          placeholder="نام خانوادگی خود را وارد کنید"
          @input=${this.dataItemChange('lastName')}
        />
      </div>
      <ul class="helpers">
        <li>وارد کردن نام و نام خانوادگی اجباری است</li>
        <li>حداقل تعداد ورودی ۳ کاراکتر است</li>
        <li>جنس حروف ورودی فارسی است</li>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nickname-slider': NickNameSlider;
  }
}
