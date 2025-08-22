import { Injectable } from "@nestjs/common";
import { OpenAIProvider } from "@open-ai/open-ai.provider";
import {
  Assistant,
  AssistantCreateParams,
  AssistantDeleted,
  AssistantListParams,
  AssistantsPage,
  AssistantUpdateParams,
  RequestOptions,
} from "@open-ai/open-ai.type";
import { getRequestOptions } from "@open-ai/utils/get-request-options";
import { getRequestQueries } from "@open-ai/utils/get-request-queries";

@Injectable()
export class OpenAIAssistantService {
  constructor(private readonly openAI: OpenAIProvider) {}

  async list(query: AssistantListParams, options?: RequestOptions): Promise<AssistantsPage> {
    return await this.openAI.beta.assistants.list(
      getRequestQueries(query),
      getRequestOptions(options),
    );
  }

  async retrieve(assistantID: string, options?: RequestOptions): Promise<Assistant> {
    return await this.openAI.beta.assistants.retrieve(assistantID, getRequestOptions(options));
  }

  async create(body: AssistantCreateParams, options?: RequestOptions): Promise<Assistant> {
    return await this.openAI.beta.assistants.create(body, options);
  }

  async update(
    assistantID: string,
    body: Partial<AssistantUpdateParams>,
    options?: RequestOptions,
  ): Promise<Assistant> {
    return await this.openAI.beta.assistants.update(assistantID, body, getRequestOptions(options));
  }

  async delete(assistantId: string, options?: RequestOptions): Promise<AssistantDeleted> {
    return await this.openAI.beta.assistants.delete(assistantId, getRequestOptions(options));
  }
}
