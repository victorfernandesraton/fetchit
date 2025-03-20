type FetchFunction = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type InterceptorConfig = {
  onRequest?: (url: RequestInfo | URL, opts: RequestInit) => Promise<void>;
  onResponse?: (
    response: ResponseInit,
    url: RequestInfo | URL,
    opts: RequestInit,
  ) => Promise<void>;
  fetch?: FetchFunction;
};

export const createFetchInterceptor = (
  config: InterceptorConfig,
): FetchFunction => {
  const { onRequest, onResponse } = config;

  const customFetch = async (
    url: RequestInfo | URL,
    opts: RequestInit = {},
  ) => {
    if (onRequest) {
      await onRequest(url, opts);
    }
    let fetcher = fetch;

    if (config.fetch) {
      fetcher = config.fetch;
    }
    const response = await fetcher(url, opts);

    if (onResponse) {
      await onResponse(response, url, opts);
    }

    return response;
  };

  return customFetch;
};
