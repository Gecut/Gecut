import {
  AlwatrDummyElement,
  css,
  html,
  customElement,
  unsafeCSS,
  state,
  repeat,
} from '@alwatr/element';
import {serviceRequest} from '@alwatr/fetch';
import {redirect} from '@alwatr/router';
import trashIcon from '@gecut/iconsax-cdn/linear/trash?raw';

import '@gecut/ui-kit/icon/icon.js';

import baseElementStyle from '../../styles/element.css?inline';
import config from '../../config.js';
import {user} from '../../utilities/user.js';
import formatPhoneNumber from '../../utilities/format-number.js';
import {generateColorFromString} from '../../utilities/colorize.js';
import {notifyError} from '../../utilities/notify-fetch-error.js';

import '../../components/button/button';
import '../../components/checkbox/checkbox';

import maleIcon from '/icons/gender/man-outline.svg?raw';
import femaleIcon from '/icons/gender/woman-outline.svg?raw';

import {downloadBlob} from '../../utilities/download-blob.js';

import type {SansInterface} from '../../types/sans.js';
import type {LitRenderType} from '../../types/lit-render.js';
import type {UserResponseData} from '../../types/user.js';
import type {Stringifyable} from '@alwatr/type';

type UserListFilters = Pick<
  UserResponseData,
  'smsAddressSent' | 'status' | 'sans'
> & {
  search: string;
};

const sansDateLocaleConf: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',

  hour: 'numeric',
  minute: 'numeric',
};

const userStatusList: UserResponseData['status'][] = [
  'absent',
  'awaiting-confirmation',
  'confirmed',
  'need-to-check-again',
  'present',
  'was-rejected',
];
const userCallsNumberList: UserResponseData['callsNumber'][] = [
  'no-call',
  'first-call',
  'second-call',
  'third-call',
  'fourth-call',
];
const userRoleList: UserResponseData['role'][] = ['admin', 'user'];

const smsAddressSentFilter: (UserResponseData['smsAddressSent'] | null)[] = [
  null,
  true,
  false,
];
const statusFilter: (UserResponseData['status'] | null)[] = [
  null,
  ...userStatusList,
];

function userStatus(status: UserResponseData['status']): string {
  switch (status) {
  case 'awaiting-confirmation':
    return 'در انتظار تایید';
  case 'confirmed':
    return 'تایید شده';
  case 'need-to-check-again':
    return 'نیاز به بررسی دوباره';
  case 'absent':
    return 'غیبت';
  case 'present':
    return 'حضور';
  case 'was-rejected':
    return 'رد شده';
  }
}
function userGender(gender: UserResponseData['gender']): string {
  switch (gender) {
  case 'male':
    return 'مرد';
  case 'female':
    return 'زن';
  case 'unknown':
    return 'نامشخص';
  }
}
function userCallsNumber(calls: UserResponseData['callsNumber']): string {
  switch (calls) {
  case 'no-call':
    return 'بدون تماس';
  case 'first-call':
    return 'تماس اول';
  case 'second-call':
    return 'تماس دوم';
  case 'third-call':
    return 'تماس سوم';
  case 'fourth-call':
    return 'تماس چهارم';
  }
}
function userRole(calls: UserResponseData['role']): string {
  switch (calls) {
  case 'admin':
    return 'ادمین';
  case 'user':
    return 'کاربر';
  }
}
function userSmsAddressSent(calls: UserResponseData['smsAddressSent']): string {
  if (calls === true) {
    return 'بله';
  }
  return 'خیر';
}
function sansDate(sans: SansInterface | null): string {
  if (sans?.date != null) {
    return new Date(sans?.date ?? 0).toLocaleString(
      'fa-IR',
      sansDateLocaleConf,
    );
  }

  return '-';
}

function userSmsAddressSentFilter(
  smsAddressSent: UserResponseData['smsAddressSent'] | null,
): string | null {
  if (smsAddressSent != null) {
    return userSmsAddressSent(smsAddressSent);
  }

  return 'ارسال پیامک آدرس';
}
function userStatusFilter(
  status: UserResponseData['status'] | null,
): string | null {
  if (status != null) {
    return userStatus(status);
  }

  return 'وضعیت کاربر';
}
function sansDateFilter(sans: SansInterface | null): string | null {
  if (sans != null) {
    return sansDate(sans);
  }

  return 'سانس اجرا';
}

function userListSort(
  users: Record<string, UserResponseData>,
): Record<string, UserResponseData> {
  const length = Object.keys(users).length;

  return Object.fromEntries(
    Object.values(users)
      .sort((a, b) => {
        let i = 0;

        if (a.sans != null && b.sans != null) {
          const aDate = new Date(a.sans.date);
          const bDate = new Date(b.sans.date);

          if (aDate > bDate) i += length;
          if (aDate < bDate) i += -length;
        } else {
          i += 10;
        }

        if (a.groupId != null && b.groupId != null) {
          i += a.groupId.localeCompare(b.groupId);
        }

        return i;
      })
      .map((user) => [user.id, user]),
  );
}

@customElement('page-admin-user-list')
export class PageAdminUserList extends AlwatrDummyElement {
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
        background-color: hsl(var(--ref-palette-neutral-variant10));
        border-radius: var(--sys-radius-large);
        overflow: hidden;
        max-height: 100%;
      }
      tbody {
        overflow-y: auto;
      }

      thead {
        height: calc(8 * var(--sys-spacing-track));
      }
      thead tr select {
        background-color: hsl(var(--ref-palette-neutral-variant10));
        color: var(--sys-color-on-primary);
        border: 0;
      }
      thead tr select.sms-sent {
        min-width: 135px;
      }
      tbody tr {
        overflow: hidden;
        height: calc(7 * var(--sys-spacing-track));
        background-image: linear-gradient(
          hsla(var(--_random-group-id-color), 80%),
          hsla(var(--_random-group-id-color), 100%)
        );

        transition-property: height;
        transition-duration: var(--sys-motion-duration-small);
        transition-timing-function: var(--sys-motion-easing-normal);
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
        max-width: calc(14 * var(--sys-spacing-track));
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

      .age input {
        max-width: calc(8 * var(--sys-spacing-track));
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
  private userList: Record<string, UserResponseData> = {};

  @state()
  private userListMemory: Record<string, UserResponseData> = {};

  @state()
  private sansList: Record<string, SansInterface> = {};

  @state()
  private editableRows: string[] = [];

  @state()
  private filters: Partial<UserListFilters> = {};

  private loadDateTimer?: number;

  override connectedCallback(): void {
    super.connectedCallback();

    const userID = localStorage.getItem('user.id');
    const userToken = localStorage.getItem('user.token');

    if (userID != null && userToken != null) {
      this.loadData();
    }

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
    const userList = Object.values(this.userListMemory);
    const userListTemplate = repeat(
      userList.reverse().filter((user) => this.userFilter(user)),
      (user) => user.id,
      (user, index) => {
        index = userList.length - 1 - index;

        if (this.editableRows.includes(user.id) === true) {
          return this.renderEditableRow(user, index);
        }

        return this.renderRow(user, index);
      },
    );

    const smsAddressSentListTemplate = smsAddressSentFilter.map(
      (smsAddressSent) => {
        const selected =
          (smsAddressSent ?? 'all') === (this.filters.smsAddressSent ?? 'all');

        return html`
          <option
            value=${String(smsAddressSent ?? 'all')}
            ?selected=${selected}
          >
            ${userSmsAddressSentFilter(smsAddressSent)}
          </option>
        `;
      },
    );
    const statusListTemplate = statusFilter.map((status) => {
      const selected = (status ?? 'all') === (this.filters.status ?? 'all');

      return html`
        <option value=${status ?? 'all'} ?selected=${selected}>
          ${userStatusFilter(status)}
        </option>
      `;
    });
    const sansListTemplate = [null, ...Object.values(this.sansList)].map(
      (sans) => {
        const selected =
          (sans?.id ?? 'all') === (this.filters.sans?.id ?? 'all');

        return html`
          <option value=${sans ?? 'all'} ?selected=${selected}>
            ${sansDateFilter(sans)}
          </option>
        `;
      },
    );

    return html`
      <div class="header">
        <input
          type="search"
          placeholder="جستجو"
          @input=${this.filterChanged('search')}
        />

        <hr class="separator" />

        <gecut-button background="neutral" small @click=${this.csvGenerate}>
          <span>خروجی اکسل</span>
        </gecut-button>
        <gecut-button href="/home" background="neutral" small>
          <span>بازگشت</span>
        </gecut-button>
        <gecut-button background="secondary" small @click=${this.submit}>
          <span>ذخیره</span>
        </gecut-button>
      </div>
      <div class="main">
        <table class="table">
          <thead>
            <tr>
              <th>ردیف</th>
              <th>نام</th>
              <th>نام خانوادگی</th>
              <th>شماره تماس</th>
              <th>جنسیت</th>
              <th>سن</th>
              <th>
                <select class="sans" @change=${this.filterChanged('sans')}>
                  ${sansListTemplate}
                </select>
              </th>
              <th>کد بلیط</th>
              <th>کد گروه</th>
              <th>
                <select class="status" @change=${this.filterChanged('status')}>
                  ${statusListTemplate}
                </select>
              </th>
              <th>نقش</th>
              <th>وضعیت تماس</th>
              <th>
                <select
                  class="sms-sent"
                  @change=${this.filterChanged('smsAddressSent')}
                >
                  ${smsAddressSentListTemplate}
                </select>
              </th>
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

  private renderRow(user: UserResponseData, index: number): LitRenderType {
    const hidden = !this.userFilter(user);

    return html`
      <tr
        style=${`--_random-group-id-color:${generateColorFromString(
          user.groupId ?? '',
        )}`}
        ?hidden=${hidden}
      >
        <td class="index" @dblclick=${this.convert2EditableRow(user.id)}>
          ${index}
        </td>
        <td class="first-name">${user.firstName}</td>
        <td class="last-name">${user.lastName}</td>
        <td class="phone" dir="ltr">${formatPhoneNumber(user.phone)}</td>
        <td class="gender">${userGender(user.gender)}</td>
        <td class="age">${user.age.toLocaleString('fa-IR')}</td>
        <td class="sans">${sansDate(user.sans)}</td>
        <td class="ticket-id" dir="ltr">${user.id}</td>
        <td class="group-id" dir="ltr">${user.groupId}</td>
        <td class="status">${userStatus(user.status)}</td>
        <td class="role">${userRole(user.role)}</td>
        <td class="calls">${userCallsNumber(user.callsNumber)}</td>
        <td class="sms-sent">${userSmsAddressSent(user.smsAddressSent)}</td>
        <td class="delete">
          <gecut-icon
            .svgContent=${trashIcon}
            @dblclick=${this.deleteUser(
              user.id,
              `${user.firstName} ${user.lastName}`,
            )}
          ></gecut-icon>
        </td>
      </tr>
    `;
  }
  private renderEditableRow(
    user: UserResponseData,
    index: number,
  ): LitRenderType {
    const userStatusListTemplate = userStatusList.map(
      (status) =>
        html`
          <option value=${status} ?selected=${status === user.status}>
            ${userStatus(status)}
          </option>
        `,
    );
    const userCallsNumberListTemplate = userCallsNumberList.map(
      (calls) =>
        html`
          <option value=${calls} ?selected=${calls === user.callsNumber}>
            ${userCallsNumber(calls)}
          </option>
        `,
    );
    const userRoleListTemplate = userRoleList.map(
      (role) =>
        html`
          <option value=${role} ?selected=${role === user.role}>
            ${userRole(role)}
          </option>
        `,
    );
    const sansListTemplate = Object.values(this.sansList).map(
      (sans) =>
        html`
          <option value=${sans.id} ?selected=${sans.id === user.sans?.id}>
            ${sansDate(sans)}
          </option>
        `,
    );

    return html`
      <tr class="editable">
        <td
          class="index"
          @click=${this.convert2NormalRow()}
          @keyup=${this.convert2NormalRow()}
        >
          ${index}
        </td>
        <td class="first-name">
          <input
            .value=${user.firstName}
            @input=${this.dataChanged('firstName', user.id)}
          />
        </td>
        <td class="last-name">
          <input
            .value=${user.lastName}
            @input=${this.dataChanged('lastName', user.id)}
          />
        </td>
        <td class="phone">
          <input
            type="tel"
            .value=${user.phone}
            dir="ltr"
            @input=${this.dataChanged('phone', user.id)}
          />
        </td>
        <td
          class="gender"
          @click=${this.dataChanged('gender', user.id)}
          @keyup=${this.dataChanged('gender', user.id)}
        >
          <gecut-icon
            .svgContent=${user.gender === 'male' ? maleIcon : femaleIcon}
          ></gecut-icon>
        </td>
        <td class="age">
          <input
            type="number"
            .value=${user.age}
            dir="ltr"
            @input=${this.dataChanged('age', user.id)}
          />
        </td>
        <td class="sans">
          <select @change=${this.dataChanged('sansCode', user.id)}>
            ${sansListTemplate}

            <option value="" ?selected=${user.sans?.id == null}>-</option>
          </select>
        </td>
        <td class="ticket-id" dir="ltr">${user.id}</td>
        <td class="group-id" dir="ltr">
          <input
            .value=${user.groupId}
            dir="ltr"
            @input=${this.dataChanged('groupId', user.id)}
          />
        </td>
        <td class="status">
          <select @change=${this.dataChanged('status', user.id)}>
            ${userStatusListTemplate}
          </select>
        </td>
        <td class="role">
          <select @change=${this.dataChanged('role', user.id)}>
            ${userRoleListTemplate}
          </select>
        </td>
        <td class="calls">
          <select @change=${this.dataChanged('callsNumber', user.id)}>
            ${userCallsNumberListTemplate}
          </select>
        </td>
        <td class="sms-sent">
          <gecut-checkbox
            .checked=${user.smsAddressSent}
            @change=${this.dataChanged('smsAddressSent', user.id)}
          ></gecut-checkbox>
        </td>
        <td class="delete">
          <gecut-icon
            .svgContent=${trashIcon}
            @click=${this.deleteUser(
              user.id,
              `${user.firstName} ${user.lastName}`,
            )}
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
      let value: string | number | boolean | undefined =
        target.value?.toString();

      if (name === 'age') {
        value = +(target.value ?? -1);
      } else if (name === 'gender') {
        value = this.userListMemory[id].gender === 'female' ? 'male' : 'female';
      } else if (name === 'smsAddressSent' || name === 'deleted') {
        value = target.checked;
      }

      this.userListMemory = {
        ...this.userListMemory,

        [id]: {
          ...this.userListMemory[id],

          [name]: value,
        },
      };

      this._logger.logMethodArgs('dataChanged', {
        target,
        event,
        changed: {
          name,
          value: this.userListMemory[id][name],
        },
      });
    };
  }

  private filterChanged<TName extends keyof UserListFilters>(
    name: TName,
  ): (event: Event) => void {
    return (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      this.editableRows = [];

      const target = event.target as Partial<HTMLInputElement>;
      let value: string | number | boolean | undefined = target.value;

      if (name === 'smsAddressSent') {
        value = value == 'null' ? 'all' : String(value) == 'true';
      }

      this.filters = {
        ...this.filters,

        [name]: value,
      };

      this._logger.logMethodArgs('filterChanged', {
        target,
        event,
        changed: {
          name,
          value: this.filters[name],
        },
      });

      if (value === 'all' || value?.toString().trim() == '') {
        delete this.filters[name];
      }
    };
  }

  private userListSort(): void {
    this.userList = userListSort(this.userList);
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

    const serializedUserList = Object.fromEntries(
      Object.values(this.userListMemory)
        .filter((user) => {
          return !(
            JSON.stringify(user) === JSON.stringify(this.userList[user.id])
          );
        })
        .map((user) => {
          return [user.id, user];
        }),
    );

    this._logger.logMethodArgs('submit', {serializedUserList});

    if (userID != null && userToken != null) {
      this.editableRows = [];
      serviceRequest<Record<string, UserResponseData>>({
        url: config.api + '/admin/users',
        method: 'POST',
        queryParameters: {id: userID},
        token: userToken,
        retry: 3,
        retryDelay: 1_000,
        bodyJson: serializedUserList,
      })
        .then((userResponse) => {
          if (userResponse.ok) {
            this.userList = userResponse.data;

            this.userListSort();

            this.userListMemory = this.userList;
          }

          serviceRequest<Record<string, UserResponseData>>({
            url: config.api + '/admin/users',
            method: 'GET',
            queryParameters: {id: userID},
            token: userToken,
            removeDuplicate: 'auto',
            cacheStrategy: 'update_cache',
            retry: 10,
            retryDelay: 3_000,
          })
            .then((userResponse) => {
              if (userResponse.ok) {
                this.userList = userResponse.data;

                this.userListSort();

                this.userListMemory = this.userList;
              }
            })
            .catch(notifyError);
        })
        .catch(notifyError);
    }
  }

  private async loadData(
    cacheStrategy:
      | 'stale_while_revalidate'
      | 'update_cache' = 'stale_while_revalidate',
  ): Promise<void> {
    serviceRequest<Record<string, SansInterface>>({
      url: config.api + '/sans',
      method: 'GET',
      removeDuplicate: 'never',
      cacheStrategy,
      retry: 3,
      retryDelay: 3_000,
    })
      .then((sansResponse) => {
        if (sansResponse.ok) {
          this.sansList = sansResponse.data;
        }
      })
      .catch(notifyError)
      .finally(() => {
        this.loadDateTimer = undefined;
      });

    const userID = localStorage.getItem('user.id');
    const userToken = localStorage.getItem('user.token');

    if (userID != null && userToken != null) {
      await serviceRequest<Record<string, UserResponseData>>({
        url: config.api + '/admin/users',
        method: 'GET',
        queryParameters: {id: userID},
        token: userToken,
        removeDuplicate: 'never',
        cacheStrategy,
        retry: 3,
        retryDelay: 3_000,
      })
        .then((userResponse) => {
          if (userResponse.ok) {
            this.userList = userResponse.data;

            this.userListSort();

            this.userListMemory = this.userList;
          }
        })
        .catch(notifyError)
        .catch(() => {
          user.logOut();
          redirect('/home');
        });
    }

    if (this.loadDateTimer == null) {
      this.loadDateTimer = setTimeout(() => {
        this.loadData('update_cache');
      }, 10_000);
    }
  }

  private deleteUser(userId: string, userName: string): (event: Event) => void {
    return (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      if (confirm(`آیا از حذف کاربر ${userName} اطمینان دارید ؟`)) {
        const userID = localStorage.getItem('user.id');
        const userToken = localStorage.getItem('user.token');

        this._logger.logMethodArgs('deleteUser', {id: userId});

        if (userID != null && userToken != null) {
          this.editableRows = [];

          serviceRequest<Record<string, UserResponseData>>({
            url: config.api + '/admin/user',
            method: 'DELETE',
            queryParameters: {id: userID, userId},
            token: userToken,
            retry: 3,
            retryDelay: 1_000,
          })
            .then((userResponse) => {
              if (userResponse.ok) {
                this.userList = userResponse.data;

                this.userListSort();

                this.userListMemory = this.userList;
              }

              this.loadData('update_cache');
            })
            .catch(notifyError);
        }
      }
    };
  }

  private userFilter(user: UserResponseData): boolean {
    let cond = true;

    if (this.filters.status != null) {
      cond &&= this.filters.status === user.status;
    }
    if (this.filters.status != null) {
      cond &&= this.filters.status === user.status;
    }
    if (this.filters.smsAddressSent != null) {
      cond &&= this.filters.smsAddressSent === user.smsAddressSent;
    }
    if (this.filters.search != null) {
      cond &&= [user.firstName, user.lastName, user.groupId, user.phone]
        .join('-')
        .includes(this.filters.search);
    }

    return cond;
  }

  private csvGenerate(): void {
    const tableHead = [
      'ردیف',
      'نام',
      'نام خانوادگی',
      'شماره تماس',
      'جنسیت',
      'سن',
      'سانس اجرا',
      'کد بلیط',
      'کد گروه',
      'وضعیت کاربر',
      'نقش',
      'وضعیت تماس',
      'ارسال پیامک آدرس',
    ];
    const userCsvArray: Stringifyable[][] = Object.values(this.userList).map(
      (user, index) => [
        index,
        user.firstName,
        user.lastName,
        user.phone,
        userGender(user.gender),
        user.age,
        sansDateFilter(user.sans),
        user.id,
        user.groupId,
        userStatus(user.status),
        userRole(user.role),
        userCallsNumber(user.callsNumber),
        userSmsAddressSent(user.smsAddressSent),
      ],
    );

    const csv =
      tableHead.join(',') +
      '\n' +
      userCsvArray.map((row) => row.join(',')).join('\n');

    downloadBlob(csv, 'users.csv');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-admin-user-list': PageAdminUserList;
  }
}
