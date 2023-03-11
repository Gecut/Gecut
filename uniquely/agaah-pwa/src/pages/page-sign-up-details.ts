import {
  AlwatrBaseElement,
  css,
  html,
  customElement,
  unsafeCSS,
  state,
} from '@alwatr/element';

import baseElementStyle from '../styles/element.css?inline';

import logoImage from '/images/logo.png?inline';

import '../components/button/button';
import '../components/checkbox/checkbox';

import type {LitRenderType} from '../types/lit-render.js';

@customElement('page-sign-up-details')
export class PageSignUpDetails extends AlwatrBaseElement {
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
        padding: 2vh calc(3 * var(--sys-spacing-track));
      }

      .row {
        display: flex;
        width: 100%;
        gap: var(--sys-spacing-track);
      }
      .row .grow {
        flex-grow: 1;
      }

      .logo {
        display: flex;

        margin: calc(2 * var(--sys-spacing-track)) 0;
        max-height: calc(30 * var(--sys-spacing-track));
        height: 20vh;
        width: auto;
      }

      .details-box {
        display: flex;
        flex-direction: column;
        padding: var(--sys-spacing-track);
        color: var(--sys-color-on-primary);
        background-color: var(--sys-color-on-primary-container);
        border-radius: var(--sys-radius-medium);
        overflow: hidden;
        margin-top: auto;
      }

      .i_read {
        display: flex;
        align-items: center;
        justify-content: start;
        margin: calc(2 * var(--sys-spacing-track)) var(--sys-spacing-track)
          var(--sys-spacing-track);
        gap: calc(1.5 * var(--sys-spacing-track));
        color: var(--sys-color-tertiary);
      }
    `,
    css`
      .details {
        --sys-scrollbar-background: var(--sys-color-on-surface-variant);
        --sys-scrollbar-size: calc(0.5 * var(--sys-spacing-track));
        --sys-scrollbar-color: var(--sys-color-surface);

        display: flex;
        flex-direction: column;
        gap: calc(1.5 * var(--sys-spacing-track));
        padding: var(--sys-spacing-track);
        width: 100%;
        max-height: max-content;
        overflow-y: auto;

        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-weight: var(--sys-typescale-body-medium-font-weight);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
      }

      .details > * {
        margin: 0;
      }

      .details li {
        margin-bottom: calc(0.5 * var(--sys-spacing-track));
      }

      .details b {
        font-weight: 900;
      }

      .details::-webkit-scrollbar {
        width: var(--sys-scrollbar-size);
        height: var(--sys-scrollbar-size);
      }
      .details::-webkit-scrollbar-corner,
      .details::-webkit-scrollbar-track {
        background-color: var(--sys-scrollbar-background);
        border-radius: var(--sys-scrollbar-radius);
      }
      .details::-webkit-scrollbar-thumb {
        background-color: var(--sys-scrollbar-color);
        border-radius: var(--sys-scrollbar-radius);
      }
    `,
  ];

  @state()
    descriptionConfirmed = false;

  override render(): LitRenderType {
    return html`
      <img .src=${logoImage} class="logo" alt="logo" />
      <div class="details-box">
        <div class="details">
          <p>
            با سلام خیلی خوشحالیم که دوباره افتخار میزبانی شما بزرگواران را در
            یک برنامه دیگر از گروه آگاه داریم گروه آگاه قصد دارد در اسفنند ماه
            ۱۴۰۱ عینک ۲ را برگزار کند. قبل از ثبت نام لازم میدانیم نکاتی را
            ارائه دهیم لطفا با دقت مطالعه کنید و سپس بر روی ثبت نام کلیک کنید
          </p>
          <ol>
            <li>
              عینک یک بازی گروهی است که گروه های ۵ نفره باهم بازی میکنند، شما
              میتوانید از ۱ تا ۵ نفر از دوستانتون رو به برنامه معرفی کنید تا با
              شما همکروه ‌شوند. اگر قصد حضور با دوستانتون رو دارید کد همگروه
              خودتون رو برای همگروهی های خودتون بفرستید تا در بخش مربوطه وارد
              کنند و‌با شما در یک گروه قرارگیرند.
            </li>
            <li>
              حال حاضر این برنامه فقط برای آقا پسران در بازه سنی ۱۵ تا ۲۳ سال
              میباشد. لذا اگر خارج از این سن هستید از ثبت نام خودداری نمایید.
            </li>
            <li>لباس و کفش راحت بپوشید</li>
            <li>
              برای راحتی خود ترجیحا از به همراه داشتن کوله پشتی یا کیف دستی
              خودداری کنید.
            </li>
            <li>بلیط خود را در انتها دانلود و همراه خود داشته باشید</li>
            <li>با لبخند وارد شوید:)</li>
          </ol>
        </div>
        <div class="i_read">
          <gecut-checkbox
            @change=${this.descriptionConfirmedChanged}
          ></gecut-checkbox>
          <span>توضیحات بالا را خواندم و به آن عمل میکنم</span>
        </div>
      </div>
      <div class="row">
        <gecut-button
          class="grow"
          href="/sign-up"
          strong
          small
          ?disabled=${!this.descriptionConfirmed}
        >
          <span>ثبت نام</span>
        </gecut-button>
        <gecut-button href="/home" background="neutral" small>
          <span>بازگشت</span>
        </gecut-button>
      </div>
    `;
  }

  private descriptionConfirmedChanged(
    event: CustomEvent<{checked: boolean}>,
  ): void {
    this._logger.logMethodArgs('descriptionConfirmedChanged', {event});

    this.descriptionConfirmed = event.detail.checked;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-sign-up-details': PageSignUpDetails;
  }
}
