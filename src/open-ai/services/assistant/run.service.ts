import { Injectable } from "@nestjs/common";
import { OpenAIProvider } from "@open-ai/open-ai.provider";
import {
  AssistantStream,
  RequestOptions,
  Run,
  RunCreateParamsBaseStream,
  RunCreateParamsNonStreaming,
  RunSubmitToolOutputsParamsNonStreaming,
  RunSubmitToolOutputsParamsStream,
} from "@open-ai/open-ai.type";
import { getRequestOptions } from "@open-ai/utils/get-request-options";

@Injectable()
export class OpenAIRunService {
  constructor(private readonly openAI: OpenAIProvider) {}

  async createAndPoll(
    threadId: string,
    body: RunCreateParamsNonStreaming,
    options?: RequestOptions,
  ): Promise<Run> {
    return this.openAI.beta.threads.runs.createAndPoll(threadId, body, getRequestOptions(options));
  }

  createStream(
    threadId: string,
    body: RunCreateParamsBaseStream,
    options?: RequestOptions,
  ): AssistantStream {
    return this.openAI.beta.threads.runs.stream(threadId, body, getRequestOptions(options));
  }

  async submitToolOutputsAndPoll(
    runId: string,
    params: RunSubmitToolOutputsParamsNonStreaming,
    options?: RequestOptions,
  ): Promise<Run> {
    return await this.openAI.beta.threads.runs.submitToolOutputsAndPoll(
      runId,
      params,
      getRequestOptions(options),
    );
  }

  submitToolOutputsStream(
    runId: string,
    params: RunSubmitToolOutputsParamsStream,
    options?: RequestOptions,
  ): AssistantStream {
    return this.openAI.beta.threads.runs.submitToolOutputsStream(
      runId,
      params,
      getRequestOptions(options),
    );
  }
}
