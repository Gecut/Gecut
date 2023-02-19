import {html, customElement} from '@alwatr/element';
import peopleIcon from '@gecut/iconsax-cdn/broken/people?raw';

import {Slider} from './slider.js';

import type {LitRenderType} from '../../types/lit-render.js';

@customElement('teammate-slider')
export class TeammateSlider extends Slider {
  override connectedCallback(): void {
    super.connectedCallback();

    this.data = {
      groupId: null,

      ...this.data,
    };
  }

  override render(): LitRenderType {
    return html`
      <gecut-icon .svgContent=${peopleIcon} class="title-icon"></gecut-icon>
      <h1 class="title-text">کد گروه</h1>
      <p class="description">
        برای هم گروهی شدن با دوستانت باید کد همگروهی که پس از ثبت نام براشون
        ساخته شده رو وارد کنی
        <br />
        اگر چیزی وارد نکنی پس از ثبت نام، برات کد گروه میسازیم تا به دوستانت بدی
      </p>
      <div class="input-box">
        <input
          name="groupId"
          type="text"
          dir="ltr"
          autocapitalize="characters"
          autocomplete="off"
          placeholder="کد گروه خود را وارد کنید"
          @input=${this.dataItemChange('groupId')}
        />
      </div>
      <ul class="helpers">
        <li>ورودی کد هم گروه اختیاری است</li>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'teammate-slider': TeammateSlider;
  }
}
