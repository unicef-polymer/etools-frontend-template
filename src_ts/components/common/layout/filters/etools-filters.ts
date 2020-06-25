import {LitElement, html, customElement, property, css} from 'lit-element';
import {etoolsFiltersStyles} from './etools-filters-styles';

import '@polymer/iron-icons/iron-icons';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-toggle-button/paper-toggle-button';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-icon-item';
import '@polymer/paper-item/paper-item-body';

import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-date-time/datepicker-lite';
import {elevation2} from '../../../styles/lit-styles/elevation-styles';

export enum EtoolsFilterTypes {
  Search,
  Dropdown,
  DropdownMulti,
  Toggle,
  Date
}

export interface EtoolsFilter {
  filterName: string;
  filterKey: string;
  type: EtoolsFilterTypes;
  selected: boolean; // flag filter as selected from filters menu
  selectedValue: any;
  disabled?: boolean;
  selectionOptions?: any[]; // used only by dropdowns
  minWidth?: string; // used only by dropdowns
  hideSearch?: boolean; // used only by dropdowns
  optionValue?: string; // used only by dropdowns
  optionLabel?: string; // used only by dropdowns
}

@customElement('etools-filters')
export class EtoolsFilters extends LitElement {
  @property({type: Array})
  filters: EtoolsFilter[] = [];

  private lastSelectedValues: any = null;

  static get styles() {
    return [
      etoolsFiltersStyles,
      css`
        /* Set datepicker prefix icon color using mixin (cannot be used in etools-filter-styles) */
        datepicker-lite {
          --paper-input-prefix: {
            color: var(--secondary-text-color, rgba(0, 0, 0, 0.54));
          }
        }
        *[hidden] {
          display: none !important;
        }

        paper-button:focus {
          ${elevation2}
        }

        .date {
          margin-right: 16px;
        }
      `
    ];
  }

  getSearchTmpl(f: EtoolsFilter) {
    // language=HTML
    return html`
      <paper-input
        class="filter search"
        ?hidden="${!f.selected}"
        type="search"
        autocomplete="off"
        .value="${f.selectedValue}"
        placeholder="${f.filterName}"
        data-filter-key="${f.filterKey}"
        @value-changed="${this.textInputChange}"
      >
        <iron-icon icon="search" slot="prefix"></iron-icon>
      </paper-input>
    `;
  }

  getDropdownTmpl(f: EtoolsFilter) {
    // language=HTML
    return html`
      <etools-dropdown
        ?hidden="${!f.selected}"
        class="filter"
        label="${f.filterName}"
        placeholder="&#8212;"
        ?disabled="${f.disabled}"
        .options="${f.selectionOptions}"
        .optionValue="${f.optionValue ? f.optionValue : 'value'}"
        .optionLabel="${f.optionLabel ? f.optionLabel : 'label'}"
        .selected="${f.selectedValue}"
        trigger-value-change-event
        @etools-selected-item-changed="${this.filterSelectionChange}"
        data-filter-key="${f.filterKey}"
        ?hide-search="${f.hideSearch}"
        .minWidth="${f.minWidth}"
        horizontal-align="left"
        no-dynamic-align
        enable-none-option
      >
      </etools-dropdown>
    `;
  }

  getDropdownMultiTmpl(f: EtoolsFilter) {
    // language=HTML
    return html`
      <etools-dropdown-multi
        id="${f.filterKey}"
        ?hidden="${!f.selected}"
        class="filter"
        label="${f.filterName}"
        placeholder="Select"
        ?disabled="${f.disabled}"
        .options="${f.selectionOptions}"
        .optionValue="${f.optionValue ? f.optionValue : 'value'}"
        .optionLabel="${f.optionLabel ? f.optionLabel : 'label'}"
        .selectedValues="${[...f.selectedValue]}"
        trigger-value-change-event
        @etools-selected-items-changed="${this.filterMultiSelectionChange}"
        data-filter-key="${f.filterKey}"
        ?hide-search="${f.hideSearch}"
        .minWidth="${f.minWidth}"
        horizontal-align="left"
        no-dynamic-align
      >
      </etools-dropdown-multi>
    `;
  }

  getDateTmpl(f: EtoolsFilter) {
    // language=HTML
    return html`
      <datepicker-lite
        class="filter date"
        ?hidden="${!f.selected}"
        .label="${f.filterName}"
        .value="${f.selectedValue}"
        fire-date-has-changed
        @date-has-changed="${this.filterDateChange}"
        data-filter-key="${f.filterKey}"
        selected-date-display-format="D MMM YYYY"
      >
      </datepicker-lite>
    `;
  }

  getToggleTmpl(f: EtoolsFilter) {
    // language=HTML
    return html`
      <div class="filter toggle" ?hidden="${!f.selected}" style="padding: 8px 0; box-sizing: border-box;">
        ${f.filterName}
        <paper-toggle-button
          id="toggleFilter"
          ?checked="${f.selectedValue}"
          data-filter-key="${f.filterKey}"
          @iron-change="${this.filterToggleChange}"
        >
        </paper-toggle-button>
      </div>
    `;
  }

  selectedFiltersTmpl(filters: EtoolsFilter[]) {
    if (!filters) {
      return html``;
    }
    const tmpl: any[] = [];
    filters.forEach((f: EtoolsFilter) => {
      let filterHtml = null;
      switch (f.type) {
        case EtoolsFilterTypes.Search:
          filterHtml = this.getSearchTmpl(f);
          break;
        case EtoolsFilterTypes.Dropdown:
          filterHtml = this.getDropdownTmpl(f);
          break;
        case EtoolsFilterTypes.DropdownMulti:
          filterHtml = this.getDropdownMultiTmpl(f);
          break;
        case EtoolsFilterTypes.Date:
          filterHtml = this.getDateTmpl(f);
          break;
        case EtoolsFilterTypes.Toggle:
          filterHtml = this.getToggleTmpl(f);
          break;
      }
      if (filterHtml) {
        tmpl.push(filterHtml);
      }
    });
    return tmpl;
  }

  filterMenuOptions(filters: EtoolsFilter[]) {
    if (!this.filters) {
      return [];
    }
    const menuOptions: any[] = [];
    filters.forEach((f: EtoolsFilter) => {
      // language=HTML
      menuOptions.push(html`
        <paper-icon-item
          @tap="${this.selectFilter}"
          ?disabled="${f.disabled}"
          ?selected="${f.selected}"
          data-filter-key="${f.filterKey}"
        >
          <iron-icon icon="check" slot="item-icon" ?hidden="${!f.selected}"></iron-icon>
          <paper-item-body>${f.filterName}</paper-item-body>
        </paper-icon-item>
      `);
    });
    return menuOptions;
  }

  render() {
    this.setDefaultLastSelectedValues();

    // language=HTML
    return html`
      <div id="filters">
        ${this.selectedFiltersTmpl(this.filters)}
      </div>

      <div id="filters-selector">
        <paper-menu-button id="filterMenu" ignore-select horizontal-align="right">
          <paper-button class="button" slot="dropdown-trigger">
            <iron-icon icon="filter-list"></iron-icon>
            Filters
          </paper-button>
          <div slot="dropdown-content" class="clear-all-filters">
            <paper-button @tap="${this.clearAllFilterValues}" class="secondary-btn">
              CLEAR ALL
            </paper-button>
          </div>
          <paper-listbox slot="dropdown-content" multi>
            ${this.filterMenuOptions(this.filters)}
          </paper-listbox>
        </paper-menu-button>
      </div>
    `;
  }

  setDefaultLastSelectedValues() {
    if (!this.lastSelectedValues && this.filters) {
      this.lastSelectedValues = this.getAllFiltersAndTheirValues();
    }
  }

  clearAllFilterValues() {
    if (this.filters.length === 0) {
      return;
    }
    this.filters.forEach((f: EtoolsFilter) => {
      f.selectedValue = this.getFilterEmptyValue(f.type);
    });
    // repaint
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  selectFilter(e: CustomEvent) {
    const menuOption = e.currentTarget as HTMLElement;
    const filterOption: EtoolsFilter = this.getFilterOption(menuOption);
    const wasSelected: boolean = menuOption.hasAttribute('selected');
    // toggle selected state
    filterOption.selected = !wasSelected;
    // reset selected value if filter was unselected and had a value
    if (wasSelected) {
      filterOption.selectedValue = this.getFilterEmptyValue(filterOption.type);
    }
    // repaint&fire change event
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  // get filter empty value by type
  getFilterEmptyValue(filterType: EtoolsFilterTypes) {
    switch (filterType) {
      case EtoolsFilterTypes.Search:
        return '';
      case EtoolsFilterTypes.Toggle:
        return false;
      case EtoolsFilterTypes.Date:
      case EtoolsFilterTypes.Dropdown:
        return null;
      case EtoolsFilterTypes.DropdownMulti:
        return [];
    }
  }

  getFilterOption(filterElement: HTMLElement) {
    const filterKey = filterElement.getAttribute('data-filter-key');
    if (!filterKey) {
      throw new Error('[EtoolsFilters.getFilterOption] No data-filter-key attr found on clicked option');
    }

    const filterOption: EtoolsFilter | undefined = this.filters.find((f: EtoolsFilter) => f.filterKey === filterKey);

    if (!filterOption) {
      // something went wrong... filter option not found
      throw new Error(`[EtoolsFilters.getFilterOption] Filter option not found by filterKey: "${filterKey}"`);
    }
    return filterOption;
  }

  textInputChange(e: CustomEvent) {
    if (!e.detail) {
      return;
    }
    const filterEl = e.currentTarget as HTMLElement;
    const filterOption: EtoolsFilter = this.getFilterOption(filterEl);
    if (filterOption.selectedValue === e.detail.value) {
      return;
    }
    filterOption.selectedValue = e.detail.value;
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  filterSelectionChange(e: CustomEvent) {
    const filterEl = e.currentTarget as HTMLElement;
    const filterOption: EtoolsFilter = this.getFilterOption(filterEl);
    filterOption.selectedValue = e.detail.selectedItem ? e.detail.selectedItem[(filterEl as any).optionValue] : null;
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  filterMultiSelectionChange(e: CustomEvent) {
    const filterEl = e.currentTarget as HTMLElement;
    const filterOption: EtoolsFilter = this.getFilterOption(filterEl);
    const currentSelectedVal =
      e.detail.selectedItems.length > 0
        ? e.detail.selectedItems.map((optionObj: any) => optionObj[(filterEl as any).optionValue])
        : [];
    if (JSON.stringify(currentSelectedVal) === JSON.stringify(filterOption.selectedValue)) {
      return;
    }
    filterOption.selectedValue = currentSelectedVal;
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  filterDateChange(e: CustomEvent) {
    const filterEl = e.currentTarget as HTMLElement;
    const filterOption: EtoolsFilter = this.getFilterOption(filterEl);
    filterOption.selectedValue = (filterEl as any).value; // get datepicker value
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  filterToggleChange(e: CustomEvent) {
    if (!e.detail) {
      return;
    }
    const filterEl = e.currentTarget as HTMLElement;
    const filterOption: EtoolsFilter = this.getFilterOption(filterEl);
    if (filterOption.selectedValue === (filterEl as any).checked) {
      return;
    }
    filterOption.selectedValue = (filterEl as any).checked; // get toggle btn value
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  // update filter values from parent element (! one way data flow)
  updateFilters(filterValues: any) {
    if (!filterValues || Object.keys(filterValues).length === 0) {
      return;
    }
    const keys: string[] = Object.keys(filterValues);
    this.filters.forEach((f: EtoolsFilter) => {
      if (keys.indexOf(f.filterKey) > -1) {
        // filter found by key
        if (!f.selected) {
          // select filter is not already selected
          f.selected = true;
        }
        // update value
        f.selectedValue = filterValues[f.filterKey];
      }
    });
    this.requestUpdate();
    this.lastSelectedValues = {...this.getAllFiltersAndTheirValues(), ...filterValues};
  }

  // fire change custom event to notify parent that filters were updated
  fireFiltersChangeEvent() {
    const selectedValues = this.getAllFiltersAndTheirValues();
    if (JSON.stringify(this.lastSelectedValues) === JSON.stringify(selectedValues)) {
      return;
    }
    this.lastSelectedValues = {...selectedValues};

    this.dispatchEvent(
      new CustomEvent('filter-change', {
        detail: this.getSelectedFiltersAndTheirValues(),
        bubbles: true,
        composed: true
      })
    );
  }

  // build and return and object based on filterKey and selectedValue
  getAllFiltersAndTheirValues() {
    const allFilters: any = {};
    if (this.filters) {
      this.filters.forEach((f: EtoolsFilter) => {
        allFilters[f.filterKey] = f.selectedValue;
      });
    }
    return allFilters;
  }

  getSelectedFiltersAndTheirValues() {
    const selectedFilters: any = {};
    this.filters.forEach((f: EtoolsFilter) => {
      if (f.selected) {
        selectedFilters[f.filterKey] = f.selectedValue;
      }
    });
    return selectedFilters;
  }
}
