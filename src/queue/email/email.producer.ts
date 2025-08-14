import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SendOtpPayload } from 'src/mail/mail.service';
import { QUEUE_CONFIG } from '../queue.constant';

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue(QUEUE_CONFIG.EMAIL.NAME) private queue: Queue) {}

  async sendEmailJob(data: SendOtpPayload) {
    await this.queue.add(QUEUE_CONFIG.EMAIL.JOBS.SEND_EMAIL, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
  }
}
