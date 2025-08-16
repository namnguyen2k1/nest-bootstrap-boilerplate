import { Injectable } from '@nestjs/common';
import { OpenAIProvider } from '@open-ai/open-ai.provider';
import {
  FineTuningJob,
  FineTuningJobEventsPage,
  FineTuningJobsPage,
  JobCreateParams,
  JobListEventsParams,
  JobListParams,
  RequestOptions,
} from '@open-ai/open-ai.type';
import { getRequestOptions } from '@open-ai/utils/get-request-options';
import { getRequestQueries } from '@open-ai/utils/get-request-queries';

@Injectable()
export class OpenAIFineTuningService {
  constructor(private readonly openAI: OpenAIProvider) {}

  async list(
    query?: JobListParams,
    options?: RequestOptions,
  ): Promise<FineTuningJobsPage> {
    return await this.openAI.fineTuning.jobs.list(
      getRequestQueries(query),
      getRequestOptions(options),
    );
  }

  async listEvents(
    fineTuningJobID: string,
    query?: JobListEventsParams,
    options?: RequestOptions,
  ): Promise<FineTuningJobEventsPage> {
    return await this.openAI.fineTuning.jobs.listEvents(
      fineTuningJobID,
      getRequestQueries(query),
      getRequestOptions(options),
    );
  }

  async create(
    body: JobCreateParams,
    options?: RequestOptions,
  ): Promise<FineTuningJob> {
    return await this.openAI.fineTuning.jobs.create(
      body,
      getRequestOptions(options),
    );
  }

  async retrieve(
    fineTuningJobID: string,
    options?: RequestOptions,
  ): Promise<FineTuningJob> {
    return await this.openAI.fineTuning.jobs.retrieve(
      fineTuningJobID,
      getRequestOptions(options),
    );
  }

  async cancel(
    fineTuningJobID: string,
    options?: RequestOptions,
  ): Promise<FineTuningJob> {
    return await this.openAI.fineTuning.jobs.cancel(
      fineTuningJobID,
      getRequestOptions(options),
    );
  }
}
