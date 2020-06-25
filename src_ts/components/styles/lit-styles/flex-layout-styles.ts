import {css} from 'lit-element';

export const layout = css`
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
`;
export const layoutHorizontal = css`
  ${layout}
  -ms-flex-direction: row;
  -webkit-flex-direction: row;
  flex-direction: row;
`;
export const layoutVertical = css`
  ${layout}
  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
`;
export const layoutFlex = css`
  -ms-flex: 1 1 0.000000001px;
  -webkit-flex: 1;
  flex: 1;
  -webkit-flex-basis: 0.000000001px;
  flex-basis: 0.000000001px;
`;
export const layoutWrap = css`
  -ms-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
`;
export const layoutStartJustified = css`
  -ms-flex-pack: start;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
`;
export const layoutEndJustified = css`
  -ms-flex-pack: end;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
`;
export const layoutInline = css`
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;
`;
export const layoutCenter = css`
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
`;
export const layoutJustified = css`
  -ms-flex-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
`;
export const layoutCenterJustified = css`
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
`;
export const layoutStart = css`
  ms-flex-align: start;
  -webkit-align-items: flex-start;
  align-items: flex-start;
`;
export const layoutEnd = css`
  -ms-flex-align: end;
  -webkit-align-items: flex-end;
  align-items: flex-end;
`;
export const layoutSelfEnd = css`
  -ms-align-self: flex-end;
  -webkit-align-self: flex-end;
  align-self: flex-end;
`;
