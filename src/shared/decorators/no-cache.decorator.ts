import { SetMetadata } from '@nestjs/common';

export const NO_CACHE_KEY = 'NO_CACHE';
export const NoCache = () => {
  return SetMetadata(NO_CACHE_KEY, true);
};
