import {EtoolsFilter, EtoolsFilterTypes} from '../../../common/layout/filters/etools-filters';
import {GenericObject} from '../../../../types/globals';

export const defaultSelectedFilters: GenericObject = {
  q: '',
  staff_member: [],
  status: [],
  unicef_focal_point: [],
  partner: [],
  assessment_date: null
};

export const engagementsFilters: EtoolsFilter[] = [
  {
    filterName: 'Search engagement',
    filterKey: 'q',
    type: EtoolsFilterTypes.Search,
    selectedValue: '',
    selected: true
  },
  {
    filterName: 'Staff Member',
    filterKey: 'staff_member',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: 'Status',
    filterKey: 'status',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: 'Unicef Focal Point',
    filterKey: 'unicef_focal_point',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: 'Partner Org',
    filterKey: 'partner',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: 'Assessment Date',
    filterKey: 'assessment_date',
    type: EtoolsFilterTypes.Date,
    selectedValue: null,
    selected: false
  }
];

export const updateFiltersSelectedValues = (selectedFilters: GenericObject, filters: EtoolsFilter[]) => {
  const updatedFilters = [...filters];
  for (const fKey in selectedFilters) {
    if (selectedFilters[fKey]) {
      const filter = updatedFilters.find((f: EtoolsFilter) => f.filterKey === fKey);
      if (filter) {
        filter.selectedValue = selectedFilters[fKey] instanceof Array
            ? [...selectedFilters[fKey]]
            : selectedFilters[fKey];
      }
    }
  }
  return updatedFilters;
};
