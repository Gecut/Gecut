import type {AlwatrDocumentObject} from '@alwatr/type';
import type {Gender} from './user.js';

type ageLimit = {
  min: number;
  max: number;
};

export type SansInterface = AlwatrDocumentObject & {
  date: number;
  groupsNumber: number;
  groupsCapacityNumber: number;
  duration: number;
  inactive: boolean;

  hallCapacityNumber: number;
  guestsNumber: number;
  confirmedGuestsNumber: number;

  ageLimit: ageLimit;
  gender: Gender;
};
