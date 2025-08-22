import { INestApplication } from '@nestjs/common';
import * as morgan from 'morgan';

export enum MORGAN_MODE {
  COMBINED = 'combined',
  COMMON = 'common',
  DEV = 'dev',
  SHORT = 'short',
  TINY = 'tiny',
}

export const configureMorgan = (
  app: INestApplication,
  option = MORGAN_MODE.DEV,
) => {
  app.use(morgan(option));
};
