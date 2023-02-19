import type {AlwatrDocumentObject} from '@alwatr/type';
import type {SansInterface} from './sans.js';

export type Gender = 'male' | 'female' | 'unknown';

export type CallsNumber =
  | 'no-call'
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
  groupId: string | null;
  sansCode: string;
  auth: string;
  role: 'admin' | 'user';
  gender: Gender;
};

export type UserResponseData = UserInterface & {
  sans: SansInterface | null;
  group: Record<string, Omit<UserInterface, 'auth'>>;
};
