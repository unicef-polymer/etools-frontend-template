import {css} from 'lit-element';
// language=HTML
export const radioButtonStyles = css`
  .epc-header-radio-button {
    min-width: 120px;
  }
  paper-radio-button.red {
    --paper-radio-button-checked-color: var(--primary-shade-of-red);
    --paper-radio-button-unchecked-color: var(--primary-shade-of-red);
  }
  paper-radio-button.orange {
    --paper-radio-button-checked-color: var(--primary-shade-of-orange);
    --paper-radio-button-unchecked-color: var(--primary-shade-of-orange);
  }
  paper-radio-button.green {
    --paper-radio-button-checked-color: var(--primary-shade-of-green);
    --paper-radio-button-unchecked-color: var(--primary-shade-of-green);
  }
  .red-border{
    border: solid 1px var(--primary-shade-of-red);
  }
  .orange-border{
    border: solid 1px var(--primary-shade-of-orange);
  }
  .green-border{
    border: solid 1px var(--primary-shade-of-green);
  }
`;
