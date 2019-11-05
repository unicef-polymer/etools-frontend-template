import {EtoolsFilter, EtoolsFilterTypes} from '../../../common/layout/filters/etools-filters';
import {GenericObject} from '../../../../types/globals';
import {isJsonStrMatch} from '../../../utils/utils';

export enum FilterKeys {
  q = 'q',
  status = 'status',
  unicef_focal_point = 'unicef_focal_point',
  partner = 'partner',
  assessment_date = 'assessment_date',
  assessor_staff = 'assessor_staff',
  assessor_firm = 'assessor_firm',
  assessor_external = 'assessor_external',
  page_size = 'page_size',
  sort = 'sort'
}

export type FilterKeysAndTheirSelectedValues = {[key in FilterKeys]?: any};

export const onlyForUnicefFilters = [FilterKeys.assessor_staff, FilterKeys.assessor_firm,
FilterKeys.assessor_external, FilterKeys.unicef_focal_point];

export const defaultSelectedFilters: FilterKeysAndTheirSelectedValues = {
  q: '',
  status: [],
  unicef_focal_point: [],
  partner: [],
  assessment_date: null
};

export const selectedValueTypeByFilterKey: GenericObject = {
  [FilterKeys.q]: 'string',
  [FilterKeys.status]: 'Array',
  [FilterKeys.unicef_focal_point]: 'Array',
  [FilterKeys.partner]: 'Array',
  [FilterKeys.assessment_date]: 'string',
  [FilterKeys.assessor_staff]: 'Array',
  [FilterKeys.assessor_firm]: 'Array',
  [FilterKeys.assessor_external]: 'Array',
  [FilterKeys.page_size]: 'string',
  [FilterKeys.sort]: 'string'
};

export const assessmentsFilters: EtoolsFilter[] = [
  {
    filterName: 'Search assessment',
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
    filterKey: 'unicef_focal_point',
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
    filterName: 'Assessment Date',
    filterKey: FilterKeys.assessment_date,
    type: EtoolsFilterTypes.Date,
    selectedValue: null,
    selected: true
  },
  {
    filterName: 'Assessor UNICEF Staff',
    filterKey: FilterKeys.assessor_staff,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: false,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    optionValue: 'id',
    optionLabel: 'name'
  },
  {
    filterName: 'Assessor Assessing Firm',
    filterKey: FilterKeys.assessor_firm,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: false,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    optionValue: 'id',
    optionLabel: 'name'
  },
  {
    filterName: 'Assessor External Individual',
    filterKey: FilterKeys.assessor_external,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: false,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    optionValue: 'id',
    optionLabel: 'name'
  }
];

export const updateFiltersSelectedValues = (selectedFilters: FilterKeysAndTheirSelectedValues,
  filters: EtoolsFilter[]) => {
  const availableFilters = [...filters];

  for (const fKey in selectedFilters) {
    if (fKey) {
      const selectedValue = selectedFilters[fKey as FilterKeys];
      if (selectedValue) {
        const filter = availableFilters.find((f: EtoolsFilter) => f.filterKey === fKey);
        if (filter) {
          filter.selectedValue = selectedValue instanceof Array
            ? [...selectedValue]
            : selectedValue;

          filter.selected = true;
        }
      }
    }
  }

  return availableFilters;
};

export const updateFilterSelectionOptions = (filters: EtoolsFilter[], fKey: string, options: GenericObject[]) => {
  const filter = filters.find((f: EtoolsFilter) => f.filterKey === fKey);
  if (filter && options) {
    if (!isJsonStrMatch(filter.selectionOptions, options)) {
      filter.selectionOptions = [...options];
    }
  }
};
