import {html} from 'lit-element';
import {appDrawerStyles} from './menu/styles/app-drawer-styles';
import {layoutFlex} from '../styles/lit-styles/flex-layout-styles';

export const AppShellStyles = html`
${appDrawerStyles}
<style>
  :host {
    display: block;
  }

  app-header-layout {
    position: relative;
  }

  .main-content {
    ${layoutFlex}
  }

  .page {
    display: none;
  }

  .page[active] {
    display: block;
  }

</style>
`;
