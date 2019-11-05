const PROD_DOMAIN = 'etools.unicef.org';
const STAGING_DOMAIN = 'etools-staging.unicef.org';
const DEV_DOMAIN = 'etools-dev.unicef.org';
const DEMO_DOMAIN = 'etools-demo.unicef.org';

export const SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY = 'etoolsAppSmallMenuIsActive';
export const ROOT_PATH = '/';

export const isProductionServer = () => {
  const location = window.location.href;
  return location.indexOf(PROD_DOMAIN) > -1;
};

export const isStagingServer = () => {
  const location = window.location.href;
  return location.indexOf(STAGING_DOMAIN) > -1;
};

export const isDevServer = () => {
  const location = window.location.href;
  return location.indexOf(DEV_DOMAIN) > -1;
};

export const isDemoServer = () => {
  const location = window.location.href;
  return location.indexOf(DEMO_DOMAIN) > -1;
};

export function setLoggingLevel() {
  if (isProductionServer()) {
    window.EtoolsLogsLevel = 'ERROR';
  } else {
    window.EtoolsLogsLevel = 'INFO';
  }
}
