import {customElement} from 'lit/decorators.js';
import {AvailableActions} from '../../../common/layout/available-actions/available-actions';
import {ACTIONS_WITHOUT_CONFIRM, EXPORT_ACTIONS, namesMap} from './actions.js';

@customElement('page-one-actions')
export class PageOneActions extends AvailableActions {
  constructor() {
    super();

    this.EXPORT_ACTIONS = EXPORT_ACTIONS;
    this.ACTIONS_WITHOUT_CONFIRM = ACTIONS_WITHOUT_CONFIRM;
    this.namesMap = namesMap;
  }
}
