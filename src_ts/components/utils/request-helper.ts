import '@polymer/iron-ajax/iron-request.js';

class RequestError {
  constructor(error: any, statusCode: any, statusText: any, response: any) {
    this.error = error;
    this.status = statusCode;
    this.statusText = statusText;
    this.response = this._prepareResponse(response);
  }

  _prepareResponse(response: any) {
    try {
      return JSON.parse(response);
    } catch (e) {
      return response;
    }
  }
}

export class RequestEndpoint {
  url: string = '';
  method?: string = 'GET';
  handleAs?: string = 'json';

  constructor(url: string, method: string = 'GET', handleAs = 'json') {
    this.url = url;
    this.method = method;
    this.handleAs = handleAs;
  }
}

const createIronRequestElement = () => {
  const ironRequestElem = document.createElement('iron-request');
  return ironRequestElem;
};

const _getClientConfiguredHeaders = (additionalHeaders: any) => {
  let header;
  const clientHeaders: any = {};
  if (additionalHeaders && additionalHeaders instanceof Object) {
    /* eslint-disable guard-for-in */
    for (header in additionalHeaders) {
      clientHeaders[header] = additionalHeaders[header].toString();
    }
    /* eslint-enable guard-for-in */
  }
  return clientHeaders;
};

const _csrfSafeMethod = (method: string) => {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
};

const _getCSRFCookie = () => {
  // check for a csrftoken cookie and return its value
  const csrfCookieName = 'csrftoken';
  let csrfToken = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, csrfCookieName.length + 1) === (csrfCookieName + '=')) {
        csrfToken = decodeURIComponent(cookie.substring(csrfCookieName.length + 1));
        break;
      }
    }
  }
  return csrfToken;
};

const _getCsrfHeader = (csrfCheck: any) => {
  const csrfHeaders: any = {};
  if (csrfCheck !== 'disabled') {
    const csrfToken = _getCSRFCookie();

    if (csrfToken) {
      csrfHeaders['x-csrftoken'] = csrfToken;
    }
  }
  return csrfHeaders;
};

const _getRequestHeaders = (reqConfig: any) => {
  let headers: any = {};

  headers['content-type'] = 'application/json';

  const clientConfiguredHeaders = _getClientConfiguredHeaders(reqConfig.headers);

  let csrfHeaders = {};
  if (!_csrfSafeMethod(reqConfig.method)) {
    csrfHeaders = _getCsrfHeader(reqConfig.csrfCheck);
  }

  headers = Object.assign({}, headers, clientConfiguredHeaders, csrfHeaders);

  return headers;
};

const generateRequestConfigOptions = (endpoint: RequestEndpoint, body: any) => {
  const config = {
    url: endpoint.url,
    method: endpoint.method || 'GET',
    handleAs: endpoint.handleAs || 'json',
    headers: _getRequestHeaders({}),
    body: body
  };
  return config;
};

export const makeRequest = (endpoint: RequestEndpoint, data = {}) => {

  const reqConfig = generateRequestConfigOptions(endpoint, data);
  const requestElem = createIronRequestElement();

  requestElem.send(reqConfig);
  return requestElem!.completes!.then((result) => {
    return result.response;
  }).catch((error) => {
    throw new RequestError(error, requestElem!.xhr!.status, requestElem!.xhr!.statusText,
      requestElem!.xhr!.response);
  });
};
