import {logWarn} from '@unicef-polymer/etools-behaviors/etools-logging.js';
declare const dayjs: any;

export function isValidDate(date: any) {
  return date instanceof Date === false ? false : date.toString() !== 'Invalid Date';
}

export function prettyDate(dateString: string, format?: string, placeholder = '-') {
  const date = convertDate(dateString);
  return !date ? (placeholder ? placeholder : '') : _utcDate(date, format);
}

function _utcDate(date: any, format?: string) {
  return !date ? '' : dayjs.utc(date).format(format ? format : 'D MMM YYYY');
}

export function convertDate(dateString: string, noZTimezoneOffset?: boolean) {
  if (dateString !== '') {
    dateString = dateString.indexOf('T') === -1 ? dateString + 'T00:00:00' : dateString;
    /**
     * `Z` (zero time offset) will ensure `new Date` will create the date in UTC and then it will apply local timezone
     * and will have the same result in all timezones (for the UTC date).
     * Example:
     *  d = new Date('2018-04-25T00:00:00Z');
     *  d.toString() == "Wed Apr 25 2018 03:00:00 GMT+0300 (EEST)"
     *  d.toGMTString() == "Wed, 25 Apr 2018 00:00:00 GMT"
     * @type {string}
     */
    dateString += noZTimezoneOffset || dateString.indexOf('Z') >= 0 ? '' : 'Z';
    const date = new Date(dateString);
    const isValid = isValidDate(date);
    if (!isValid) {
      logWarn('Date conversion unsuccessful: ' + dateString);
    }
    return isValid ? date : null;
  }
  return null;
}

export function formatDate(date: Date, format: string) {
  if (!date) {
    return null;
  }
  return dayjs(date).format(format);
}
