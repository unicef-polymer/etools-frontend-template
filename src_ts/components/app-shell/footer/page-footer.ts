import {LitElement, html, customElement, property} from 'lit-element';
import {ROOT_PATH} from '../../../config/config';
import {
  layoutFlex,
  layoutVertical,
  layoutEndJustified,
  layoutHorizontal,
  layoutInline
} from '../../styles/lit-styles/flex-layout-styles';
/**
 * page footer element
 * @LitElement
 * @customElement
 */
@customElement('page-footer')
export class PageFooter extends LitElement {
  public render() {
    // main template
    // language=HTML
    return html`
      <style>
        :host {
          ${layoutVertical}
          ${layoutFlex}
          ${layoutEndJustified}
          padding: 18px 24px;
          width: 100%;
          min-height: 90px;
          box-sizing: border-box;
        }

        #footer-content {
          ${layoutHorizontal}
        }

        #unicef-logo {
          ${layoutHorizontal}
          ${layoutInline}
          padding-right: 30px;
        }

        #unicef-logo img {
          height: 28px;
          width: 118px;
        }

        .footer-link {
          margin: auto 16px;
          color: var(--secondary-text-color);
          text-decoration: none;
        }

        .footer-link:first-of-type {
          margin-left: 30px;
        }

        @media print {
          :host {
            display: none;
          }
        }
      </style>
      <footer>
        <div id="footer-content">
          <span id="unicef-logo">
            <img src="images/UNICEF_logo.png" alt="UNICEF logo" />
          </span>
          <!-- TODO: modify span to a with proper href values after footer pages are ready -->
          <!--   <span class="footer-link">Contact</span>
            <span class="footer-link">Disclaimers</span>
            <span class="footer-link">Privacy Policy</span> -->
        </div>
      </footer>
    `;
  }

  @property({type: String})
  rootPath: string = ROOT_PATH;
}
