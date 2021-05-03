import fetch from 'isomorphic-unfetch';

type AnyBody = Record<string, any> | any[] | null;

export interface VeedClient {
  get: <T>(url: string) => Promise<T>;
  delete: <T>(url: string) => Promise<T>;
  post: <T, TBody = AnyBody>(url: string, body?: TBody) => Promise<T>;
  put: <T, TBody = AnyBody>(url: string, body?: TBody) => Promise<T>;
}

async function makeRawApiRequest<T = any, TBody = any>(authKey: string, method: string, url: string, body?: TBody): Promise<T> {
  const requestInit: RequestInit = {
    method: method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authKey
    }
  };

  if (body) {
    requestInit.body = body as any;
  }

  try {
    const response = await fetch(url, requestInit);
    const bodyText = await response.text();

    if (response.ok) {
      // handle non-json responses
      return !!bodyText && bodyText.length > 0 ? (JSON.parse(bodyText) as T) : null;
    } else {
      const error = new Error(response.statusText);
      (error as any).response = response;
      (error as any).data = {
        responsePayload: response,
        requestInfo: url,
        requestInit: requestInit,
        statusText: response.statusText,
        responseBody: bodyText
      };
      throw error;
    }
  } catch (error) {
    if (!error.data) {
      error.data = {};
    }
    error.data.message = error.message;
    error.data.description = error.description;

    throw error;
  }
}

export default function getVeedClient(apiKey: string): VeedClient {
  return {
    get: <T>(url: string): Promise<T> => makeRawApiRequest(apiKey, 'GET', url, undefined),
    delete: <T>(url: string): Promise<T> => makeRawApiRequest(apiKey, 'DELETE', url, undefined),
    post: <T = void, TBody = AnyBody>(url: string, body: TBody): Promise<T> => makeRawApiRequest(apiKey, 'POST', url, JSON.stringify(body || {})),
    put: <T = void, TBody = AnyBody>(url: string, body: TBody): Promise<T> => makeRawApiRequest(apiKey, 'PUT', url, JSON.stringify(body || {}))
  };
}
