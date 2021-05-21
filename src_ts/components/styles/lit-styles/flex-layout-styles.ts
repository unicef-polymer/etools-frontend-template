import {css} from 'lit-element';

export const layout = css`
  display: flex;
`;
export const layoutHorizontal = css`
  ${layout}
  flex-direction: row;
`;
export const layoutVertical = css`
  ${layout}
  flex-direction: column;
`;
export const layoutFlex = css`
  flex: 1;
  flex-basis: 0.000000001px;
`;
export const layoutWrap = css`
  flex-wrap: wrap;
`;
export const layoutStartJustified = css`
  justify-content: flex-start;
`;
export const layoutEndJustified = css`
  justify-content: flex-end;
`;
export const layoutInline = css`
  display: inline-flex;
`;
export const layoutCenter = css`
  align-items: center;
`;
export const layoutJustified = css`
  justify-content: space-between;
`;
export const layoutCenterJustified = css`
  justify-content: center;
`;
export const layoutStart = css`
  align-items: flex-start;
`;
export const layoutEnd = css`
  align-items: flex-end;
`;
export const layoutSelfEnd = css`
  align-self: flex-end;
`;
