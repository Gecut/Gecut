import {
  AlwatrBaseElement,
  css,
  html,
  customElement,
  unsafeCSS,
  state,
} from '@alwatr/element';
import {serviceRequest} from '@alwatr/fetch';
import trashIcon from '@gecut/iconsax-cdn/linear/trash?raw';

import '@gecut/ui-kit/icon/icon.js';

import baseElementStyle from '../../styles/element.css?inline';

import maleIcon from '/icons/gender/man-outline.svg?raw';
import femaleIcon from '/icons/gender/woman-outline.svg?raw';

import {notifyError} from '../../utilities/notify-fetch-error.js';
import config from '../../config.js';

import '../../components/button/button.js';
import '../../components/checkbox/checkbox.js';

import type {Stringifyable} from '@alwatr/type';
import type {SansInterface} from '../../types/sans.js';
import type {LitRenderType} from '../../types/lit-render.js';
import type {UserResponseData} from '../../types/user.js';

const sansDateLocaleConf: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',

  hour: 'numeric',
  minute: 'numeric',
};

function sansGender(gender: SansInterface['gender']): string {
  switch (gender) {
  case 'male':
    return 'مرد';
  case 'female':
    return 'زن';
  case 'unknown':
    return 'نامشخص';
  }
}
function sansInactive(inactive: SansInterface['inactive']): string {
  if (inactive === false) {
    return 'فعال';
  }

  return 'غیرفعال';
}

@customElement('page-admin-sans-list')
export class PageAdminSansList extends AlwatrBaseElement {
  static override styles = [
    unsafeCSS(baseElementStyle),
    css`
      :host {
        --sys-scrollbar-background: var(--sys-color-on-surface-variant);
        --sys-scrollbar-size: calc(0.5 * var(--sys-spacing-track));
        --sys-scrollbar-color: var(--sys-color-surface);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        height: 100%;

        color: var(--sys-color-on-primary);

        gap: var(--sys-spacing-track);
        padding: 2vh calc(3 * var(--sys-spacing-track));
      }

      .header {
        display: flex;
        width: 100%;
        gap: var(--sys-spacing-track);
        padding: var(--sys-spacing-track);
      }

      .separator {
        display: flex;
        flex-grow: 1;
        border: 0;
      }

      .main {
        display: flex;
        width: 100%;
        padding: var(--sys-spacing-track);
        overflow: auto;
      }

      .main::-webkit-scrollbar {
        width: var(--sys-scrollbar-size);
        height: var(--sys-scrollbar-size);
      }
      .main::-webkit-scrollbar-corner,
      .main::-webkit-scrollbar-track {
        background-color: var(--sys-scrollbar-background);
        border-radius: var(--sys-scrollbar-radius);
      }
      .main::-webkit-scrollbar-thumb {
        background-color: var(--sys-scrollbar-color);
        border-radius: var(--sys-scrollbar-radius);
      }
    `,
    css`
      table {
        width: 100%;
        border: none;
        border-collapse: collapse;
        background-color: hsl(var(--ref-palette-neutral-variant20));
        border-radius: var(--sys-radius-large);
        overflow: hidden;
      }

      thead {
        height: calc(8 * var(--sys-spacing-track));
      }
      tbody tr {
        height: calc(7 * var(--sys-spacing-track));
      }

      tbody tr:nth-child(2n + 1) {
        background-color: hsl(var(--ref-palette-neutral-variant30));
      }

      th,
      td {
        text-align: center;
        padding: var(--sys-spacing-track);
        white-space: nowrap;
      }
      td * {
        margin: auto;
      }

      input,
      select {
        min-width: auto;
        max-width: calc(8 * var(--sys-spacing-track));
        width: max-content;
        border-radius: var(--sys-radius-small);
        text-align: center;
        padding: var(--sys-spacing-track);
        border: 1px solid var(--sys-color-outline);
        color: var(--sys-color-on-primary-container);
        background-color: var(--sys-color-on-primary);
      }
      input:focus,
      select:focus {
        outline: 1px solid var(--sys-color-on-primary),
          1px solid var(--sys-color-outline-variant);
      }

      .date input {
        max-width: calc(17 * var(--sys-spacing-track));
      }
      .editable .gender,
      .index {
        cursor: pointer;
        user-select: none;
      }
      .gender gecut-icon {
        font-size: calc(4 * var(--sys-spacing-track));
      }

      .delete gecut-icon {
        cursor: pointer;
        user-select: none;
        color: var(--sys-color-error);
        font-size: calc(3.5 * var(--sys-spacing-track));
      }
    `,
  ];

  @state()
  private sansList: Record<string, SansInterface> = {};

  @state()
  private sansListMemory: Record<string, SansInterface> = {};

  @state()
  private editableRows: string[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    this.loadData();

    document.body.style.setProperty(
      '--_max-mobile-size',
      'var(--sys-breakpoint-large-screen)',
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    document.body.style.removeProperty('--_max-mobile-size');
  }

  override render(): LitRenderType {
    const userListTemplate = Object.values(this.sansListMemory)
      .reverse()
      .filter(() => {
        const cond = true;

        return cond;
      })
      .map((sans) => {
        if (this.editableRows.includes(sans.id) === true) {
          return this.renderEditableRow(sans);
        }

        return this.renderRow(sans);
      });

    return html`
      <div class="header">
        <hr class="separator" />

        <gecut-button href="/home" background="neutral" small>
          <span>بازگشت</span>
        </gecut-button>
        <gecut-button background="neutral" @click=${this.createSans}>
          <span>افزودن سانس</span>
        </gecut-button>
        <gecut-button background="secondary" @click=${this.submit}>
          <span>ذخیره</span>
        </gecut-button>
      </div>
      <div class="main">
        <table class="table">
          <thead>
            <tr>
              <th>ردیف</th>
              <th>زمان اجرا</th>
              <th>ظرفیت تعداد گروه ها</th>
              <th>ظرفیت تعداد اعضای هر گروه</th>
              <th>مدت زمان</th>
              <th>ظرفیت سانس</th>
              <th>تعداد مهمان ها</th>
              <th>تعداد مهمان های تایید شده</th>
              <th>از</th>
              <th>تا</th>
              <th>جنس</th>
              <th>وضعیت</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            ${userListTemplate}
          </tbody>
        </table>
      </div>
    `;
  }

  private async loadData(
    cacheStrategy:
      | 'stale_while_revalidate'
      | 'update_cache' = 'stale_while_revalidate',
  ): Promise<void> {
    await serviceRequest<Record<string, SansInterface>>({
      url: config.api + '/sans',
      method: 'GET',
      removeDuplicate: 'never',
      cacheStrategy,
      retry: 10,
      retryDelay: 3_000,
    })
      .then((sansResponse) => {
        if (sansResponse.ok) {
          this.sansList = sansResponse.data;
          this.sansListMemory = sansResponse.data;

          this.requestUpdate();
        }
      })
      .catch(notifyError);
  }

  private renderRow(sans: SansInterface): LitRenderType {
    return html`
      <tr>
        <td class="index" @dblclick=${this.convert2EditableRow(sans.id)}>
          ${sans.id}
        </td>
        <td class="data">
          ${new Date(sans.date ?? 0).toLocaleString(
            'fa-IR',
            sansDateLocaleConf,
          )}
        </td>
        <td class="groups-number">${sans.groupsNumber}</td>
        <td class="groups-capacity-number">${sans.groupsCapacityNumber}</td>
        <td class="duration">${sans.duration}</td>
        <td class="hall-capacity-number">${sans.hallCapacityNumber}</td>
        <td class="guests-number">${sans.guestsNumber}</td>
        <td class="confirmed-guests-number">${sans.confirmedGuestsNumber}</td>
        <td class="age-limit-min">${sans.ageLimit?.min}</td>
        <td class="age-limit-max">${sans.ageLimit?.max}</td>
        <td class="gender">${sansGender(sans.gender)}</td>
        <td class="inactive">${sansInactive(sans.inactive)}</td>
        <td class="delete">
          <gecut-icon
            .svgContent=${trashIcon}
            @dblclick=${this.deleteSans(sans.id)}
          ></gecut-icon>
        </td>
      </tr>
    `;
  }
  private renderEditableRow(sans: SansInterface): LitRenderType {
    return html`
      <tr class="editable">
        <td
          class="index"
          @click=${this.convert2NormalRow()}
          @keyup=${this.convert2NormalRow()}
        >
          ${sans.id}
        </td>
        <td class="date">
          <input
            type="hidden"
            id="timezone"
            name="timezone"
            value="Asia/Tehran"
          />
          <input
            type="datetime-local"
            step="3600"
            .value=${new Date(sans.date).toISOString()}
            @input=${this.dataChanged('date', sans.id)}
          />
        </td>
        <td class="groups-number">
          <input
            type="number"
            dir="ltr"
            .value=${sans.groupsNumber}
            @input=${this.dataChanged('groupsNumber', sans.id)}
          />
        </td>
        <td class="groups-capacity-number">
          <input
            type="number"
            dir="ltr"
            .value=${sans.groupsCapacityNumber}
            @input=${this.dataChanged('groupsCapacityNumber', sans.id)}
          />
        </td>
        <td class="duration">
          <input
            type="number"
            dir="ltr"
            .value=${sans.duration}
            @input=${this.dataChanged('duration', sans.id)}
          />
        </td>
        <td class="hall-capacity-number">${sans.hallCapacityNumber}</td>
        <td class="guests-number">${sans.guestsNumber}</td>
        <td class="confirmed-guests-number">${sans.confirmedGuestsNumber}</td>
        <td class="age-limit-min">
          <input
            type="number"
            dir="ltr"
            .value=${sans.ageLimit.min}
            @input=${this.dataChanged('ageLimit.min', sans.id)}
          />
        </td>
        <td class="age-limit-max">
          <input
            type="number"
            dir="ltr"
            .value=${sans.ageLimit.max}
            @input=${this.dataChanged('ageLimit.max', sans.id)}
          />
        </td>
        <td
          class="gender"
          @click=${this.dataChanged('gender', sans.id)}
          @keyup=${this.dataChanged('gender', sans.id)}
        >
          <gecut-icon
            .svgContent=${sans.gender === 'male' ? maleIcon : femaleIcon}
          ></gecut-icon>
        </td>
        <td class="inactive">
          <gecut-checkbox
            .checked=${sans.inactive}
            @change=${this.dataChanged('inactive', sans.id)}
          ></gecut-checkbox>
        </td>
        <td class="delete">
          <gecut-icon
            .svgContent=${trashIcon}
            @click=${this.deleteSans(sans.id)}
          ></gecut-icon>
        </td>
      </tr>
    `;
  }

  private dataChanged<TName extends keyof UserResponseData>(
    name: TName,
    id: string,
  ): (event: Event) => void {
    return (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      const target = event.target as Partial<HTMLInputElement>;
      let value: Stringifyable = target.value?.toString();

      if (name === 'date') {
        value = new Date(target.value ?? '').getTime();
      } else if (
        name === 'groupsNumber' ||
        name === 'groupsCapacityNumber' ||
        name === 'duration'
      ) {
        value = +(target.value ?? -1);
      } else if (name === 'ageLimit.min') {
        name = 'ageLimit' as TName;

        value = {
          ...(this.sansListMemory[id][name] as Record<'min' | 'max', number>),

          min: value,
        };
      } else if (name === 'ageLimit.max') {
        name = 'ageLimit' as TName;

        value = {
          ...(this.sansListMemory[id][name] as Record<'min' | 'max', number>),

          max: value,
        };
      } else if (name === 'gender') {
        value = this.sansListMemory[id].gender === 'female' ? 'male' : 'female';
      } else if (name === 'inactive') {
        value = target.checked;
      }

      this.sansListMemory = {
        ...this.sansListMemory,

        [id]: {
          ...this.sansListMemory[id],

          [name]: value,
        },
      };

      this._logger.logMethodArgs('dataChanged', {
        target,
        event,
        changed: {
          name,
          value: this.sansListMemory[id][name],
        },
      });
    };
  }

  private convert2EditableRow(id: string): (event: Event) => void {
    return (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      this.editableRows = [id];
    };
  }
  private convert2NormalRow(): (event: Event) => void {
    return (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      this.editableRows = [];
    };
  }

  private submit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const userID = localStorage.getItem('user.id');
    const userToken = localStorage.getItem('user.token');

    const serializedSansList = Object.fromEntries(
      Object.values(this.sansListMemory)
        .filter((sans) => {
          return !(
            JSON.stringify(sans) === JSON.stringify(this.sansList[sans.id])
          );
        })
        .map((sans) => {
          return [sans.id, sans];
        }),
    );

    this._logger.logMethodArgs('submit', {serializedSansList});

    if (userID != null && userToken != null) {
      this.editableRows = [];
      serviceRequest<Record<string, SansInterface>>({
        url: config.api + '/admin/sans',
        method: 'POST',
        queryParameters: {id: userID},
        token: userToken,
        retry: 3,
        retryDelay: 1_000,
        bodyJson: serializedSansList,
      })
        .then((sansResponse) => {
          if (sansResponse.ok) {
            this.sansList = sansResponse.data;
            this.sansListMemory = sansResponse.data;
          }

          this.loadData('update_cache');
        })
        .catch(notifyError);
    }
  }

  private deleteSans(sansId: string): (event: Event) => void {
    return (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      const userID = localStorage.getItem('user.id');
      const userToken = localStorage.getItem('user.token');

      this._logger.logMethodArgs('deleteSans', {id: sansId});

      if (userID != null && userToken != null) {
        this.editableRows = [];

        serviceRequest<Record<string, SansInterface>>({
          url: config.api + '/admin/sans',
          method: 'DELETE',
          queryParameters: {id: userID, sansId},
          token: userToken,
          retry: 3,
          retryDelay: 1_000,
        })
          .then((sansResponse) => {
            if (sansResponse.ok) {
              this.sansList = sansResponse.data;
              this.sansListMemory = sansResponse.data;
            }

            this.loadData('update_cache');
          })
          .catch(notifyError);
      }
    };
  }
  private createSans(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this._logger.logMethod('createSans');

    const id =
      Math.max(...Object.keys(this.sansListMemory).map((id) => +id)) + 1;

    this.sansListMemory = {
      ...this.sansListMemory,

      [id]: {},
    };

    this.submit(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-admin-sans-list': PageAdminSansList;
  }
}
