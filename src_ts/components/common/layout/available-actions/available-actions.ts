import {GenericObject} from '@unicef-polymer/etools-types/dist/global.types';
import {CSSResultArray, html, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax';
import {get as getTranslation} from 'lit-translate';
import {arrowLeftIcon} from '@unicef-polymer/etools-modules-common/dist/styles/app-icons';
import {formatServerErrorAsText} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-error-parser';
import '@unicef-polymer/etools-modules-common/dist/layout/are-you-sure';
import '../export-data';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';

import {ActionsStyles} from './actions-styles';

import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';

@customElement('available-actions')
export class AvailableActions extends LitElement {
  EXPORT_ACTIONS: string[] = [];
  BACK_ACTIONS: string[] = ['back'];
  CANCEL = 'cancel';
  ACTIONS_WITHOUT_CONFIRM: string[] = [];
  ACTIONS_WITH_INPUT: string[] = [];
  namesMap: GenericObject<string> = {};

  static get styles(): CSSResultArray {
    return [ActionsStyles];
  }
  protected render() {
    if (!this.actions) {
      return '';
    }
    const actions: Set<string> = new Set(this.actions);
    const exportActions: string[] = this.EXPORT_ACTIONS.filter((action: string) => actions.has(action));
    const backAction: string | undefined = this.BACK_ACTIONS.find((action: string) => actions.has(action));
    const [mainAction, ...groupedActions] = this.actions.filter(
      (action: string) => !exportActions.includes(action) && action !== backAction
    );
    return html`
      ${this.renderExport(exportActions)}${this.renderBackAction(backAction)}
      ${this.renderGroupedActions(mainAction, groupedActions)}
    `;
  }

  @property({type: Array})
  actions = [];

  @property({type: String})
  entityId!: string;

  actionsNamesMap;

  constructor() {
    super();
    this.actionsNamesMap = new Proxy(this.namesMap, {
      get(target: GenericObject<string>, property: string): string {
        return target[property] || property.replace('_', ' ');
      }
    });
  }

  private renderExport(actions: string[]) {
    const preparedExportActions = actions.map((action: string) => ({
      name: this.actionsNamesMap[action],
      type: action
    }));
    return actions.length
      ? html` <export-data .exportLinks="${preparedExportActions}" .tripId="${this.entityId}"></export-data> `
      : html``;
  }

  private renderBackAction(action?: string): TemplateResult {
    return action
      ? html`
          <etools-button variant="primary" class="back-button" @click="${() => this.processAction(action)}">
            ${arrowLeftIcon} <span>${this.actionsNamesMap[action]}</span>
          </etools-button>
        `
      : html``;
  }

  private renderGroupedActions(mainAction: string, actions: string[]): TemplateResult {
    const withAdditional = actions.length ? ' with-additional' : '';
    const onlyCancel = !actions.length && mainAction === this.CANCEL ? ` cancel-background` : '';
    const className = `main-button${withAdditional}${onlyCancel}`;
    return mainAction
      ? html`
          <etools-button
            variant="primary"
            class="${className} split-btn"
            @click="${() => this.processAction(mainAction)}"
          >
            <span>${this.actionsNamesMap[mainAction]}</span> ${this.getAdditionalTransitions(actions)}
          </etools-button>
        `
      : html``;
  }

  private getAdditionalTransitions(actions?: string[]): TemplateResult {
    if (!actions || !actions.length) {
      return html``;
    }
    return html`
      <sl-dropdown @click="${(event: MouseEvent) => event.stopImmediatePropagation()}">
        <etools-button slot="trigger" variant="primary" size="small">
          <etools-icon name="expand-more"></etools-icon>
        </etools-button>
        <sl-menu>
          ${actions.map(
            (action: string) => html`
              <sl-menu-item @click="${() => this.processAction(action)}">
                ${this.actionsNamesMap[action]}
              </sl-menu-item>
            `
          )}
        </sl-menu>
      </sl-dropdown>
    `;
  }

  async confirmAction(action: string) {
    if (this.ACTIONS_WITHOUT_CONFIRM.includes(action)) {
      return true;
    }
    const {message, btn} = this.getConfirmDialogDetails(action)!;
    return await openDialog({
      dialog: 'are-you-sure',
      dialogData: {
        content: message,
        confirmBtnText: btn || getTranslation('GENERAL.YES')
      }
    }).then(({confirmed}) => confirmed);
  }

  // Override in child component
  afterActionPatch(_entity: any) {
    throw new Error('Not Implemented');
  }

  // Override in child component
  getConfirmDialogDetails(_action: string) {
    throw new Error('Not Implemented');
  }

  getActionEndpoint(_action: string) {
    throw new Error('Not Implemented');
  }

  async processAction(action: string): Promise<void> {
    this.closeDropdown();

    if (!(await this.confirmAction(action))) {
      return;
    }
    const body = this.ACTIONS_WITH_INPUT.includes(action) ? await this.openActionsWithInputsDialogs(action) : {};
    if (body === null) {
      return;
    }

    const endpoint = this.getActionEndpoint(action)!;
    fireEvent(this, 'global-loading', {
      active: true,
      loadingSource: 'entity-actions'
    });
    sendRequest({
      endpoint,
      body,
      method: 'PATCH'
    })
      .then((entity: any) => {
        this.afterActionPatch(entity);
      })
      .catch((err: any) => {
        fireEvent(this, 'toast', {text: formatServerErrorAsText(err)});
      })
      .finally(() => {
        fireEvent(this, 'global-loading', {
          active: false,
          loadingSource: 'entity-actions'
        });
      });
  }

  private closeDropdown(): void {
    const element: SlDropdown | null = this.shadowRoot!.querySelector('sl-dropdown');
    if (element) {
      element.open = false;
    }
  }

  private openActionsWithInputsDialogs(action: string) {
    // TODO
    switch (action) {
      case 'cancel':
        return this.openCancelReason(action);
      case 'reject':
        return this.openCancelReason(action);
      default:
        return;
    }
  }

  private openCancelReason(action: string): Promise<any> {
    // TODO
    return openDialog({
      dialog: 'reason-popup',
      dialogData: {
        popupTitle: `${this.actionsNamesMap[action]} reason`,
        label: `${this.actionsNamesMap[action]} comment`
      }
    }).then(({confirmed, response}) => {
      if (!confirmed || !response) {
        return null;
      }
      if (action === 'cancel') {
        return {comment: response.comment};
      }
      if (action === 'reject') {
        return {comment: response.comment};
      }
      return null;
    });
  }
}
