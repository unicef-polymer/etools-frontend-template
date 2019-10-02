export const fireEvent = (el: HTMLElement, eventName: string, eventDetail?: any) => {
  el.dispatchEvent(new CustomEvent(eventName, {
    detail: eventDetail,
    bubbles: true,
    composed: true
  }));
};
