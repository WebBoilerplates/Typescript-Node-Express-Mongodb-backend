import returnError from '../lib/returnError';
import logger from '@lib/logger';

export default {
  custom: (message: string, status: number, code: string) =>
    returnError(message, status, code),
  test() {
    return returnError(null, 418, null);
  },
  action: {
    unsafe: () =>
      returnError(
        "Handling unsafe actions without 'unsafe' props is not allowed. This error is usually occurs when the action removes all datas of db or stops operation of server.",
        403,
        'UNSAFE_NOT_HANDLED',
      ),
  },
  access: {
    pagenotfound(directory = '') {
      const data: any = {};
      if (directory) {
        data.directory = directory;
      }
      return returnError(
        `Page Not Found. REQURI:${directory}`,
        404,
        'PAGE_NOT_FOUND',
        { data },
      );
    },
  },
  password: {
    encryption() {
      return returnError(
        'Password Encryption failed',
        500,
        'PASSWORD_ENCRYTION_FAIL',
      );
    },
  },
  auth: {
    tokeninvalid: () => returnError('Token Invalid', 403, 'TOKEN_INVALID'),
    fail: () => returnError('Login Failed', 403, 'LOGIN_FAIL'),
    access: {
      lackOfAuthority: () =>
        returnError(
          'Authority is not enough to access',
          403,
          'LACK_OF_AUTHORITY',
        ),
    },
  },
  data: {
    parameternull: (col: any = '') =>
      returnError(
        `Necessary parameter${col ? ` ${col}` : ``} is not provided.`,
        400,
        'PARAMETER_NOT_PROVIDED',
      ),
    parameterInvalid: (col: any = '') =>
      returnError(
        `Parameter${col ? ` ${col}` : ``} is invalid.`,
        400,
        'PARAMETER_INVALID',
      ),
  },
  db: {
    create(collection: string | null = null) {
      return returnError(
        `Failed to save data${
          collection ? ` of ${collection}` : ``
        } to Database.`,
        500,
        'DATABASE_SAVE_FAIL',
      );
    },
    exists(collection: string | null = null) {
      return returnError(
        `${collection ? `${collection} ` : ``}Data Already exists.`,
        409,
        `UNIQUE_DATA_CONFLICT`,
      );
    },
    notfound() {
      return returnError(`Data not found.`, 404, `DATA_NOT_FOUND`);
    },
    error: () =>
      returnError(
        `Failed to resolve database process`,
        500,
        `DATABASE_PROCESS_FAIL`,
      ),
  },
};
