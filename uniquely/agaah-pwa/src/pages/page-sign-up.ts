import {
  AlwatrBaseElement,
  css,
  html,
  customElement,
  unsafeCSS,
  state,
  unsafeHTML,
  property,
} from '@alwatr/element';
import {styleMap} from 'lit/directives/style-map.js';
import {classMap} from 'lit/directives/class-map.js';
import {redirect} from '@alwatr/router';
import refreshIcon from '@gecut/iconsax-cdn/broken/refresh-2?raw';

import baseElementStyle from '../styles/element.css?inline';
import {validateData} from '../utilities/validate.js';
import {user} from '../utilities/user.js';

import '../components/sign-up-slider/nickname';
import '../components/sign-up-slider/age';
import '../components/sign-up-slider/teammate';
import '../components/sign-up-slider/gender';
import '../components/sign-up-slider/sans';
import '../components/sign-up-slider/phone';

import type {PropertyValues} from '@alwatr/element';
import type {UserInterface} from '../types/user.js';
import type {LitRenderType} from '../types/lit-render.js';
import type {Button} from '../components/button/button.js';
import type {Slider} from '../components/sign-up-slider/slider.js';

@customElement('page-sign-up')
export class PageSignUp extends AlwatrBaseElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        height: 100%;

        gap: var(--sys-spacing-track);
        padding: 2vh 0;
      }

      .slider {
        display: flex;
        width: 100%;
        direction: ltr;
        overflow-y: auto;
        overflow-x: hidden;
        flex: 1 1 auto;
        overscroll-behavior: contain;
      }
      .slides {
        display: flex;
        flex-grow: 1;
        height: max-content;
        width: max-content;
        transition-property: transform;
        transition-duration: var(--sys-motion-duration-medium);
        transition-timing-function: var(--sys-motion-easing-in-out);
      }

      .separator {
        display: flex;
        flex-grow: 1;
        width: 100%;
      }

      footer {
        direction: ltr;
        display: flex;
        width: 100%;
        flex: 0 0 auto;
        gap: var(--sys-spacing-track);
        overflow: hidden;
        padding: var(--sys-spacing-track) calc(3 * var(--sys-spacing-track)) 0;
      }
      footer gecut-button {
        min-width: auto;
        max-width: 30%;
        flex-grow: 1;
      }
      footer gecut-button[hidden] {
        display: none;
      }
      footer gecut-button.first {
        border-top-right-radius: 0;
      }
      footer gecut-button.last {
        border-top-left-radius: 0;
      }
      footer .progress {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: calc(0.5 * var(--sys-spacing-track));
        padding: var(--sys-spacing-track);
        margin: auto;
      }
      footer .progress span {
        display: flex;
        flex-shrink: 0;
        width: calc(0.8 * var(--sys-spacing-track));
        height: calc(0.8 * var(--sys-spacing-track));
        box-shadow: inset 0 0 calc(0.25 * var(--sys-spacing-track))
          hsla(var(--sys-color-surface-hsl), 50%);
        background-color: var(--sys-color-on-surface-variant);
        border-radius: var(--sys-radius-large);
        transition-property: box-shadow;
        transition-duration: var(--sys-motion-duration-medium);
        transition-timing-function: var(--sys-motion-easing-in-out);
      }
      footer .progress span.active {
        box-shadow: inset 0 0 calc(2 * var(--sys-spacing-track))
          var(--sys-color-surface);
      }

      gecut-icon[hidden] {
        display: none;
      }
      gecut-icon.loader {
        animation: rotate-center 1000ms linear infinite both;
      }

      @keyframes rotate-center {
        0% {
          transform: rotate(0);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ];

  @property({type: Boolean, reflect: true})
    loading = false;

  @state()
  private slideIndex = 0;

  @state()
  private data: Partial<UserInterface> = {};

  private slides = [
    'nickname-slider#nickname-slider',
    'gender-slider#gender-slider',
    'age-slider#age-slider',
    'phone-slider#phone-slider',
    'teammate-slider#teammate-slider',
    'sans-slider#sans-slider',
  ];

  override connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener('keyup', () => {
      const sliderElement = this.renderRoot.querySelector('div.slider');

      sliderElement?.scroll({
        left: 0,
      });
    });
  }

  override render(): LitRenderType {
    const thisWidth = this.getBoundingClientRect().width;
    const slidesStyle = styleMap({
      transform: `translateX(${-1 * thisWidth * this.slideIndex + 'px'})`,
    });
    const slidesTemplate = this.slides.map((slide) => {
      const slideDetail = slide.split('#');

      slide = slideDetail[0];

      return unsafeHTML(`<${slide} id=${slideDetail[1]}></${slide}>`);
    });
    const progressItemsTemplate = this.slides.map((_slide, index) => {
      const progressItemClass = classMap({
        active: index <= this.slideIndex,
      });

      return html`<span class=${progressItemClass}></span>`;
    });

    return html`
      <div class="separator"></div>

      <div class="slider">
        <div class="slides" style=${slidesStyle}>${slidesTemplate}</div>
      </div>

      <div class="separator"></div>

      <footer>
        <gecut-button
          class="first"
          background="neutral"
          ?hidden=${!(this.slideIndex === 0)}
          small
          href="/sign-up-details"
        >
          <span>بازگشت</span>
        </gecut-button>
        <gecut-button
          class="first"
          background="neutral"
          ?disabled=${!this.canPerv}
          ?hidden=${!(this.slideIndex > 0)}
          small
          @click=${this.pervSlide}
        >
          <span>قبلی</span>
        </gecut-button>

        <div class="progress">${progressItemsTemplate}</div>

        <gecut-button
          class="last"
          ?disabled=${!this.canNext}
          ?hidden=${this.canSubmit}
          @click=${this.nextSlide}
          small
        >
          <span>بعدی</span>
        </gecut-button>

        <gecut-button
          id="submit-button"
          class="last"
          ?disabled=${!this.canNext}
          ?hidden=${!this.canSubmit}
          small
          @click=${this.submit}
        >
          <gecut-icon
            slot="icon"
            class="loader"
            .svgContent=${refreshIcon}
            ?hidden=${!this.loading}
          ></gecut-icon>

          <span ?hidden=${this.loading}>ثبت نام</span>
          <span ?hidden=${!this.loading}>در حال ارسال به سرور ...</span>
        </gecut-button>
      </footer>
    `;
  }

  override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    for (const slide of this.renderRoot.querySelectorAll<Slider>(
      this.slides.join(','),
    )) {
      if (slide != null) {
        slide.active = false;
        slide.data = {
          ...slide.data,
          ...this.data,
        };

        slide.removeEventListener('change', () => this.requestUpdate());
      }
    }

    const slide = this.renderRoot.querySelector<Slider>(
      this.slides[this.slideIndex],
    );

    if (slide != null) {
      slide.active = true;
      slide.addEventListener('change', () => this.requestUpdate());
    }
  }

  private async nextSlide(): Promise<void> {
    if (this.canNext) {
      this.slideIndex++;
    }
  }
  private pervSlide(): void {
    if (this.canPerv) {
      this.slideIndex--;
    }
  }

  private async submit(event: PointerEvent): Promise<void> {
    event.preventDefault();

    const submitButton = this.renderRoot.querySelector<Button>(
      'gecut-button#submit-button',
    );

    if (submitButton != null) {
      submitButton.disabled = true;
    }

    this.loading = true;
    try {
      const response = await user.signUp(this.data);

      if (response.ok) {
        redirect('/user');
      }
    } catch (error) {
      this._logger.error('submit', 'submit_error', error);
    }
    this.loading = false;

    if (submitButton != null) {
      submitButton.disabled = false;
    }
  }

  private get canSubmit(): boolean {
    return this.slides.length - 1 === this.slideIndex;
  }
  private get canNext(): boolean {
    const slide = this.renderRoot.querySelector<Slider>(
      this.slides[this.slideIndex],
    );

    if (slide == null) return false;

    const dataValidate = Object.keys(slide.data)
      .map((dataKey) => {
        const key = dataKey as keyof UserInterface;
        const validate = validateData(key, slide.data[key]);

        this._logger.logMethodArgs('canNext', {
          key,
          value: slide.data[key],
          validate,
        });

        return validate;
      })
      .reduce((perv, curr) => perv && curr, true);

    if (dataValidate) {
      this.data = {
        ...this.data,
        ...slide.data,
      };
    }

    if (this.slideIndex < this.slides.length && dataValidate) {
      return true;
    }

    return false;
  }

  private get canPerv(): boolean {
    if (this.slideIndex > 0) {
      return true;
    }

    return false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-sign-up': PageSignUp;
  }
}
