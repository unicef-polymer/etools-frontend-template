import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@polymer/paper-styles/element-styles/paper-material-styles';
import '@polymer/paper-button/paper-button';

import {SharedStyles} from '../../styles/shared-styles';
import '../../common/layout/page-content-header/page-content-header';
import {property} from '@polymer/decorators';
import {pageContentHeaderSlottedStyles} from
      '../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';

import {GenericObject} from '../../../types/globals';
import '../../common/layout/etools-table/etools-table';

/**
 * @polymer
 * @customElement
 */
class EngagementsList extends PolymerElement {

  public static get template() {
    // main template
    // language=HTML
    return html`
      ${SharedStyles} ${pageContentHeaderSlottedStyles} ${pageLayoutStyles}
      <style include="paper-material-styles"></style>

      <page-content-header>
        <h1 slot="page-title">Engagements list</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <paper-button raised>Export</paper-button>
        </div>
      </page-content-header>
      
      <section class="paper-material page-content" elevation="1">
        <a style="margin-bottom: 24px;" href$="[[rootPath]]engagements/23/details">Go to engagement details pages :)</a>
        
        <etools-table caption="Engagements list - optional table title" items="[[listData]]"></etools-table>
      </section>
    `;
  }

  @property({type: Array})
  listData: GenericObject[] = [];

}

window.customElements.define('engagements-list', EngagementsList);
