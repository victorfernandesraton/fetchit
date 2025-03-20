type FetchFunction = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type FetchFunctionResult = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<CustomResponse>;

type InterceptorConfig = {
  onRequest?: (url: RequestInfo | URL, opts: RequestInit) => Promise<void>;
  onResponse?: (
    response: ResponseInit,
    url: RequestInfo | URL,
    opts: RequestInit,
  ) => Promise<void>;
  fetch?: FetchFunction;
};

class CustomResponse extends Response {
  raiseStatus(controller?: AbortController): void {
    if (this.status < 200 || this.status >= 300) {
      const errorMessage = `Erro: Status ${this.status} - ${this.statusText}`;
      if (controller) {
        controller.abort();
      }
      throw new Error(errorMessage);
    }
  }
}

export const createFetchInterceptor = (
  config: InterceptorConfig,
): FetchFunctionResult => {
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
    const customResponse = new CustomResponse(response.body, {
      ...response,
      status: response.status,
      statusText: response.statusText,
    });

    if (onResponse) {
      await onResponse(customResponse, url, opts);
    }

    return customResponse;
  };

  return customFetch;
};
