import {EtoolsFilter, EtoolsFilterTypes} from '../../../common/layout/filters/etools-filters';
import {GenericObject} from '../../../../types/globals';
import {isJsonStrMatch} from '../../../utils/utils';

export const defaultSelectedFilters: GenericObject = {
  q: '',
  status: [],
  unicef_focal_point: [],
  partner: [],
  assessment_date: null
};

export const assessmentsFilters: EtoolsFilter[] = [
  {
    filterName: 'Search assessment',
    filterKey: 'q',
    type: EtoolsFilterTypes.Search,
    selectedValue: '',
    selected: true
  },
  {
    filterName: 'Status',
    filterKey: 'status',
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
    filterName: 'Unicef Focal Point',
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
    filterKey: 'partner',
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
    filterKey: 'assessment_date',
    type: EtoolsFilterTypes.Date,
    selectedValue: null,
    selected: false
  },
  {
    filterName: 'Assessor Unicef Staff',
    filterKey: 'assessor_staff',
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
    filterKey: 'assessor_firm',
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
    filterKey: 'assessor_external',
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

export const updateFilterSelectionOptions = (filters: EtoolsFilter[], fKey: string, options: GenericObject[]) => {
  let updatedFilters: EtoolsFilter[] = [...filters];
  const filter = updatedFilters.find((f: EtoolsFilter) => f.filterKey === fKey);
  if (filter && options) {
    if (!isJsonStrMatch(filter.selectionOptions, options)) {
      filter.selectionOptions = [...options];
      updatedFilters = [...updatedFilters];
    }
  }
  return updatedFilters;
};
