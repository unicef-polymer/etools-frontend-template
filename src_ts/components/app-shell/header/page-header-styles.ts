import {html} from 'lit-element';
import {layoutFlex, layoutHorizontal, layoutCenter} from '../../styles/lit-styles/flex-layout-styles';

// language=HTML
export const pageHeaderStyles = html`
  <style>
    app-toolbar {
      padding: 0 16px 0 0;
      height: 60px;
    }

    .titlebar {
      color: var(--header-color);
    }

    #menuButton {
      display: block;
      color: var(--header-color);
    }

    support-btn {
      margin-left: 24px;
      color: var(--header-color);
    }

    etools-profile-dropdown {
      margin-left: 16px;
    }

    .titlebar {
      ${layoutFlex}
      font-size: 28px;
      font-weight: 300;
    }

    .titlebar img {
      width: 34px;
      margin: 0 8px 0 24px;
    }

    .content-align {
      ${layoutHorizontal}
      ${layoutCenter}
    }

    #app-logo {
      height: 32px;
      width: auto;
    }

    .envWarning {
      color: var(--nonprod-text-warn-color);
      font-weight: 700;
      font-size: 18px;
    }

    @media (min-width: 850px) {
      #menuButton {
        display: none;
      }
    }

    @media (max-width: 768px) {
      #envWarning {
        display: none;
      }
      .titlebar img {
        margin: 0 8px 0 12px;
      }
      support-btn {
        margin-left: 14px;
      }
      etools-profile-dropdown{
        margin-left: 12px;
        width: 40px;
      }
    }
  </style>
`;
