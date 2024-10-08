import {EtoolsFilter, EtoolsFilterTypes} from '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';
import {setselectedValueTypeByFilterKey} from '@unicef-polymer/etools-unicef/src/etools-filters/filters';
import {isJsonStrMatch} from '@unicef-polymer/etools-utils/dist/equality-comparisons.util';

export enum FilterKeys {
  q = 'q',
  status = 'status',
  unicef_focal_point = 'unicef_focal_point',
  partner = 'partner',
  created_date = 'created_date',
  page_size = 'page_size',
  sort = 'sort'
}

export type FilterKeysAndTheirSelectedValues = {[key in FilterKeys]?: any};

export const defaultSelectedFilters: FilterKeysAndTheirSelectedValues = {
  q: '',
  status: [],
  unicef_focal_point: [],
  partner: [],
  created_date: null
};

export const selectedValueTypeByFilterKey: any = {
  [FilterKeys.q]: 'string',
  [FilterKeys.status]: 'Array',
  [FilterKeys.unicef_focal_point]: 'Array',
  [FilterKeys.partner]: 'Array',
  [FilterKeys.created_date]: 'string',
  [FilterKeys.page_size]: 'string',
  [FilterKeys.sort]: 'string'
};

setselectedValueTypeByFilterKey(selectedValueTypeByFilterKey);

export const defaultFilters: EtoolsFilter[] = [
  {
    filterName: 'Search records',
    filterKey: FilterKeys.q,
    type: EtoolsFilterTypes.Search,
    selectedValue: '',
    selected: true
  },
  {
    filterName: 'Status',
    filterKey: FilterKeys.status,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [
      {
        id: 'draft',
        name: 'Draft'
      },
      {
        id: 'in_progress',
        name: 'In Progress'
      },
      {
        id: 'submitted',
        name: 'Submitted'
      },
      {
        id: 'rejected',
        name: 'Rejected'
      },
      {
        id: 'final',
        name: 'Final'
      },
      {
        id: 'cancelled',
        name: 'Cancelled'
      }
    ],
    optionValue: 'id',
    optionLabel: 'name',
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: 'UNICEF Focal Point',
    filterKey: FilterKeys.unicef_focal_point,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    optionValue: 'id',
    optionLabel: 'name'
  },
  {
    filterName: 'Partner Org',
    filterKey: FilterKeys.partner,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    optionValue: 'id',
    optionLabel: 'name'
  },
  {
    filterName: 'Created Date',
    filterKey: FilterKeys.created_date,
    type: EtoolsFilterTypes.Date,
    selectedValue: null,
    selected: true
  }
];

export const updateFiltersSelectedValues = (
  selectedFilters: FilterKeysAndTheirSelectedValues,
  filters: EtoolsFilter[]
) => {
  const availableFilters = [...filters];

  for (const fKey in selectedFilters) {
    if (fKey) {
      const selectedValue = selectedFilters[fKey as FilterKeys];
      if (selectedValue) {
        const filter = availableFilters.find((f: EtoolsFilter) => f.filterKey === fKey);
        if (filter) {
          filter.selectedValue = selectedValue instanceof Array ? [...selectedValue] : selectedValue;

          filter.selected = true;
        }
      }
    }
  }

  return availableFilters;
};

export const updateFilterSelectionOptions = (filters: EtoolsFilter[], fKey: string, options: any[]) => {
  const filter = filters.find((f: EtoolsFilter) => f.filterKey === fKey);
  if (filter && options) {
    if (!isJsonStrMatch(filter.selectionOptions, options)) {
      filter.selectionOptions = [...options];
    }
  }
};
