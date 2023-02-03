import type {AlwatrDocumentObject} from '@alwatr/type';

export type CallsNumber =
  | 'first-call'
  | 'second-call'
  | 'third-call'
  | 'fourth-call';

export type UserStatus =
  | 'confirmed'
  | 'awaiting-confirmation'
  | 'was-rejected'
  | 'need-to-check-again'
  | 'present'
  | 'absent';

export type UserInterface = AlwatrDocumentObject & {
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  status: UserStatus;
  callsNumber: CallsNumber;
  smsAddressSent: boolean;
  deleted: boolean;
  groupCode: number | null;
  sansCode: number;
};
