import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

export const configureHelmet = (app: INestApplication) => {
  app.use(helmet());
};
