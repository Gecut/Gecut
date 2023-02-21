import {
  AlwatrDummyElement,
  css,
  html,
  customElement,
  unsafeCSS,
  property,
} from '@alwatr/element';
import userIcon from '@gecut/iconsax-cdn/broken/user-tick?raw';
import {serviceRequest} from '@alwatr/fetch';
import {redirect} from '@alwatr/router';

import baseElementStyle from '../styles/element.css?inline';
import formStyle from '../styles/form.css?inline';
import {validateData} from '../utilities/validate.js';
import config from '../config.js';
import {userContextProvider} from '../context.js';

import '../components/button/button';

import type {UserInterface, UserResponseData} from '../types/user.js';
import type {LitRenderType} from '../types/lit-render.js';

type SignInData = Pick<UserInterface, 'id' | 'phone'>;

@customElement('page-sign-in')
export class PageSignIn extends AlwatrDummyElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    unsafeCSS(formStyle),
    css`
      :host {
        --_box-border-size: 0.3;
        --sys-surface-disabled-opacity: 80%;
        --sys-scrollbar-background: var(--sys-color-on-surface-variant);
        --sys-scrollbar-size: calc(0.5 * var(--sys-spacing-track));
        --sys-scrollbar-color: var(--sys-color-surface);

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        height: 100%;

        color: var(--sys-color-on-primary);
        gap: var(--sys-spacing-track);
        padding: 3vh calc(2 * var(--sys-spacing-track));
      }

      .box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: 100%;

        border: calc(var(--_box-border-size) * var(--sys-spacing-track)) dashed
          hsla(var(--sys-color-surface-hsl), 30%);
        border-radius: var(--sys-radius-large);
      }

      .logo {
        display: flex;

        margin: calc(2 * var(--sys-spacing-track)) 0;
        max-height: calc(30 * var(--sys-spacing-track));
        height: 20vh;
        width: auto;
      }

      .title {
        margin: 0 0 var(--sys-spacing-track);

        font-weight: 800;
        font-family: var(--sys-typescale-title-large-font-family-name);
        font-size: var(--sys-typescale-title-large-font-size);
        letter-spacing: var(--sys-typescale-title-large-letter-spacing);
        line-height: var(--sys-typescale-title-large-line-height);
      }

      .description {
        margin: 0 var(--sys-spacing-track) var(--sys-spacing-track);

        text-align: center;
        font-weight: 300;
        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
        line-height: var(--sys-typescale-body-medium-line-height);
      }

      .icon {
        --_size: 0.4px;

        color: var(--sys-color-primary-container);

        margin: auto 0 5vh;

        min-height: calc(15 * var(--sys-spacing-track));
        min-width: calc(15 * var(--sys-spacing-track));

        max-height: calc(20 * var(--sys-spacing-track));
        max-width: calc(20 * var(--sys-spacing-track));

        height: 18vh;
        width: 18vh;
      }

      .input-box {
        width: auto;
        align-self: stretch;
        margin: calc(2 * var(--sys-spacing-track))
          calc(2 * var(--sys-spacing-track)) auto;
      }

      .submit-button {
        border-radius: var(--sys-radius-large);
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        width: calc(
          2 * var(--_box-border-size) * var(--sys-spacing-track) + 100%
        );
        margin-bottom: calc(
          -1 * var(--_box-border-size) * var(--sys-spacing-track)
        );
        overflow: hidden;
        background-color: var(--sys-color-primary);
      }
      .submit-button gecut-button {
        width: 100%;
        height: 100%;
        border-radius: 0;
      }

      .back-to-home {
        display: flex;

        margin-top: 1vh;
        opacity: 80%;
        color: var(--sys-color-surface);
        text-decoration: underline hsla(var(--sys-color-surface-hsl), 80%);

        font-family: var(--sys-typescale-body-medium-font-family-name);
        font-weight: var(--sys-typescale-body-medium-font-weight);
        font-size: var(--sys-typescale-body-medium-font-size);
        letter-spacing: var(--sys-typescale-body-medium-letter-spacing);
      }
    `,
  ];

  @property({attribute: false, type: Object})
    data: Partial<SignInData> = {};

  override render(): LitRenderType {
    return html`
      <div class="box">
        <gecut-icon .svgContent=${userIcon} class="icon"></gecut-icon>

        <h2 class="title">ورود</h2>
        <div class="description">
          اگر قبلا ثبت نام نموده اید و با کد بلیط و شماره تلفن وارد شوید
          <br />
          اگر کد بلیط خود را فراموش کرده اید با پشتیبانی تماس حاصل فرمایید
        </div>

        <div class="input-box">
          <input
            dir="ltr"
            name="id"
            type="text"
            autocomplete="off"
            placeholder="کد بلیط خود را وارد کنید"
            @input=${this.dataItemChange('id')}
          />
          <hr class="separator" />
          <input
            dir="ltr"
            name="phone"
            type="text"
            autocomplete="off"
            placeholder="شماره تلفن همراه خود را وارد کنید"
            @input=${this.dataItemChange('phone')}
          />
        </div>

        <div class="submit-button">
          <gecut-button @click=${this.submit} ?disabled=${!this.canSubmit}>
            <span>ورود</span>
          </gecut-button>
        </div>
      </div>

      <a href="/home" class="back-to-home"> بازگشت به صفحه اصلی </a>
    `;
  }

  dataItemChange<TName extends keyof SignInData>(
    name: TName,
  ): (event: Event) => void {
    return async (event: Event) => {
      this._logger.logMethodArgs('dataItemChange', {
        data: this.data,
        event,
      });

      const target = event.currentTarget as HTMLInputElement;

      if (validateData(name, target.value)) {
        this.data = {
          ...this.data,
          [name]: String(target.value).trim() as SignInData[TName],
        };
      } else {
        this.data = {
          ...this.data,
          [name]: null,
        };
      }
    };
  }

  private async submit(event: PointerEvent): Promise<void> {
    event.preventDefault();

    const response = await serviceRequest<UserResponseData>({
      url: config.api + '/authentication/sign-in',
      method: 'POST',
      bodyJson: this.data,
    });

    if (response.ok === true) {
      localStorage.setItem('user.id', response.data.id);
      localStorage.setItem('user.token', response.data.auth);
      userContextProvider.setValue(response.data);

      redirect('/user');
    }
  }

  private get canSubmit(): boolean {
    return this.data.id != null && this.data.phone != null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-sign-in': PageSignIn;
  }
}
