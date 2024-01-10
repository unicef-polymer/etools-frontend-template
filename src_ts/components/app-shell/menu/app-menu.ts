import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

import {navMenuStyles} from './styles/nav-menu-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {ROOT_PATH, SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from '../../../config/config';
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {translate} from 'lit-translate';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';

/**
 * main menu
 * @LitElement
 * @customElement
 */
@customElement('app-menu')
export class AppMenu extends MatomoMixin(LitElement) {
  static get styles() {
    return [navMenuStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      <div class="menu-header">
        <span id="app-name"> Template </span>

        <sl-tooltip for="menu-header-top-icon" placement="right" content="Template">
          <span class="ripple-wrapper main">
            <etools-icon
              id="menu-header-top-icon"
              name="assignment-ind"
              @click="${() => this._toggleSmallMenu()}"
            ></etools-icon>
          </span>
        </sl-tooltip>

        <span class="chev-right">
          <etools-icon id="expand-menu" name="chevron-right" @click="${() => this._toggleSmallMenu()}"></etools-icon>
        </span>

        <span class="ripple-wrapper">
          <etools-icon id="minimize-menu" name="chevron-left" @click="${() => this._toggleSmallMenu()}"></etools-icon>
        </span>
      </div>

      <div class="nav-menu">
        <div class="menu-selector" role="navigation">
          <a
            class="nav-menu-item ${this.getItemClass(this.selectedOption, 'page-one')}"
            menu-name="page-one"
            href="${ROOT_PATH}page-one"
          >
            <sl-tooltip placement="right" ?disabled="${!this.smallMenu}" content="Page One">
              <etools-icon name="accessibility"></etools-icon>
            </sl-tooltip>
            <div class="name">Page One</div>
          </a>

          <a
            class="nav-menu-item ${this.getItemClass(this.selectedOption, 'page-two')}"
            menu-name="page-two"
            href="${ROOT_PATH}page-two"
          >
            <sl-tooltip placement="right" ?disabled="${!this.smallMenu}" content="Page Two">
              <etools-icon name="extension"></etools-icon>
            </sl-tooltip>
            <div class="name">Page Two</div>
          </a>
        </div>

        <div class="nav-menu-item section-title">
          <span>${translate('COMMUNITY_CHANNELS')}</span>
        </div>

        <a
          class="nav-menu-item lighter-item"
          href="http://etools.zendesk.com"
          target="_blank"
          @click="${this.trackAnalytics}"
          tracker="Knowledge base"
        >
          <sl-tooltip placement="right" ?disabled="${!this.smallMenu}" content="${translate('KNOWLEDGE_BASE')}">
            <etools-icon id="knoledge-icon" name="maps:local-library"></etools-icon>
          </sl-tooltip>
          <div class="name">${translate('KNOWLEDGE_BASE')}</div>
        </a>

        <a
          class="nav-menu-item lighter-item"
          href="https://www.yammer.com/unicef.org/#/threads/inGroup?type=in_group&feedId=5782560"
          target="_blank"
          @click="${this.trackAnalytics}"
          tracker="Discussion"
        >
          <sl-tooltip placement="right" ?disabled="${!this.smallMenu}" content="${translate('DISCUSSION')}">
            <etools-icon id="discussion-icon" name="question-answer"></etools-icon>
          </sl-tooltip>
          <div class="name">${translate('DISCUSSION')}</div>
        </a>
        <a
          class="nav-menu-item lighter-item last-one"
          href="https://etools.unicef.org/landing"
          target="_blank"
          @click="${this.trackAnalytics}"
          tracker="Information"
        >
          <sl-tooltip placement="right" ?disabled="${!this.smallMenu}" content="${translate('INFORMATION')}">
            <etools-icon id="information-icon" name="info"></etools-icon>
          </sl-tooltip>
          <div class="name">${translate('INFORMATION')}</div>
        </a>
      </div>
    `;
  }

  @property({type: String, attribute: 'selected-option'})
  public selectedOption = '';

  @property({type: String})
  rootPath: string = ROOT_PATH;

  @property({type: Boolean, attribute: 'small-menu'})
  public smallMenu = false;

  public _toggleSmallMenu(): void {
    this.smallMenu = !this.smallMenu;
    const localStorageVal: number = this.smallMenu ? 1 : 0;
    localStorage.setItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY, String(localStorageVal));
    fireEvent(this, 'toggle-small-menu', {value: this.smallMenu});
  }

  getItemClass(selectedValue: string, itemValue: string) {
    return selectedValue === itemValue ? 'selected' : '';
  }
}
