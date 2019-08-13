/**
 * Utility functions used in etools data lists
 */

import {EtoolsTableColumn, EtoolsTableColumnSort} from './etools-table';

export interface EtoolsTableSortItem {
  [key: string]: EtoolsTableColumnSort;
}

export const getUrlQueryStringSort = (sortFields: EtoolsTableSortItem[]): string => {
  let sort = '';
  if (sortFields.length > 0) {
    sort = sortFields.map((sortItem: EtoolsTableSortItem) => `${sortItem.name}.${sortItem.sort}`).join('|');
  }
  return sort;
};

export const getSortFields = (columns: EtoolsTableColumn[]): EtoolsTableSortItem[] => {
  let sortItems: EtoolsTableSortItem[] = [];
  const sortedColumns: any[] = columns.filter((c: EtoolsTableColumn) => c.sort !== undefined);
  if (sortedColumns.length > 0) {
    sortItems = sortedColumns.map((c: EtoolsTableColumn) =>
      Object.assign({}, {name: c.name, sort: c.sort})) as EtoolsTableSortItem[];
  }
  return sortItems;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSortFieldsFromUrlParams = (params: any) => {
  console.log(params);
  // TODO: used to init sort object from url params (API related)
};

export const getQueryStringFromObject = () => {
  // TODO
};
