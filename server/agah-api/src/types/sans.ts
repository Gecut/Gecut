import type {AlwatrDocumentObject} from '@alwatr/type';

export type SansInterface = AlwatrDocumentObject & {
  date: Date;
  groupsNumber: number;
  groupsCapacityNumber: number;
  guestsNumber: number;
  confirmedGuestsNumber: number;
  inactive: boolean;
};
