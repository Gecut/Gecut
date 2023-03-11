import {isNumber} from '@alwatr/math';

import type {UserInterface} from '../types/user.js';

export const groupIdRegex = /^([A-Z]{1})([0-9]{2})([A-Z]{1})+$/;
export const userIdRegex = /^([A-Z]{2})([0-9]{3})+$/;

export const rtlCharacterRegex =
  /^(([,کگۀی،,تثجحخد,غيًٌٍَ,ُپٰچژ‌,ء-ةذ-عف-ٔ])|( ))+$/;

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
    return value != null && isNumber(value) && value >= 15 && value <= 23;
  }

  if (name === 'gender') {
    return (
      typeof value === 'string' && (value === 'male' || value === 'female')
    );
  }

  if (name === 'groupId' && value != null) {
    return (
      typeof value === 'string' &&
      value.length === 4 &&
      groupIdRegex.test(value)
    );
  }

  if (name === 'phone') {
    return typeof value === 'string' && isNumber(value) && value.length == 11;
  }

  if (name === 'sansCode') {
    return typeof value === 'string' && value.length > 0 && isNumber(value);
  }

  if (name === 'id') {
    return (
      typeof value === 'string' && value.length === 5 && userIdRegex.test(value)
    );
  }

  return true;
}
