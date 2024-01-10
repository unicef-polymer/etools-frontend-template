export const SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY = 'etoolsAppSmallMenuIsActive';

declare global {
  interface Window {
    EtoolsEsmmFitIntoEl: any;
    applyFocusVisiblePolyfill: any;
    ajaxErrorParserTranslateFunction: any;
    dayjs: any;
    EtoolsLanguage: string;
  }
}

export const ROOT_PATH = '/' + getBasePath().replace(window.location.origin, '').slice(1, -1) + '/';

const PROD_DOMAIN = 'etools.unicef.org';

function getBasePath() {
  return document.getElementsByTagName('base')[0].href;
}

export const getDomainByEnv = () => {
  return getBasePath().slice(0, -1);
};

export const isProductionServer = () => {
  const location = window.location.host;
  return location.indexOf('demo.unicef.io') > -1 || location.indexOf(PROD_DOMAIN) > -1;
};
