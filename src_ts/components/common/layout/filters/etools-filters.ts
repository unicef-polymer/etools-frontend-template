import {
  LitElement, html, customElement, property
} from 'lit-element';
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
import {GenericObject} from '../../../../types/globals';

export enum EtoolsFilterTypes {
  Search,
  Dropdown,
  DropdownMulti,
  Toggle,
  Date
}

export interface EtoolsFilter {
  filterName: string;
  type: EtoolsFilterTypes;
  selected: boolean; // flag filter as selected from filters menu
  selectedValue: any;
  disabled?: boolean;
  path: string; // data path to update, selectedFilters obj property name
  selectionOptions?: any[]; // used only by dropdowns
  minWidth?: string; // used only by dropdowns
  hideSearch?: boolean; // used only by dropdowns
  optionValue?: string; // used only by dropdowns
  optionLabel?: string; // used only by dropdowns
}

@customElement('etools-filters')
export class EtoolsFilters extends LitElement {

  @property({type: Object})
  selectedFilters: GenericObject = {};

  @property({type: Object})
  filters: EtoolsFilter[] = [];

  static get styles() {
    return [etoolsFiltersStyles];
  }

  getSearchTmpl(f: EtoolsFilter) {
    // language=HTML
    return html`
      <paper-input class="filter"
               type="search"
               autocomplete="off"
               .value="${f.selectedValue}"
               placeholder="${f.filterName}" 
               data-filter-path="${f.path}">
        <iron-icon icon="search" slot="prefix"></iron-icon>
      </paper-input>
    `;
  }

  getDropdownTmpl(f: EtoolsFilter) {
    // language=HTML
    return html`
      <etools-dropdown
          class="filter"
          label="${f.filterName}"
          placeholder="&#8212;"
          ?disabled="${f.disabled}"
          .options="${f.selectionOptions}"
          .optionValue="${f.optionValue ? f.optionValue : 'value'}"
          .optionLabel="${f.optionLabel ? f.optionLabel : 'label'}"
          .selected="${f.selectedValue}"
          trigger-value-change-event
          @etools-selected-item-changed="filterValueChanged"
          data-filter-path="${f.path}"
          ?hide-search="${f.hideSearch}"
          .minWidth="${f.minWidth}"
          .horizontalAlign="left"
          no-dynamic-align
          enable-none-option>
      </etools-dropdown>
    `;
  }

  getDropdownMultiTmpl(f: EtoolsFilter) {
    // language=HTML
    return html`
      <etools-dropdown-multi
          class="filter"
          label="${f.filterName}"
          placeholder="Select"
          ?disabled="${f.disabled}"
          .options="${f.selectionOptions}"
          .optionValue="${f.optionValue ? f.optionValue : 'value'}"
          .optionLabel="${f.optionLabel ? f.optionLabel : 'label'}"
          .selectedValues="${f.selectedValue}"
          trigger-value-change-event
          @etools-selected-item-changed="esmmValueChanged"
          data-filter-path="${f.path}"
          ?hide-search="${f.hideSearch}"
          .minWidth="${f.minWidth}"
          .horizontalAlign="left"
          no-dynamic-align
          enable-none-option>
      </etools-dropdown-multi>
    `;
  }

  getDateTmpl(f: EtoolsFilter) {
    // language=HTML
    return html`
      <datepicker-lite class="filter date"
                       .label="${f.filterName}"
                       .placeholder="&#8212;"
                       .value="${f.selectedValue}"
                       fire-date-has-changed
                       @date-has-changed="_filterDateHasChanged"
                       data-filter-path="${f.path}"
                       .selectedDateDisplayFormat="D MMM YYYY">
      </datepicker-lite>
    `;
  }

  getToggleTmpl(f: EtoolsFilter) {
    // language=HTML
    return html`
      <div class="filter" style="padding: 8px 0; box-sizing: border-box;">
        ${f.filterName}
        <paper-toggle-button id="toggleFilter" 
                             ?checked="${f.selectedValue}"
                             data-filter-path="${f.path}"
                             @iron-change="toggleValueChanged"></paper-toggle-button>
      </div>
    `;
  }

  get selectedFiltersTmpl() {
    const tmpl: any[] = [];
    this.filters
      .filter((f: EtoolsFilter) => f.selected)
      .forEach((f: EtoolsFilter) => {
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

  get filterMenuOptions() {
    const menuOptions: any[] = [];
    this.filters.forEach((f: EtoolsFilter) => {
      menuOptions.push(html`
        <paper-icon-item @tap="selectFilter" ?disabled="${f.disabled}" ?selected="${f.selected}">
          <iron-icon icon="check" slot="item-icon" ?hidden="${!f.selected}"></iron-icon>
          <paper-item-body>${f.filterName}</paper-item-body>
        </paper-icon-item>
      `);
    });
    return menuOptions;
  }

  render() {
    // language=HTML
    return html`      
        <div id="filters-fields">
          ${this.selectedFiltersTmpl}
        </div>

        <div class="fixed-controls">
          <paper-menu-button id="filterMenu" ignore-select horizontal-align="right">
            <paper-button class="button" slot="dropdown-trigger">
              <iron-icon icon="filter-list"></iron-icon>
              Filters
            </paper-button>
            <div slot="dropdown-content" class="clear-all-filters">
              <paper-button @tap="clearAllFilterValues"
                            class="secondary-btn">
                CLEAR ALL
              </paper-button>
            </div>
            <paper-listbox slot="dropdown-content" multi>
              ${this.filterMenuOptions}
            </paper-listbox>
          </paper-menu-button>
        </div>
    `;
  }

}
