import {isNumber} from '@alwatr/math';

import type {UserInterface} from '../types/user.js';

export const groupIdRegex = /^([a-z]{2})([0-9]{3})+$/;

export const rtlCharacterRegex =
  // eslint-disable-next-line no-misleading-character-class
  /^(([\\s,کگۀی،,تثجحخد,غيًٌٍَ,ُپٰچژ‌,ء-ةذ-عف-ٔ])|([۰-۹])|((،|؟|«|»|؛|٬)))+$/u;

export function validateData<T extends keyof UserInterface>(
  name: T,
  value: UserInterface[T],
): boolean {
  if (name === 'firstName' || name === 'lastName') {
    return (
      value != null &&
      typeof value === 'string' &&
      rtlCharacterRegex.test(value) &&
      value.length >= 3
    );
  }

  if (name === 'age') {
    return value != null && isNumber(value) && value >= 15 && value <= 22;
  }

  if (name === 'groupId' && value != null) {
    return (
      typeof value === 'string' && value.length == 5 && groupIdRegex.test(value)
    );
  }

  if (name === 'phone') {
    return typeof value === 'string' && isNumber(value) && value.length == 11;
  }

  if (name === 'sansCode') {
    return typeof value === 'string' && isNumber(value);
  }

  return true;
}
