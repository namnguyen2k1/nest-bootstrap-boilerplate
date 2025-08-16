import { RequestOptions } from '@open-ai/open-ai.type';

export const DEFAULT_REQUEST_OPTIONS: RequestOptions = {
  stream: false,
  maxRetries: 5,
  timeout: 600000,
};

export function getRequestOptions(
  options: RequestOptions = {},
): RequestOptions {
  const { stream, maxRetries, timeout } = DEFAULT_REQUEST_OPTIONS;

  options.stream = options?.stream ?? stream;
  options.maxRetries = options?.maxRetries ?? maxRetries;
  options.timeout = options?.timeout ?? timeout;

  return options;
}
