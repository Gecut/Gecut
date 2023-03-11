import {html, customElement} from '@alwatr/element';
import clockIcon from '@gecut/iconsax-cdn/broken/clock?raw';

import {sansStorageContextConsumer} from '../../context.js';

import {Slider} from './slider.js';

import '../sans/sans-card';

import type {PropertyValues} from '@alwatr/element';
import type {LitRenderType} from '../../types/lit-render.js';
import type {SansInterface} from '../../types/sans.js';

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

  override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    const sansStorage = sansStorageContextConsumer.getValue();
    if (Slider.groupId == null && sansStorage != null) {
      const notEqual =
        Object.keys(Slider.sansList).join(' - ') !==
        Object.keys(sansStorage.data).join(' - ');

      if (notEqual === true) {
        Slider.sansList = sansStorage.data;
        this.disabled = false;
        this.requestUpdate();
      }
    }
  }

  override render(): LitRenderType {
    if (Slider.groupId != null) {
      return this.renderUnitSans();
    }

    return this.renderSansList();
  }

  private renderUnitSans(): LitRenderType {
    this._logger.logMethod('renderUnitSans');

    const sansListTemplate = Object.values(Slider.sansList).map((sans) =>
      this.renderSansCard(sans),
    );

    return html`
      <gecut-icon .svgContent=${clockIcon} class="title-icon"></gecut-icon>
      <h1 class="title-text">سانس برنامه</h1>
      <p class="description">
        هم گروهی شما در این سانس اجرایی شرکت میکنه
        <br />
        پس سانس اجرای شما هم همینه امکان تغییرش هم نیست
      </p>
      <div class="cards-box">${sansListTemplate}</div>
    `;
  }

  private renderSansList(): LitRenderType {
    this._logger.logMethod('renderSansList');

    const sansListTemplate = Object.values(Slider.sansList).map((sans) =>
      this.renderSansCard(sans),
    );

    return html`
      <gecut-icon .svgContent=${clockIcon} class="title-icon"></gecut-icon>
      <h1 class="title-text">سانس برنامه</h1>
      <p class="description">
        حالا که کد همگروهی وارد نکردی یه سانس برای خودت و دوستانت انتخاب کن
        <br />
        لطفا برای ضایع نشدن حقوق دیگران با هماهنگی سانس انتخاب کن
      </p>
      <div class="cards-box">${sansListTemplate}</div>
    `;
  }

  private sansCardClicked(event: PointerEvent): void {
    this._logger.logMethodArgs('sansCardClicked', {event});

    event.preventDefault();
    event.stopPropagation();

    this.changeHandler(event);
  }

  private renderSansCard(sans: SansInterface): LitRenderType {
    const selected = this.data.sansCode === sans.id ? 'selected' : '';
    const enabled =
      this.data.gender === sans.gender &&
      (this.data.age ?? 0) >= sans.ageLimit.min &&
      (this.data.age ?? 0) <= sans.ageLimit.max &&
      (sans.guestsNumber ?? 0) < (sans.hallCapacityNumber ?? 0) ?
        true :
        false;

    this._logger.logMethodArgs('renderSansCard', {
      userGender: this.data.gender,
      gender: sans.gender,
      userAge: this.data.age,
      min: sans.ageLimit.min,
      max: sans.ageLimit.max,
      guests: sans.guestsNumber,
      hall: sans.hallCapacityNumber,
    });

    return html`
      <div class="sans-card ${selected}">
        <gecut-sans-card
          .sans=${sans}
          .value=${sans.id}
          ?disabled=${!enabled}
          @click=${this.sansCardClicked}
          @keyup=${this.sansCardClicked}
        ></gecut-sans-card>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sans-slider': SansSlider;
  }
}
