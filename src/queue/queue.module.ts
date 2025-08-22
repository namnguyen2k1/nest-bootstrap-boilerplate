import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import cacheConfig from 'src/config/cache.config';
import { MailModule } from 'src/mail/mail.module';
import { EmailConsumer } from './email/email.consumer';
import { EmailProducer } from './email/email.producer';
import { QUEUE_CONFIG } from './queue.constant';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [cacheConfig.KEY],
      useFactory: (config: ConfigType<typeof cacheConfig>) => {
        return {
          connection: {
            url: config.redis.url,
          },
        };
      },
    }),

    BullModule.registerQueue({
      name: QUEUE_CONFIG.EMAIL.NAME,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),

    MailModule,
  ],
  providers: [EmailProducer, EmailConsumer],
})
export class QueueModule {}
