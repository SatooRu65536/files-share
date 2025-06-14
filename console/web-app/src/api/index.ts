import { Api, ApiError,FullRequestParams, HttpResponse } from './consoleApi';

export const api = new Api();
api.baseUrl = `${new URL(document.baseURI).pathname}api/v1`;
const internalRequestFunc = api.request;
api.request = async <T = any, E = any>({
  baseUrl,
  body,
  cancelToken,
  format,
  path,
  query,
  secure,
  type,
  ...params
}: FullRequestParams): Promise<HttpResponse<T, E>> => {
  const internalResp = internalRequestFunc({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params,
  });
  return internalResp.then((e) => CommonAPIValidation(e));
};

export function CommonAPIValidation<D, E>(res: HttpResponse<D, E>): HttpResponse<D, E> {
  const err = res.error as ApiError;
  if (err && res.status === 403 && err.message === 'invalid session') {
    if (window.location.pathname !== '/login') {
      document.location = '/login';
    }
  }
  return res;
}
