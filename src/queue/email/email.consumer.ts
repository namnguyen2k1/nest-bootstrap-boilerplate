import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService, SendOtpPayload } from 'src/mail/mail.service';
import { QUEUE_CONFIG } from '../queue.constant';

@Processor(QUEUE_CONFIG.EMAIL.NAME)
export class EmailConsumer extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { SEND_EMAIL } = QUEUE_CONFIG.EMAIL.JOBS;
    switch (job.name) {
      case SEND_EMAIL: {
        this.handleSendEmail(job);
        break;
      }
      // more jobs ...
      default: {
        console.log('[queue] received unknown job');
      }
    }
  }

  private async handleSendEmail(job: Job) {
    const payload: SendOtpPayload = job.data;
    await this.mailService.sendOTP(payload);
  }
}
