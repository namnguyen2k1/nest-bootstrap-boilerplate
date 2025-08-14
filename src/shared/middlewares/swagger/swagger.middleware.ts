import { INestApplication } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { BaseResponse } from '@shared/decorators/swagger-response';
import expressBasicAuth from 'express-basic-auth';
import swaggerConfig from 'src/config/swagger.config';
import { customCss } from './custom-css';

export function configureSwagger(app: INestApplication): void {
  const {
    swaggerTitle,
    swaggerDescription,
    swaggerApiVersion,
    swaggerPrefix,
    swaggerUsername,
    swaggerPassword,
    appUrl,
  } = app.get<ConfigType<typeof swaggerConfig>>(swaggerConfig.KEY);
  const config: DocumentBuilder = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion(swaggerApiVersion)
    .addBearerAuth();
  const document = SwaggerModule.createDocument(app, config.build(), {
    extraModels: [BaseResponse],
  });
  const options: SwaggerCustomOptions = {
    customSiteTitle: swaggerTitle,
    customCss: customCss(),
    swaggerOptions: {
      filter: true,
      persistAuthorization: true,
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
      docExpansion: 'none',
      tryItOutEnabled: true,
      displayRequestDuration: true,
      showExtensions: true,
      deepLinking: true,
    },
  };

  app.use(
    [swaggerPrefix],
    expressBasicAuth({
      challenge: true,
      users: {
        [`${swaggerUsername}`]: swaggerPassword,
      },
    }),
  );
  SwaggerModule.setup(swaggerPrefix, app, document, options);

  console.log(`[document] swagger is running at: ${appUrl}${swaggerPrefix}`);
}
