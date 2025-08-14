import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpClientConfig } from './http-client-config';
import { HttpClientService } from './http-client.service';
import { JsonPlaceholderService } from './third-part-services/json-placeholder/json-placeholder.service';
import { TelegramBotService } from './third-part-services/telegram/telegram-bot.service';

const PROVIDERS = [
  HttpClientService,
  JsonPlaceholderService,
  TelegramBotService,
];

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpClientConfig,
    }),
  ],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class HttpClientModule {}
