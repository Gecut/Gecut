import {
  AlwatrDummyElement,
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
export class PageSignUpDetails extends AlwatrDummyElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        height: 100vh;

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
          <b>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم</b>
          <p>
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است
          </p>
          <p>
            پیر مردی هر روز تو محله می دید پسر کی با کفش های پاره و پای برهنه با
            توپ پلاستیکی فوتبال بازی می کند، روزی رفت ی کتانی نو خرید و اومد و
            به پسرک گفت بیا این کفشا رو بپوش…پسرک کفشا رو پوشید و خوشحال رو به
            پیر مرد کرد و گفت: شما خدایید؟! پیر مرد لبش را گزید و گفت نه! پسرک
            گفت پس دوست خدایی، چون من دیشب فقط به خدا گفتم كه کفش ندارم…
          </p>
          <ul>
            <li>
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است.
            </li>
            <li>
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است.
            </li>
            <li>
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است.
            </li>
            <li>
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است.
            </li>
          </ul>
          <p>
            پیر مردی هر روز تو محله می دید پسر کی با کفش های پاره و پای برهنه با
            توپ پلاستیکی فوتبال بازی می کند، روزی رفت ی کتانی نو خرید و اومد و
            به پسرک گفت بیا این کفشا رو بپوش…پسرک کفشا رو پوشید و خوشحال رو به
            پیر مرد کرد و گفت: شما خدایید؟! پیر مرد لبش را گزید و گفت نه! پسرک
            گفت پس دوست خدایی، چون من دیشب فقط به خدا گفتم كه کفش ندارم…
          </p>
          <ol>
            <li>
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است.
            </li>
            <li>
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است.
            </li>
            <li>
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است.
            </li>
            <li>
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است.
            </li>
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
        <gecut-button background="neutral" small>
          <span>تماس با پشتیبانی</span>
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
