import {random} from '@alwatr/math';

/**
 * It generates a unique ticket code by concatenating
 * two random strings and a random integer
 *
 * @param {string[]} oldTicketsCode - An array of all
 * the ticket codes that have already been
 * generated.
 *
 * @returns unique code
 */
export function generateUniqueTicketCode(oldTicketsCode: string[]): string {
  const id = (
    random.string(2, 2).toString() + random.integer(100, 999).toString()
  ).toUpperCase();

  if (oldTicketsCode.includes(id)) {
    return generateUniqueTicketCode(oldTicketsCode);
  }

  return id;
}

/**
 * It generates a random string of 3 characters, and
 * if that string is already in the list of groupIds,
 * it calls itself again
 *
 * @param {(string | null)[]} groupIdsList - This is
 * an array of all the group ids that are already in
 * use.
 *
 * @returns A string
 */
export function generateUniqueGroupId(groupIdsList: (string | null)[]): string {
  const id = (
    random.string(1, 1).toString() +
    random.integer(10, 99).toString() +
    random.string(1, 1).toString()
  ).toUpperCase();

  if (groupIdsList !== null && groupIdsList.includes(id)) {
    return generateUniqueGroupId(groupIdsList);
  }

  return id;
}
