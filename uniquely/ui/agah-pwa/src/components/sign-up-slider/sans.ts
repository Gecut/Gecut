import {html, customElement} from '@alwatr/element';
import calendarIcon from '@gecut/iconsax-cdn/broken/calendar-2?raw';

import {Slider} from './slider.js';

import '../sans/sans-card';

import type {LitRenderType} from '../../types/lit-render.js';

@customElement('sans-slider')
export class SansSlider extends Slider {
  private changeHandler = this.dataItemChange('sansCode');

  override connectedCallback(): void {
    super.connectedCallback();

    this.data = {
      sansCode: '',

      ...this.data,
    };
  }

  override render(): LitRenderType {
    if (this.data.groupId != null) {
      return this.renderUnitSans();
    }

    return this.renderSansList();
  }

  private renderUnitSans(): LitRenderType {
    this._logger.logMethod('renderUnitSans');

    return html`
      <gecut-icon .svgContent=${calendarIcon} class="title-icon"></gecut-icon>
      <h1 class="title-text">سانس برنامه</h1>
      <p class="description">
        هم گروهی شما در این سانس اجرایی شرکت میکنه
        <br />
        پس سانس اجرای شما هم همینه امکان تغییرش هم نیست
      </p>
      <div class="cards-box">${this.renderSansCard()}</div>
    `;
  }

  private renderSansList(): LitRenderType {
    this._logger.logMethod('renderSansList');

    const sansListTemplate = [
      this.renderSansCard(),
      this.renderSansCard(),
      this.renderSansCard(),
      this.renderSansCard(),
    ];

    return html`
      <gecut-icon .svgContent=${calendarIcon} class="title-icon"></gecut-icon>
      <h1 class="title-text">سانس برنامه</h1>
      <p class="description">
        حالا که کد همگروهی وارد نکردی یه سانس برای خودت و دوستانت انتخاب کن
        <br />
        لطفا برای ضایع نشدن حقوق دیگران با هماهنگی سانس انتخاب کن
      </p>
      <div class="cards-box">${sansListTemplate}</div>
    `;
  }

  private sansCardClicked(event: Event): void {
    const target = event.target as HTMLElement;
    const targetParent = target.parentElement;

    for (const sans of this.renderRoot.querySelectorAll('.sans-card')) {
      sans.removeAttribute('selected');
    }

    this.changeHandler(event);

    targetParent?.setAttribute('selected', '');
  }

  private renderSansCard(): LitRenderType {
    return html`
      <div
        class="sans-card"
        @click=${this.sansCardClicked}
        @keyup=${this.sansCardClicked}
      >
        <gecut-sans-card value="1"></gecut-sans-card>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sans-slider': SansSlider;
  }
}
