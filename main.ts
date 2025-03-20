type InterceptorConfig = {
    onRequest?: (url: string, opts: RequestInit) => Promise<void>,
    onResponse?: (response: ResponseInit, url: string, opts: RequestInit) => Promise<void>
    fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

export const createFetchInterceptor = (config: InterceptorConfig) => {
    const { onRequest, onResponse } = config;

    const customFetch = async (url: string, opts: RequestInit = {}) => {
        if (onRequest) {
            await onRequest(url, opts);
        }
        let fetcher = fetch

        if (config.fetch) {
            fetcher = config.fetch
        }
        const response = await fetcher(url, opts);

        if (onResponse) {
            await onResponse(response, url, opts);
        }

        return response;
    };

    return customFetch;
};

