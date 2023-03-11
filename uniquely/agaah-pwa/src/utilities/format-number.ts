import {isNumber} from '@alwatr/math';

export default function formatPhoneNumber(value: string): string | null {
  if (!isNumber(value) || value.length != 11) {
    return null;
  }

  return [value.slice(0, 4), value.slice(4, 7), value.slice(7)].join(' ');
}
