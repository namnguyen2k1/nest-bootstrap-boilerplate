import { Injectable } from '@nestjs/common';
import { OpenAIProvider } from '@open-ai/open-ai.provider';
import {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
  LengthFinishReasonError,
  ParsedChatCompletion,
  RequestOptions,
} from '@open-ai/open-ai.type';
import { getRequestOptions } from '@open-ai/utils/get-request-options';

@Injectable()
export class OpenAIChatCompletionService {
  constructor(private readonly openAI: OpenAIProvider) {}

  async create(
    body: ChatCompletionCreateParamsNonStreaming,
    options?: RequestOptions,
  ): Promise<ChatCompletion> {
    return await this.openAI.chat.completions.create(
      body,
      getRequestOptions(options),
    );
  }

  async parse<T>(
    body: ChatCompletionCreateParamsNonStreaming,
    options?: RequestOptions,
  ): Promise<ParsedChatCompletion<T>> {
    try {
      const result = await this.openAI.chat.completions.parse(
        body,
        getRequestOptions(options),
      );
      return result as ParsedChatCompletion<T>;
    } catch (error) {
      if (error instanceof LengthFinishReasonError) {
        const result = await this.openAI.chat.completions.parse(
          body,
          getRequestOptions(options),
        );
        return result as ParsedChatCompletion<T>;
      }
      throw error;
    }
  }
}
