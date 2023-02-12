import {
  AlwatrDummyElement,
  css,
  html,
  customElement,
  unsafeCSS,
  state,
  unsafeHTML,
} from '@alwatr/element';
import {styleMap} from 'lit/directives/style-map.js';
import {classMap} from 'lit/directives/class-map.js';
import baseElementStyle from '../styles/element.css?inline';
import {validateData} from '../utilities/validate.js';

import '../components/button/button';
import '../components/sign-up-slider/nickname';
import '../components/sign-up-slider/age';
import '../components/sign-up-slider/teammate';
import '../components/sign-up-slider/gender';
import '../components/sign-up-slider/sans';
import '../components/sign-up-slider/phone';

import type {PropertyValues} from '@alwatr/element';
import type {UserInterface} from '../types/user.js';
import type {LitRenderType} from '../types/lit-render.js';
import type {Slider} from '../components/sign-up-slider/slider.js';

@customElement('page-sign-up')
export class PageSignUp extends AlwatrDummyElement {
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
        overflow-x: hidden;
        flex-grow: 1;
        width: 100%;
        direction: ltr;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      .slides {
        display: flex;
        flex-grow: 1;
        width: max-content;
        transition-property: transform;
        transition-duration: var(--sys-motion-duration-medium);
        transition-timing-function: var(--sys-motion-easing-in-out);
      }

      .separator {
        flex-grow: 1;
      }

      footer {
        direction: ltr;
        display: flex;
        width: 100%;
        gap: var(--sys-spacing-track);
        overflow: hidden;
        padding: var(--sys-spacing-track) calc(3 * var(--sys-spacing-track)) 0;
      }
      footer gecut-button {
        min-width: auto;
        flex-grow: 1;
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
      }
      footer .progress span {
        display: flex;
        flex-shrink: 0;
        width: calc(1.4 * var(--sys-spacing-track));
        height: calc(1.4 * var(--sys-spacing-track));
        box-shadow: inset 0 0 calc(0.25 * var(--sys-spacing-track))
          var(--sys-color-surface);
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
    `,
  ];

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
    'nickname-slider#fake-slider',
  ];

  override connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener('keyup', () => {
      const sliderElement = this.renderRoot.querySelector('div.slider');

      sliderElement?.scroll(0, 0);
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
      <div class="slider">
        <div class="slides" style=${slidesStyle}>${slidesTemplate}</div>
      </div>

      <div class="separator"></div>

      <footer>
        <gecut-button
          class="first"
          background="neutral"
          ?disabled=${!this.canPerv}
          @click=${this.pervSlide}
        >
          <span>قبلی</span>
        </gecut-button>

        <div class="progress">${progressItemsTemplate}</div>

        <gecut-button
          class="last"
          ?disabled=${!this.canNext}
          @click=${this.nextSlide}
        >
          <span>بعدی</span>
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

  private get canNext(): boolean {
    const slide = this.renderRoot.querySelector<Slider>(
      this.slides[this.slideIndex],
    );

    if (slide == null) return false;

    const dataValidate = Object.keys(slide.data)
      .map((dataKey) => {
        const key = dataKey as keyof UserInterface;

        return validateData(key, slide.data[key]);
      })
      .reduce((perv, curr) => perv && curr, true);

    if (dataValidate) {
      this.data = {
        ...this.data,
        ...slide.data,
      };
    }

    if (this.slideIndex + 1 < this.slides.length && dataValidate) {
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
